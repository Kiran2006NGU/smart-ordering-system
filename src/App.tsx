import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  HeroBanner 
} from './components/HeroBanner';
import { 
  HeroCarousel 
} from './components/HeroCarousel';
import { 
  CategoryRail 
} from './components/CategoryRail';
import { 
  FlashSaleBar 
} from './components/FlashSaleBar';
import { 
  MenuSection 
} from './components/MenuSection';
import { 
  CombosSection 
} from './components/CombosSection';
import { 
  CustomerReviewsSection 
} from './components/CustomerReviewsSection';
import { 
  ProductDetailModal 
} from './components/ProductDetailModal';
import { 
  WishlistDrawer 
} from './components/WishlistDrawer';
import { 
  ItemCustomizerModal 
} from './components/ItemCustomizerModal';
import { 
  LuckyCouponGame 
} from './components/LuckyCouponGame';
import { 
  CartDrawer 
} from './components/CartDrawer';
import { 
  CustomerModal 
} from './components/CustomerModal';
import { 
  CheckoutView 
} from './components/CheckoutView';
import { 
  PaymentGatewayModal 
} from './components/PaymentGatewayModal';
import { 
  OrderTrackerView 
} from './components/OrderTrackerView';
import { 
  OrderHistoryView 
} from './components/OrderHistoryView';
import { 
  AIChefAssistantModal 
} from './components/AIChefAssistantModal';
import { 
  FloatingRobotAIBot 
} from './components/FloatingRobotAIBot';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  AdminDashboard 
} from './components/AdminDashboard';
import { 
  VoiceSettingsModal 
} from './components/VoiceSettingsModal';
import { 
  ErrorBoundary 
} from './components/ErrorBoundary';
import { 
  LandingPage 
} from './components/LandingPage';
import { 
  OnboardingWizard 
} from './components/OnboardingWizard';
import { 
  Footer 
} from './components/Footer';

import { 
  MENU_ITEMS, 
  LUCKY_COUPONS, 
  DEFAULT_RESTAURANT_INFO, 
  DEFAULT_USERS 
} from './data/menuData';
import { 
  MenuItem, 
  CartItem, 
  CustomerDetails, 
  LuckyCoupon, 
  OrderRecord, 
  PaymentMethod,
  MenuItemOption,
  RestaurantInfo,
  UserAccount,
  OrderStatus,
  SubCategoryType
} from './types';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { auth, onAuthStateChanged, FirebaseUser } from './lib/firebase';
import { useRoute, navigate } from './lib/router';
import { 
  getRestaurantByOwner, 
  getRestaurantBySlug, 
  getAllRestaurants,
  getMenuItems, 
  getCoupons, 
  getOrders, 
  saveMenuItem, 
  deleteMenuItem, 
  saveCoupon, 
  deleteCouponFromFirestore, 
  saveOrder, 
  updateRestaurantInfo, 
  updateOrderStatus,
  subscribeToOrders,
  TenantRestaurantInfo
} from './lib/tenantFirestore';

export default function App() {
  const routeInfo = useRoute();
  
  // Navigation tabs: 'home' | 'menu' | 'combos' | 'history' | 'checkout' | 'tracker' | 'admin'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Multi-Tenant context state
  const [activeOwnerUid, setActiveOwnerUid] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);
  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(false);
  const [storeNotFound, setStoreNotFound] = useState<boolean>(false);

  // Current Logged-in User Account
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('fb_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Voice Assistant Hook with multi-voice support
  const {
    voiceEnabled,
    voiceSettings,
    activePersona,
    personas,
    availableVoices,
    toggleVoice,
    updateVoiceSettings,
    stopSpeaking,
    testPersona,
    isSpeaking,
    speakWelcome,
    speakCategory,
    speakItemAdded,
    speakLuckyCoupon,
    speakCouponApplied,
    speakCheckout,
    speakOrderSuccess
  } = useVoiceAssistant();

  // Voice Studio Modal State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Restaurant Brand and Info CMS state
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(() => {
    const saved = localStorage.getItem('fb_restaurant_info');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_RESTAURANT_INFO;
  });

  // Dynamic Menu Items Catalog state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('fb_menu_catalog_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return MENU_ITEMS;
  });

  // Dynamic Coupons state
  const [coupons, setCoupons] = useState<LuckyCoupon[]>(() => {
    const saved = localStorage.getItem('fb_coupons_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return LUCKY_COUPONS;
  });

  // Customer state
  const [customer, setCustomer] = useState<CustomerDetails>(() => {
    const saved = localStorage.getItem('fb_customer');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Guest Diner',
      mobile: '',
      orderType: 'dine_in',
      tableNumber: 'Table 1'
    };
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('fb_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Applied Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<LuckyCoupon | null>(() => {
    const saved = localStorage.getItem('fb_coupon');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Active Order & Order History
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(() => {
    const saved = localStorage.getItem('fb_active_order');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>(() => {
    const saved = localStorage.getItem('fb_order_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isLuckyModalOpen, setIsLuckyModalOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAiChefOpen, setIsAiChefOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // E-Commerce Wishlist state & Quick View state
  const [wishlist, setWishlist] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('fb_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<SubCategoryType>('all');

  const wishlistIds = useMemo(() => new Set(wishlist.map(w => w.id)), [wishlist]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const isMaster = fbUser.email === 'kirankumarbehera2006@gmail.com' || fbUser.email === 'admin@smartdine.com';
        
        let determinedRole: 'customer' | 'manager' | 'admin' = isMaster ? 'admin' : 'customer';

        // Check if there is an existing restaurant owned by this user
        if (!isMaster) {
          try {
            const existingRest = await getRestaurantByOwner(fbUser.uid);
            if (existingRest) {
              determinedRole = 'manager';
            }
          } catch (e) {
            console.warn('Error checking manager ownership on login:', e);
          }
        }

        const userAccount: UserAccount = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          mobile: fbUser.phoneNumber || '',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
          role: determinedRole,
          loginMethod: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
          loyaltyPoints: 300
        };
        setCurrentUser(userAccount);
        localStorage.setItem('fb_current_user', JSON.stringify(userAccount));
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync user changes to customer form
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fb_current_user', JSON.stringify(currentUser));
      setCustomer(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        mobile: currentUser.mobile || prev.mobile
      }));
    } else {
      localStorage.removeItem('fb_current_user');
    }
  }, [currentUser]);

  // Routing and Tenant Data Loader
  useEffect(() => {
    const loadTenantData = async () => {
      setStoreNotFound(false);

      // SCENARIO 1: Public Customer Storefront (/r/:slug)
      if (routeInfo.route === 'store' && routeInfo.slug) {
        setIsLoadingStore(true);
        try {
          const res = await getRestaurantBySlug(routeInfo.slug);
          if (res) {
            setActiveOwnerUid(res.ownerUid);
            setActiveSlug(res.info.slug);
            setRestaurantInfo(res.info);

            // Load menu & coupons
            const [loadedMenu, loadedCoupons] = await Promise.all([
              getMenuItems(res.ownerUid),
              getCoupons(res.ownerUid)
            ]);

            if (loadedMenu.length > 0) setMenuItems(loadedMenu);
            if (loadedCoupons.length > 0) setCoupons(loadedCoupons);
          } else {
            // Fallback for default local store or missing store
            if (routeInfo.slug === 'smart-food-dine' || routeInfo.slug === 'default') {
              setActiveSlug('smart-food-dine');
              setRestaurantInfo(DEFAULT_RESTAURANT_INFO);
              setMenuItems(MENU_ITEMS);
              setCoupons(LUCKY_COUPONS);
            } else {
              setStoreNotFound(true);
            }
          }
        } catch (e) {
          console.warn('Error loading store by slug:', e);
        } finally {
          setIsLoadingStore(false);
        }
        return;
      }

      // SCENARIO 2: Dashboard (/dashboard)
      if (routeInfo.route === 'dashboard') {
        if (!currentUser) {
          // If not logged in, we stay on landing or open login
          return;
        }

        if (currentUser.role === 'customer') {
          // Customers do not have dashboard access
          if (activeSlug) {
            navigate(`/r/${activeSlug}`);
          } else {
            navigate('/');
          }
          return;
        }

        // Super Admin is platform owner — direct access to Master CMS, no restaurant setup required!
        if (currentUser.role === 'admin') {
          setNeedsOnboarding(false);
          setIsLoadingStore(true);
          try {
            const allRest = await getAllRestaurants();
            if (allRest.length > 0) {
              const firstRest = allRest[0];
              setActiveOwnerUid(firstRest.ownerUid);
              setActiveSlug(firstRest.slug);
              setRestaurantInfo(firstRest);

              const [loadedMenu, loadedCoupons, loadedOrders] = await Promise.all([
                getMenuItems(firstRest.ownerUid),
                getCoupons(firstRest.ownerUid),
                getOrders(firstRest.ownerUid)
              ]);
              if (loadedMenu.length > 0) setMenuItems(loadedMenu);
              if (loadedCoupons.length > 0) setCoupons(loadedCoupons);
              if (loadedOrders.length > 0) setOrderHistory(loadedOrders);
            } else {
              setActiveSlug('smart-food-dine');
              setRestaurantInfo(DEFAULT_RESTAURANT_INFO);
              setMenuItems(MENU_ITEMS);
              setCoupons(LUCKY_COUPONS);
            }
          } catch (e) {
            console.warn('Error loading admin platform data:', e);
            setActiveSlug('smart-food-dine');
            setRestaurantInfo(DEFAULT_RESTAURANT_INFO);
          } finally {
            setIsLoadingStore(false);
          }
          return;
        }

        // Restaurant Manager — load their specific store or prompt onboarding
        setIsLoadingStore(true);
        try {
          const ownerRestaurant = await getRestaurantByOwner(currentUser.id);
          if (ownerRestaurant) {
            setActiveOwnerUid(currentUser.id);
            setActiveSlug(ownerRestaurant.slug);
            setRestaurantInfo(ownerRestaurant);
            setNeedsOnboarding(false);

            // Load menu, coupons, orders
            const [loadedMenu, loadedCoupons, loadedOrders] = await Promise.all([
              getMenuItems(currentUser.id),
              getCoupons(currentUser.id),
              getOrders(currentUser.id)
            ]);

            if (loadedMenu.length > 0) setMenuItems(loadedMenu);
            if (loadedCoupons.length > 0) setCoupons(loadedCoupons);
            if (loadedOrders.length > 0) setOrderHistory(loadedOrders);
          } else {
            // New manager needs onboarding
            setNeedsOnboarding(true);
          }
        } catch (e) {
          console.warn('Error loading owner restaurant:', e);
          setNeedsOnboarding(true);
        } finally {
          setIsLoadingStore(false);
        }
        return;
      }

      // SCENARIO 3: Landing Page (/)
      if (routeInfo.route === 'landing') {
        setNeedsOnboarding(false);
      }
    };

    loadTenantData();
  }, [routeInfo, currentUser]);

  // Real-time order synchronization for owner dashboard
  useEffect(() => {
    if (activeOwnerUid && (routeInfo.route === 'dashboard' || currentTab === 'admin')) {
      const unsub = subscribeToOrders(activeOwnerUid, (orders) => {
        setOrderHistory(orders);
      });
      return () => {
        if (unsub) unsub();
      };
    }
  }, [activeOwnerUid, routeInfo.route, currentTab]);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('fb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('fb_restaurant_info', JSON.stringify(restaurantInfo));
  }, [restaurantInfo]);

  useEffect(() => {
    localStorage.setItem('fb_menu_catalog_v2', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('fb_coupons_v2', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('fb_customer', JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    localStorage.setItem('fb_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('fb_coupon', JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('fb_order_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('fb_active_order', JSON.stringify(activeOrder));
    }
  }, [activeOrder]);

  // Dynamic browser title synchronization
  useEffect(() => {
    if (restaurantInfo?.name) {
      document.title = `${restaurantInfo.name} - Smart Ordering System`;
    }
  }, [restaurantInfo?.name]);

  // Cart counts & totals
  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartItems]);

  const cartQuantityByItemId = useMemo(() => {
    const map: { [itemId: string]: number } = {};
    cartItems.forEach(item => {
      map[item.menuItem.id] = (map[item.menuItem.id] || 0) + item.quantity;
    });
    return map;
  }, [cartItems]);

  // Cart operations
  const handleAddToCart = useCallback((item: MenuItem) => {
    if (item.inStock === false) {
      alert(`${item.name} is currently out of stock.`);
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.menuItem.id === item.id && !i.selectedSize && !i.selectedSpice && !i.selectedAddOns);
      if (existing) {
        return prev.map(i => 
          i.cartItemId === existing.cartItemId 
            ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * i.unitPrice }
            : i
        );
      } else {
        const newItem: CartItem = {
          cartItemId: `${item.id}-${Date.now()}`,
          menuItem: item,
          quantity: 1,
          unitPrice: item.price,
          totalPrice: item.price
        };
        return [...prev, newItem];
      }
    });

    speakItemAdded(item.name, 1);
  }, [speakItemAdded]);

  const handleUpdateQuantity = useCallback((item: MenuItem, newQty: number) => {
    if (newQty <= 0) {
      setCartItems(prev => prev.filter(i => i.menuItem.id !== item.id));
    } else {
      setCartItems(prev => {
        const existing = prev.find(i => i.menuItem.id === item.id);
        if (existing) {
          return prev.map(i => 
            i.menuItem.id === item.id 
              ? { ...i, quantity: newQty, totalPrice: newQty * i.unitPrice }
              : i
          );
        } else {
          return [...prev, {
            cartItemId: `${item.id}-${Date.now()}`,
            menuItem: item,
            quantity: newQty,
            unitPrice: item.price,
            totalPrice: newQty * item.price
          }];
        }
      });
      speakItemAdded(item.name, newQty);
    }
  }, [speakItemAdded]);

  const handleUpdateCartItemQuantity = useCallback((cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
    } else {
      setCartItems(prev => prev.map(i => 
        i.cartItemId === cartItemId 
          ? { ...i, quantity: newQty, totalPrice: newQty * i.unitPrice }
          : i
      ));
    }
  }, []);

  const handleRemoveCartItem = useCallback((cartItemId: string) => {
    setCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  // Wishlist operations
  const handleToggleWishlist = useCallback((item: MenuItem) => {
    setWishlist(prev => {
      const exists = prev.some(w => w.id === item.id);
      if (exists) {
        return prev.filter(w => w.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const handleRemoveFromWishlist = useCallback((itemId: string) => {
    setWishlist(prev => prev.filter(w => w.id !== itemId));
  }, []);

  const handleMoveAllWishlistToCart = useCallback(() => {
    wishlist.forEach(item => {
      handleAddToCart(item);
    });
    setWishlist([]);
    setIsWishlistOpen(false);
  }, [wishlist, handleAddToCart]);

  // Quick View handler
  const handleOpenQuickView = useCallback((item: MenuItem) => {
    setQuickViewItem(item);
  }, []);

  const handleQuickViewAddToCart = useCallback((customized: {
    menuItem: MenuItem;
    quantity: number;
    selectedSize?: string;
    selectedSpice?: string;
    selectedAddOns?: MenuItemOption[];
    specialInstructions?: string;
    unitPrice: number;
    totalPrice: number;
  }) => {
    const newCartItem: CartItem = {
      cartItemId: `${customized.menuItem.id}-${Date.now()}`,
      menuItem: customized.menuItem,
      quantity: customized.quantity,
      selectedSize: customized.selectedSize,
      selectedSpice: customized.selectedSpice,
      selectedAddOns: customized.selectedAddOns,
      specialInstructions: customized.specialInstructions,
      unitPrice: customized.unitPrice,
      totalPrice: customized.totalPrice
    };

    setCartItems(prev => [...prev, newCartItem]);
    speakItemAdded(customized.menuItem.name, customized.quantity);
  }, [speakItemAdded]);

  const handleConfirmCustomization = useCallback((
    item: MenuItem,
    quantity: number,
    selectedSize?: string,
    selectedSpice?: string,
    selectedAddOns?: MenuItemOption[],
    specialInstructions?: string
  ) => {
    const sizeMultiplier = item.customizations?.sizes?.find(s => s.name === selectedSize)?.priceMultiplier || 1.0;
    const baseCalculatedPrice = Math.round(item.price * sizeMultiplier);
    const addOnsTotal = selectedAddOns ? selectedAddOns.reduce((sum, add) => sum + add.price, 0) : 0;
    const unitPrice = baseCalculatedPrice + addOnsTotal;

    const newCartItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}`,
      menuItem: item,
      quantity,
      selectedSize,
      selectedSpice,
      selectedAddOns,
      specialInstructions,
      unitPrice,
      totalPrice: unitPrice * quantity
    };

    setCartItems(prev => [...prev, newCartItem]);
    speakItemAdded(item.name, quantity);
  }, [speakItemAdded]);

  // Coupon handling
  const handleApplyCoupon = useCallback((coupon: LuckyCoupon | null) => {
    setAppliedCoupon(coupon);
    if (coupon) {
      const discount = Math.round((totalCartPrice * coupon.discountPercent) / 100);
      speakCouponApplied(discount);
    }
  }, [totalCartPrice, speakCouponApplied]);

  // Custom Combo Add
  const handleAddCustomCombo = useCallback((customBundle: MenuItem) => {
    handleAddToCart(customBundle);
  }, [handleAddToCart]);

  // AI Chef direct add
  const handleAddByName = useCallback((itemName: string) => {
    const found = menuItems.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
    if (found) {
      handleAddToCart(found);
    }
  }, [menuItems, handleAddToCart]);

  // Transition to Checkout
  const handleProceedToCheckout = useCallback(() => {
    if (!customer.name || !customer.mobile) {
      setIsCustomerModalOpen(true);
      return;
    }
    setCurrentTab('checkout');
    speakCheckout();
  }, [customer, speakCheckout]);

  // Payment Success & Order Placement
  const handlePaymentSuccess = useCallback((method: PaymentMethod, txId: string) => {
    const originalTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 0;
    const discountAmount = Math.round((originalTotal * discountPercent) / 100);
    const subtotalAfterDiscount = originalTotal - discountAmount;
    const gstRate = (restaurantInfo.gstPercentage || 5) / 100;
    const gstAmount = +(subtotalAfterDiscount * gstRate).toFixed(2);
    const deliveryFee = customer.orderType === 'delivery' && subtotalAfterDiscount < 200 ? (restaurantInfo.deliveryFee || 30) : 0;
    const finalTotal = +(subtotalAfterDiscount + gstAmount + deliveryFee).toFixed(2);

    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const newOrder: OrderRecord = {
      orderId: `ORD-${Date.now()}`,
      orderNumber,
      customer: { ...customer },
      items: [...cartItems],
      originalTotal,
      discountAmount,
      couponCode: appliedCoupon?.code,
      discountPercent,
      subtotalAfterDiscount,
      gstAmount,
      deliveryFee,
      finalTotal,
      paymentMethod: method,
      paymentStatus: 'paid',
      transactionId: txId,
      orderStatus: 'placed',
      createdAt: new Date().toISOString(),
      estimatedTimeMinutes: customer.orderType === 'dine_in' ? 12 : 20
    };

    setActiveOrder(newOrder);
    setOrderHistory(prev => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedCoupon(null);
    setIsPaymentOpen(false);
    setCurrentTab('tracker');

    // Persist order to tenant's Firestore database
    const targetOwner = activeOwnerUid || currentUser?.id;
    if (targetOwner) {
      saveOrder(targetOwner, newOrder).catch(err => {
        console.warn('Could not save order to Firestore:', err);
      });
    }

    speakOrderSuccess(orderNumber, restaurantInfo.name);
  }, [cartItems, appliedCoupon, customer, restaurantInfo, currentUser, activeOwnerUid, speakOrderSuccess]);

  const handleReorder = useCallback((orderToReorder: OrderRecord) => {
    setCartItems(orderToReorder.items.map(item => ({
      ...item,
      cartItemId: `${item.menuItem.id}-${Date.now()}-${Math.random()}`
    })));
    setIsCartOpen(true);
  }, []);

  // Admin CMS Handlers (With Firestore Sync)
  const handleUpdateRestaurantInfo = useCallback((newInfo: RestaurantInfo) => {
    setRestaurantInfo(newInfo);
    const targetOwner = activeOwnerUid || currentUser?.id;
    if (targetOwner) {
      updateRestaurantInfo(targetOwner, newInfo).catch(console.warn);
    }
    speakWelcome(customer.name, newInfo.name);
  }, [customer.name, speakWelcome, activeOwnerUid, currentUser]);

  const handleAddMenuItem = useCallback((newItem: MenuItem) => {
    setMenuItems(prev => [newItem, ...prev]);
    const targetOwner = activeOwnerUid || currentUser?.id;
    if (targetOwner) {
      saveMenuItem(targetOwner, newItem).catch(console.warn);
    }
  }, [activeOwnerUid, currentUser]);

  const handleUpdateMenuItem = useCallback((updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    const targetOwner = activeOwnerUid || currentUser?.id;
    if (targetOwner) {
      saveMenuItem(targetOwner, updatedItem).catch(console.warn);
    }
  }, [activeOwnerUid, currentUser]);

  const handleDeleteMenuItem = useCallback((itemId: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
    const targetOwner = activeOwnerUid || currentUser?.id;
    if (targetOwner) {
      deleteMenuItem(targetOwner, itemId).catch(console.warn);
    }
  }, [activeOwnerUid, currentUser]);

  const handleResetMenu = useCallback(() => {
    setMenuItems(MENU_ITEMS);
  }, []);

  const handleAddCoupon = useCallback((newCoupon: LuckyCoupon) => {
    setCoupons(prev => {
      const exists = prev.some(c => c.code === newCoupon.code);
      if (exists) {
        return prev.map(c => c.code === newCoupon.code ? newCoupon : c);
      }
      return [newCoupon, ...prev];
    });
    const targetOwner = activeOwnerUid || currentUser?.id;
    if (targetOwner) {
      saveCoupon(targetOwner, newCoupon).catch(console.warn);
    }
  }, [activeOwnerUid, currentUser]);

  const handleUpdateCoupon = useCallback((updatedCoupon: LuckyCoupon) => {
    setCoupons(prev => prev.map(c => c.code === updatedCoupon.code ? updatedCoupon : c));
    const targetOwner = activeOwnerUid || currentUser?.id;
    if (targetOwner) {
      saveCoupon(targetOwner, updatedCoupon).catch(console.warn);
    }
  }, [activeOwnerUid, currentUser]);

  const handleDeleteCoupon = useCallback((couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
    const targetOwner = activeOwnerUid || currentUser?.id;
    if (targetOwner) {
      deleteCouponFromFirestore(targetOwner, couponCode).catch(console.warn);
    }
  }, [activeOwnerUid, currentUser]);

  const handleUpdateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrderHistory(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: status } : o));
    if (activeOrder && activeOrder.orderId === orderId) {
      setActiveOrder(prev => prev ? { ...prev, orderStatus: status } : null);
    }
    const targetOwner = activeOwnerUid || currentUser?.id;
    if (targetOwner) {
      updateOrderStatus(targetOwner, orderId, status).catch(console.warn);
    }
  }, [activeOrder, activeOwnerUid, currentUser]);

  const handleClearOrders = useCallback(() => {
    setOrderHistory([]);
    setActiveOrder(null);
  }, []);

  const comboItems = useMemo(() => {
    return menuItems.filter(item => item.category === 'combo');
  }, [menuItems]);

  const displayedMenuItems = useMemo(() => {
    if (activeSubcategory === 'all') return menuItems;
    return menuItems.filter(item => {
      if (activeSubcategory === 'combo') return item.category === 'combo';
      const name = item.name.toLowerCase();
      const tags = (item.tags || []).map(t => t.toLowerCase());
      if (activeSubcategory === 'pizza') return name.includes('pizza') || tags.includes('pizza');
      if (activeSubcategory === 'burger') return name.includes('burger') || tags.includes('burger');
      if (activeSubcategory === 'shake') return name.includes('shake') || tags.includes('shake');
      if (activeSubcategory === 'sandwich') return name.includes('sandwich') || tags.includes('sandwich');
      if (activeSubcategory === 'pasta') return name.includes('pasta') || tags.includes('pasta');
      if (activeSubcategory === 'snack') return item.category === 'snack' || tags.includes('fries') || tags.includes('crispy');
      if (activeSubcategory === 'dessert') return item.category === 'dessert' || tags.includes('sweet') || tags.includes('ice');
      if (activeSubcategory === 'refresher') return name.includes('mojito') || tags.includes('chilled') || tags.includes('cooler');
      if (activeSubcategory === 'coffee') return name.includes('coffee') || name.includes('cappuccino') || tags.includes('coffee');
      return true;
    });
  }, [menuItems, activeSubcategory]);

  // ================= RENDER LOGIC =================

  // 1. Loading State
  if (isLoadingStore) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-3 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-400">Loading Smart Restaurant Storefront...</p>
      </div>
    );
  }

  // 2. Store Not Found State
  if (storeNotFound && routeInfo.route === 'store') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/20">
          <span className="text-2xl font-bold">404</span>
        </div>
        <h2 className="text-2xl font-black mb-2">Restaurant Storefront Not Found</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          The link <span className="font-mono text-orange-400">/r/{routeInfo.slug}</span> doesn't match any registered restaurant on SmartDine.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
          >
            Create Your Restaurant
          </button>
        </div>
      </div>
    );
  }

  // 3. First-Time Manager Onboarding Wizard (Managers only, NEVER for Super Admin)
  if (needsOnboarding && currentUser && currentUser.role === 'manager' && (routeInfo.route === 'dashboard' || currentTab === 'admin')) {
    return (
      <OnboardingWizard
        ownerUid={currentUser.id}
        ownerEmail={currentUser.email}
        ownerName={currentUser.name}
        onComplete={(newSlug, newInfo) => {
          setActiveSlug(newSlug);
          setActiveOwnerUid(currentUser.id);
          setRestaurantInfo(newInfo);
          setNeedsOnboarding(false);
          setCurrentTab('admin');
          navigate('/dashboard');
        }}
      />
    );
  }

  // 4. SaaS Landing Page (Home route without an explicit store slug)
  if (routeInfo.route === 'landing' && !currentUser) {
    return (
      <>
        <LandingPage
          onGetStarted={() => setIsAuthModalOpen(true)}
          onSignIn={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={currentUser}
          restaurantInfo={restaurantInfo}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            if (user.role === 'admin' || user.role === 'manager') {
              navigate('/dashboard');
            } else {
              setIsAuthModalOpen(false);
              if (activeSlug) {
                navigate(`/r/${activeSlug}`);
              }
            }
          }}
          onLogout={() => {
            setCurrentUser(null);
            navigate('/');
          }}
        />
      </>
    );
  }

  // 5. Storefront & Owner Dashboard View
  const isPublicCustomerStore = routeInfo.route === 'store';

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
        
        {/* If in Admin Tab and user is not a customer, render the full-screen Admin CMS Dashboard */}
        {currentTab === 'admin' && currentUser?.role !== 'customer' ? (
          <AdminDashboard
            restaurantInfo={restaurantInfo}
            restaurantSlug={activeSlug || 'smart-food-dine'}
            onUpdateRestaurantInfo={handleUpdateRestaurantInfo}
            menuItems={menuItems}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onResetMenu={handleResetMenu}
            coupons={coupons}
            onAddCoupon={handleAddCoupon}
            onUpdateCoupon={handleUpdateCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            orders={orderHistory}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onClearOrders={handleClearOrders}
            onBackToStore={() => setCurrentTab('home')}
            onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
            currentUser={currentUser}
          />
        ) : (
          <>
            {/* Top Main Navigation Header */}
            <Header
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              cartCount={totalCartCount}
              cartTotal={totalCartPrice}
              onOpenCart={() => setIsCartOpen(true)}
              wishlistCount={wishlist.length}
              onOpenWishlist={() => setIsWishlistOpen(true)}
              voiceEnabled={voiceEnabled}
              onToggleVoice={toggleVoice}
              onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
              activePersonaName={activePersona.name}
              isSpeaking={isSpeaking}
              customer={customer}
              restaurantInfo={restaurantInfo}
              currentUser={currentUser}
              onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
              onOpenLuckyModal={() => setIsLuckyModalOpen(true)}
              onOpenAiChef={() => setIsAiChefOpen(true)}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onOpenAdmin={() => setCurrentTab('admin')}
              isPublicStore={isPublicCustomerStore}
              onGoToLanding={() => navigate('/')}
            />

            {/* Amazon-style Category Circular Rail */}
            <CategoryRail
              activeSubcategory={activeSubcategory}
              onSelectSubcategory={(subcat) => {
                setActiveSubcategory(subcat);
                speakCategory(subcat);
              }}
              onOpenLuckyModal={() => setIsLuckyModalOpen(true)}
            />

            {/* Main Content Area */}
            <main className="flex-1">
              {/* VIEW 1: Home Dashboard */}
              {currentTab === 'home' && (
                <div className="space-y-6">
                  {/* Hotstar/Prime-style Hero Media & Deals Carousel */}
                  <HeroCarousel
                    onExploreMenu={() => {
                      setCurrentTab('menu');
                      speakCategory('all');
                    }}
                    onOpenLuckyModal={() => setIsLuckyModalOpen(true)}
                    onOpenCombos={() => {
                      setCurrentTab('combos');
                      speakCategory('combo');
                    }}
                    restaurantInfo={restaurantInfo}
                    customerName={customer.name}
                  />

                  {/* Amazon-Style Flash Sale & Lightning Deals */}
                  <FlashSaleBar
                    menuItems={menuItems}
                    onAddToCart={handleAddToCart}
                    onOpenItemDetail={handleOpenQuickView}
                  />

                  {/* Menu Section */}
                  <MenuSection
                    items={displayedMenuItems}
                    restaurantInfo={restaurantInfo}
                    cartItems={cartQuantityByItemId}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onCustomize={(item) => {
                      setCustomizingItem(item);
                      setIsCustomizerOpen(true);
                    }}
                    onCategoryChange={speakCategory}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={handleOpenQuickView}
                  />

                  {/* Combos Preview */}
                  <CombosSection
                    combos={comboItems}
                    allItems={menuItems}
                    restaurantInfo={restaurantInfo}
                    onAddToCart={handleAddToCart}
                    onAddCustomCombo={handleAddCustomCombo}
                  />

                  {/* Verified Customer Reviews Section */}
                  <CustomerReviewsSection
                    restaurantInfo={restaurantInfo}
                  />
                </div>
              )}

              {/* VIEW 2: Dedicated Full Menu */}
              {currentTab === 'menu' && (
                <div className="space-y-6">
                  <MenuSection
                    items={displayedMenuItems}
                    restaurantInfo={restaurantInfo}
                    cartItems={cartQuantityByItemId}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onCustomize={(item) => {
                      setCustomizingItem(item);
                      setIsCustomizerOpen(true);
                    }}
                    onCategoryChange={speakCategory}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={handleOpenQuickView}
                  />

                  <CustomerReviewsSection
                    restaurantInfo={restaurantInfo}
                  />
                </div>
              )}

              {/* VIEW 3: Combos & Platters */}
              {currentTab === 'combos' && (
                <div className="space-y-6">
                  <CombosSection
                    combos={comboItems}
                    allItems={menuItems}
                    restaurantInfo={restaurantInfo}
                    onAddToCart={handleAddToCart}
                    onAddCustomCombo={handleAddCustomCombo}
                  />

                  <CustomerReviewsSection
                    restaurantInfo={restaurantInfo}
                  />
                </div>
              )}

              {/* VIEW 4: Order History */}
              {currentTab === 'history' && (
                <OrderHistoryView
                  orders={orderHistory}
                  onViewOrder={(order) => {
                    setActiveOrder(order);
                    setCurrentTab('tracker');
                  }}
                  onReorder={handleReorder}
                  onExploreMenu={() => setCurrentTab('menu')}
                />
              )}

              {/* VIEW 5: Checkout View */}
              {currentTab === 'checkout' && (
                <CheckoutView
                  cartItems={cartItems}
                  customer={customer}
                  appliedCoupon={appliedCoupon}
                  restaurantInfo={restaurantInfo}
                  coupons={coupons}
                  onApplyCoupon={handleApplyCoupon}
                  onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
                  onOpenLuckyModal={() => setIsLuckyModalOpen(true)}
                  onBackToMenu={() => setCurrentTab('menu')}
                  onProceedToPayment={(finalAmount) => setIsPaymentOpen(true)}
                />
              )}

              {/* VIEW 6: Live Order Tracker & Tax Invoice */}
              {currentTab === 'tracker' && activeOrder && (
                <OrderTrackerView
                  order={activeOrder}
                  restaurantInfo={restaurantInfo}
                  onReorder={handleReorder}
                  onBackToHome={() => setCurrentTab('home')}
                />
              )}
            </main>

            {/* Floating Bottom Quick Action Cart Bar on Mobile when cart has items */}
            {cartItems.length > 0 && currentTab !== 'checkout' && currentTab !== 'tracker' && (
              <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30 animate-slideUp">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="w-full bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between border border-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">
                      {totalCartCount}
                    </span>
                    <span className="text-xs font-bold">View Selected Feast</span>
                  </div>
                  <span className="text-sm font-black text-amber-300">
                    Rs. {totalCartPrice} →
                  </span>
                </button>
              </div>
            )}

            {/* Floating Roaming Robotic AI Assistant */}
            {currentTab !== 'admin' && (
              <FloatingRobotAIBot
                onOpenAiAssistant={() => setIsAiChefOpen(true)}
                restaurantInfo={restaurantInfo}
                menuItemsCount={menuItems.length}
                couponsCount={coupons.length}
                cartCount={totalCartCount}
                onVoiceClick={toggleVoice}
              />
            )}

            {/* Footer */}
            <Footer
              restaurantInfo={restaurantInfo}
              onOpenLuckyModal={() => setIsLuckyModalOpen(true)}
              onExploreMenu={() => {
                setCurrentTab('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAdmin={() => {
                if (currentUser?.role === 'admin' || currentUser?.role === 'manager') {
                  setCurrentTab('admin');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              currentUser={currentUser}
            />
          </>
        )}

        {/* Modals Container */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          restaurantInfo={restaurantInfo}
          coupons={coupons}
          onUpdateQuantity={handleUpdateCartItemQuantity}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          customer={customer}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={handleApplyCoupon}
          onProceedToCheckout={handleProceedToCheckout}
          onOpenLuckyDraw={() => {
            setIsCartOpen(false);
            setIsLuckyModalOpen(true);
          }}
        />

        {/* Wishlist Drawer */}
        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistItems={wishlist}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onAddToCart={handleAddToCart}
          onMoveAllToCart={handleMoveAllWishlistToCart}
          onExploreMenu={() => {
            setCurrentTab('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Product Quick View & Detail Modal */}
        <ProductDetailModal
          item={quickViewItem}
          isOpen={!!quickViewItem}
          onClose={() => setQuickViewItem(null)}
          onAddToCart={handleQuickViewAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={quickViewItem ? wishlistIds.has(quickViewItem.id) : false}
        />

        <CustomerModal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          customer={customer}
          onSave={setCustomer}
        />

        <LuckyCouponGame
          isOpen={isLuckyModalOpen}
          onClose={() => setIsLuckyModalOpen(false)}
          coupons={coupons}
          restaurantInfo={restaurantInfo}
          onApplyCoupon={handleApplyCoupon}
          onAnnounceWin={speakLuckyCoupon}
          currentAppliedCouponCode={appliedCoupon?.code}
        />

        <ItemCustomizerModal
          item={customizingItem}
          isOpen={isCustomizerOpen}
          onClose={() => {
            setIsCustomizerOpen(false);
            setCustomizingItem(null);
          }}
          onConfirmAdd={handleConfirmCustomization}
        />

        <PaymentGatewayModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          restaurantInfo={restaurantInfo}
          finalAmount={
            cartItems.reduce((sum, item) => sum + item.totalPrice, 0) -
            Math.round((cartItems.reduce((sum, item) => sum + item.totalPrice, 0) * (appliedCoupon ? appliedCoupon.discountPercent : 0)) / 100) +
            +((cartItems.reduce((sum, item) => sum + item.totalPrice, 0) - Math.round((cartItems.reduce((sum, item) => sum + item.totalPrice, 0) * (appliedCoupon ? appliedCoupon.discountPercent : 0)) / 100)) * ((restaurantInfo.gstPercentage || 5) / 100)).toFixed(2)
          }
          customerName={customer.name}
          onPaymentSuccess={handlePaymentSuccess}
        />

        <AIChefAssistantModal
          isOpen={isAiChefOpen}
          onClose={() => setIsAiChefOpen(false)}
          cartItems={cartItems}
          customerName={customer.name}
          restaurantInfo={restaurantInfo}
          menuItems={menuItems}
          coupons={coupons}
          onAddItemByName={handleAddByName}
        />

        {/* Multi-Login & Account Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={currentUser}
          restaurantInfo={restaurantInfo}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            if (user.role === 'admin' || user.role === 'manager') {
              navigate('/dashboard');
            } else {
              setIsAuthModalOpen(false);
            }
          }}
          onLogout={() => {
            setCurrentUser(null);
            navigate('/');
          }}
        />

        {/* Multi-Voice Narration Studio Modal */}
        <VoiceSettingsModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          voiceSettings={voiceSettings}
          personas={personas}
          availableVoices={availableVoices}
          activePersona={activePersona}
          isSpeaking={isSpeaking}
          restaurantInfo={restaurantInfo}
          onUpdateSettings={updateVoiceSettings}
          onTestPersona={testPersona}
          onStopSpeaking={stopSpeaking}
        />

      </div>
    </ErrorBoundary>
  );
}
