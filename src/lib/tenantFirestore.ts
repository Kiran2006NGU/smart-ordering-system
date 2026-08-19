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
  deleteDoc,
  onSnapshot,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { app } from './firebase';
import { MenuItem, LuckyCoupon, RestaurantInfo, OrderRecord, OrderStatus } from '../types';
import { MENU_ITEMS, LUCKY_COUPONS, DEFAULT_RESTAURANT_INFO } from '../data/menuData';

// Use the already-initialized Firestore instance
import { db } from './firebase';

// ========== RESTAURANT INFO ==========

export interface TenantRestaurantInfo extends RestaurantInfo {
  slug: string;
  ownerUid: string;
  createdAt: string;
  logoUrl?: string;
}

/**
 * Create a new restaurant for a first-time owner.
 * Also creates the slug→owner reverse lookup.
 */
export async function createRestaurant(
  ownerUid: string,
  slug: string,
  info: RestaurantInfo
): Promise<void> {
  const batch = writeBatch(db);

  // 1. Create the restaurant document
  const restaurantRef = doc(db, 'restaurants', ownerUid);
  batch.set(restaurantRef, {
    ...info,
    slug,
    ownerUid,
    createdAt: new Date().toISOString()
  });

  // 2. Create the slug reverse lookup
  const slugRef = doc(db, 'slugs', slug);
  batch.set(slugRef, { ownerUid });

  // 3. Update user profile with restaurantSlug
  const userRef = doc(db, 'users', ownerUid);
  batch.set(userRef, {
    restaurantSlug: slug,
    role: 'manager',
    lastLoginAt: new Date().toISOString()
  }, { merge: true });

  await batch.commit();
}

/**
 * Seed the default menu items for a new restaurant.
 */
export async function seedDefaultMenu(ownerUid: string): Promise<void> {
  const batch = writeBatch(db);
  for (const item of MENU_ITEMS) {
    const itemRef = doc(db, 'restaurants', ownerUid, 'menu', item.id);
    batch.set(itemRef, item);
  }
  await batch.commit();
}

/**
 * Seed the default coupons for a new restaurant.
 */
export async function seedDefaultCoupons(ownerUid: string): Promise<void> {
  const batch = writeBatch(db);
  for (const coupon of LUCKY_COUPONS) {
    const couponRef = doc(db, 'restaurants', ownerUid, 'coupons', coupon.code);
    batch.set(couponRef, coupon);
  }
  await batch.commit();
}

/**
 * Check if a slug is available.
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const slugRef = doc(db, 'slugs', slug);
  const snap = await getDoc(slugRef);
  return !snap.exists();
}

/**
 * Get restaurant info by owner UID.
 */
export async function getRestaurantByOwner(ownerUid: string): Promise<TenantRestaurantInfo | null> {
  const ref = doc(db, 'restaurants', ownerUid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as TenantRestaurantInfo;
}

/**
 * Get restaurant info by public slug.
 * First resolves slug → ownerUid, then loads the restaurant.
 */
export async function getRestaurantBySlug(slug: string): Promise<{ ownerUid: string; info: TenantRestaurantInfo } | null> {
  const slugRef = doc(db, 'slugs', slug);
  const slugSnap = await getDoc(slugRef);
  if (!slugSnap.exists()) return null;

  const ownerUid = slugSnap.data().ownerUid;
  const info = await getRestaurantByOwner(ownerUid);
  if (!info) return null;

  return { ownerUid, info };
}

/**
 * Update restaurant info (owner action).
 */
export async function updateRestaurantInfo(ownerUid: string, info: Partial<RestaurantInfo>): Promise<void> {
  const ref = doc(db, 'restaurants', ownerUid);
  await updateDoc(ref, info);
}

// ========== MENU ITEMS ==========

/**
 * Load all menu items for a restaurant.
 */
export async function getMenuItems(ownerUid: string): Promise<MenuItem[]> {
  const q = query(collection(db, 'restaurants', ownerUid, 'menu'));
  const snap = await getDocs(q);
  const items: MenuItem[] = [];
  snap.forEach(d => items.push(d.data() as MenuItem));
  return items;
}

/**
 * Save (create or update) a menu item.
 */
export async function saveMenuItem(ownerUid: string, item: MenuItem): Promise<void> {
  const ref = doc(db, 'restaurants', ownerUid, 'menu', item.id);
  await setDoc(ref, item);
}

/**
 * Delete a menu item.
 */
export async function deleteMenuItem(ownerUid: string, itemId: string): Promise<void> {
  const ref = doc(db, 'restaurants', ownerUid, 'menu', itemId);
  await deleteDoc(ref);
}

// ========== COUPONS ==========

/**
 * Load all coupons for a restaurant.
 */
export async function getCoupons(ownerUid: string): Promise<LuckyCoupon[]> {
  const q = query(collection(db, 'restaurants', ownerUid, 'coupons'));
  const snap = await getDocs(q);
  const coupons: LuckyCoupon[] = [];
  snap.forEach(d => coupons.push(d.data() as LuckyCoupon));
  return coupons;
}

/**
 * Save (create or update) a coupon.
 */
export async function saveCoupon(ownerUid: string, coupon: LuckyCoupon): Promise<void> {
  const ref = doc(db, 'restaurants', ownerUid, 'coupons', coupon.code);
  await setDoc(ref, coupon);
}

/**
 * Delete a coupon.
 */
export async function deleteCouponFromFirestore(ownerUid: string, couponCode: string): Promise<void> {
  const ref = doc(db, 'restaurants', ownerUid, 'coupons', couponCode);
  await deleteDoc(ref);
}

// ========== ORDERS ==========

/**
 * Save a customer order under the restaurant.
 */
export async function saveOrder(ownerUid: string, order: OrderRecord): Promise<void> {
  const ref = doc(db, 'restaurants', ownerUid, 'orders', order.orderId);
  await setDoc(ref, {
    ...order,
    syncedAt: new Date().toISOString()
  });
}

/**
 * Load all orders for a restaurant (owner view).
 */
export async function getOrders(ownerUid: string): Promise<OrderRecord[]> {
  const q = query(
    collection(db, 'restaurants', ownerUid, 'orders'),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  const snap = await getDocs(q);
  const orders: OrderRecord[] = [];
  snap.forEach(d => orders.push(d.data() as OrderRecord));
  return orders;
}

/**
 * Update order status (owner action).
 */
export async function updateOrderStatus(ownerUid: string, orderId: string, status: OrderStatus): Promise<void> {
  const ref = doc(db, 'restaurants', ownerUid, 'orders', orderId);
  await updateDoc(ref, { orderStatus: status });
}

/**
 * Real-time listener for new orders (owner dashboard).
 */
export function subscribeToOrders(ownerUid: string, onUpdate: (orders: OrderRecord[]) => void) {
  const q = query(
    collection(db, 'restaurants', ownerUid, 'orders'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  return onSnapshot(q, (snapshot) => {
    const orders: OrderRecord[] = [];
    snapshot.forEach(d => orders.push(d.data() as OrderRecord));
    onUpdate(orders);
  }, (error) => {
    console.warn('Orders subscription error:', error);
  });
}

// ========== ALL RESTAURANTS (SUPER ADMIN) ==========

/**
 * Load all registered restaurants on the platform (Super Admin view).
 */
export async function getAllRestaurants(): Promise<TenantRestaurantInfo[]> {
  try {
    const snap = await getDocs(collection(db, 'restaurants'));
    const list: TenantRestaurantInfo[] = [];
    snap.forEach(d => list.push(d.data() as TenantRestaurantInfo));
    return list;
  } catch (e) {
    console.warn('Error fetching all restaurants:', e);
    return [];
  }
}
