import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  onSnapshot,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { UserAccount, OrderRecord } from '../types';

// Re-export auth state listener for use in App
export { onAuthStateChanged };
export type { FirebaseUser };

// Initialize Firebase App
const firebaseConfig = {
  projectId: firebaseConfigJson.projectId,
  appId: firebaseConfigJson.appId,
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, (firebaseConfigJson as any).firestoreDatabaseId || '(default)');

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export interface UserLogRecord {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  action: 'login' | 'signup' | 'order_placed' | 'profile_update' | 'logout';
  provider: 'google.com' | 'password' | 'phone' | 'guest';
  timestamp: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface FirestoreUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  provider: string;
  phone?: string;
  createdAt: string;
  lastLoginAt: string;
  totalOrders?: number;
  totalSpent?: number;
}

// 1. Sign In With Real Google Account
export async function signInWithGoogle(): Promise<{ user: UserAccount; isNewUser: boolean }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    
    const isNewUser = (result as any)._tokenResponse?.isNewUser ?? false;
    const userRole = fbUser.email && (
      fbUser.email.includes('admin') || 
      fbUser.email === 'kirankumarbehera2006@gmail.com'
    ) ? 'admin' : 'customer';

    const userAccount: UserAccount = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google User',
      email: fbUser.email || '',
      role: userRole,
      avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
      mobile: fbUser.phoneNumber || '',
      loginMethod: 'google',
      loyaltyPoints: isNewUser ? 100 : 250
    };

    // Record user profile and log to Firestore
    await recordUserSession(fbUser, userAccount, isNewUser ? 'signup' : 'login', 'google.com');

    return { user: userAccount, isNewUser };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// 2. Sign Up with Email & Password
export async function signUpWithEmail(email: string, pass: string, displayName: string): Promise<UserAccount> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const fbUser = result.user;

  const userRole = email.includes('admin') || email === 'kirankumarbehera2006@gmail.com' ? 'admin' : 'customer';

  const userAccount: UserAccount = {
    id: fbUser.uid,
    name: displayName || email.split('@')[0],
    email: fbUser.email || email,
    role: userRole,
    mobile: '',
    loginMethod: 'email',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName || email}`,
    loyaltyPoints: 100
  };

  await recordUserSession(fbUser, userAccount, 'signup', 'password');
  return userAccount;
}

// 3. Sign In with Email & Password
export async function signInWithEmail(email: string, pass: string): Promise<UserAccount> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const fbUser = result.user;

  // Retrieve existing user profile from Firestore if available
  let userRole: 'customer' | 'admin' = email.includes('admin') || email === 'kirankumarbehera2006@gmail.com' ? 'admin' : 'customer';
  let displayName = email.split('@')[0];
  let photo = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

  try {
    const userDocRef = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data() as FirestoreUserProfile;
      if (data.role) userRole = data.role;
      if (data.displayName) displayName = data.displayName;
      if (data.photoURL) photo = data.photoURL;
    }
  } catch (e) {
    console.warn('Could not read user profile from Firestore:', e);
  }

  const userAccount: UserAccount = {
    id: fbUser.uid,
    name: displayName,
    email: fbUser.email || email,
    role: userRole,
    mobile: '',
    loginMethod: 'email',
    avatar: photo,
    loyaltyPoints: 200
  };

  await recordUserSession(fbUser, userAccount, 'login', 'password');
  return userAccount;
}

// 4. Log out
export async function logOut(): Promise<void> {
  try {
    const current = auth.currentUser;
    if (current) {
      // Record logout action
      await addDoc(collection(db, 'user_logs'), {
        uid: current.uid,
        email: current.email || '',
        displayName: current.displayName || 'User',
        action: 'logout',
        provider: current.providerData[0]?.providerId || 'password',
        timestamp: new Date().toISOString()
      });
    }
  } catch (e) {}
  await signOut(auth);
}

// Helper: Record User Profile and User Activity Log in Firestore
export async function recordUserSession(
  fbUser: FirebaseUser, 
  account: UserAccount, 
  action: 'login' | 'signup' | 'order_placed',
  provider: 'google.com' | 'password' | 'phone' | 'guest',
  extraDetails?: string
) {
  try {
    const now = new Date().toISOString();
    const userDocRef = doc(db, 'users', fbUser.uid);
    
    // Check if user already exists
    const existingSnap = await getDoc(userDocRef);
    if (!existingSnap.exists()) {
      await setDoc(userDocRef, {
        uid: fbUser.uid,
        email: account.email,
        displayName: account.name,
        photoURL: account.avatar,
        role: account.role,
        provider: provider,
        phone: account.mobile || '',
        createdAt: now,
        lastLoginAt: now,
        totalOrders: 0,
        totalSpent: 0
      });
    } else {
      await updateDoc(userDocRef, {
        lastLoginAt: now,
        displayName: account.name || existingSnap.data()?.displayName,
        photoURL: account.avatar || existingSnap.data()?.photoURL
      });
    }

    // Append to user_logs collection
    await addDoc(collection(db, 'user_logs'), {
      uid: fbUser.uid,
      email: account.email,
      displayName: account.name,
      photoURL: account.avatar || null,
      action: action,
      provider: provider,
      timestamp: now,
      details: extraDetails || `User authenticated via ${provider}`,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
    });
  } catch (error) {
    console.error('Failed to sync user session to Firestore:', error);
  }
}

// 5. Store Order to Firestore Database
export async function saveOrderToFirestore(order: OrderRecord, userAccount?: UserAccount | null): Promise<void> {
  try {
    const orderDocRef = doc(db, 'orders', order.orderId);
    await setDoc(orderDocRef, {
      ...order,
      syncedAt: new Date().toISOString()
    });

    // Record order placed log in user_logs
    const uid = auth.currentUser?.uid || userAccount?.id || `guest-${order.customer.mobile || 'anon'}`;
    const email = auth.currentUser?.email || userAccount?.email || order.customer.email || `${order.customer.mobile}@guest.com`;
    const displayName = order.customer.name || userAccount?.name || 'Customer';

    await addDoc(collection(db, 'user_logs'), {
      uid,
      email,
      displayName,
      action: 'order_placed',
      provider: auth.currentUser?.providerData[0]?.providerId || userAccount?.loginMethod || 'guest',
      timestamp: new Date().toISOString(),
      details: `Placed Order #${order.orderNumber} for Rs. ${order.finalTotal} (${order.paymentMethod.toUpperCase()})`
    });

    // Increment user order stats if user document exists
    if (auth.currentUser || (userAccount && userAccount.id)) {
      const targetUid = auth.currentUser?.uid || userAccount?.id;
      if (targetUid) {
        const userDocRef = doc(db, 'users', targetUid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const currentOrders = userSnap.data()?.totalOrders || 0;
          const currentSpent = userSnap.data()?.totalSpent || 0;
          await updateDoc(userDocRef, {
            totalOrders: currentOrders + 1,
            totalSpent: currentSpent + order.finalTotal
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to save order to Firestore:', error);
  }
}

// 6. Fetch All Registered Users from Firestore (For Admin Dashboard)
export async function fetchAllUsersFromFirestore(): Promise<FirestoreUserProfile[]> {
  try {
    const q = query(collection(db, 'users'), limit(100));
    const snapshot = await getDocs(q);
    const users: FirestoreUserProfile[] = [];
    snapshot.forEach(docSnap => {
      users.push(docSnap.data() as FirestoreUserProfile);
    });
    return users;
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
    return [];
  }
}

// 7. Fetch All User Activity Logs from Firestore (For Admin Dashboard)
export async function fetchAllUserLogsFromFirestore(): Promise<UserLogRecord[]> {
  try {
    const q = query(collection(db, 'user_logs'), orderBy('timestamp', 'desc'), limit(150));
    const snapshot = await getDocs(q);
    const logs: UserLogRecord[] = [];
    snapshot.forEach(docSnap => {
      logs.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<UserLogRecord, 'id'>)
      });
    });
    return logs;
  } catch (error) {
    console.error('Error fetching logs from Firestore:', error);
    return [];
  }
}

// 8. Real-time Listeners for Orders from Firestore
export function subscribeToOrders(onUpdate: (orders: OrderRecord[]) => void) {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const orders: OrderRecord[] = [];
      snapshot.forEach(docSnap => {
        orders.push(docSnap.data() as OrderRecord);
      });
      if (orders.length > 0) {
        onUpdate(orders);
      }
    }, (error) => {
      console.warn('Orders real-time subscription error:', error);
    });
  } catch (e) {
    console.warn('Could not initialize orders subscription:', e);
    return () => {};
  }
}
