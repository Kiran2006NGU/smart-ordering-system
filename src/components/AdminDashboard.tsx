import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  UtensilsCrossed, 
  Gift, 
  ShoppingBag, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Search, 
  Eye, 
  AlertCircle,
  Percent,
  Check,
  X,
  SlidersHorizontal,
  Flame,
  Star,
  Camera,
  Wand2,
  Image as ImageIcon,
  Volume2,
  Play,
  Users,
  UserCheck,
  Activity,
  Database,
  RefreshCw,
  Mail,
  Smartphone,
  ShieldCheck,
  LogIn,
  Store
} from 'lucide-react';
import { 
  MenuItem, 
  LuckyCoupon, 
  RestaurantInfo, 
  OrderRecord, 
  OrderStatus,
  CategoryType,
  SubCategoryType,
  UserAccount
} from '../types';
import { FoodPhotoPickerModal } from './FoodPhotoPickerModal';
import { matchRealFoodPhotos } from '../data/foodImageLibrary';
import { 
  fetchAllUsersFromFirestore, 
  fetchAllUserLogsFromFirestore, 
  FirestoreUserProfile, 
  UserLogRecord 
} from '../lib/firebase';
import { getAllRestaurants, TenantRestaurantInfo } from '../lib/tenantFirestore';

interface AdminDashboardProps {
  restaurantInfo: RestaurantInfo;
  restaurantSlug?: string;
  onUpdateRestaurantInfo: (info: RestaurantInfo) => void;
  menuItems: MenuItem[];
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
  onResetMenu: () => void;
  coupons: LuckyCoupon[];
  onAddCoupon: (coupon: LuckyCoupon) => void;
  onUpdateCoupon: (coupon: LuckyCoupon) => void;
  onDeleteCoupon: (code: string) => void;
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onClearOrders: () => void;
  onBackToStore: () => void;
  onOpenVoiceSettings?: () => void;
  currentUser?: UserAccount | null;
}

type AdminTab = 'settings' | 'menu' | 'orders' | 'coupons' | 'analytics' | 'users';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurantInfo,
  restaurantSlug,
  onUpdateRestaurantInfo,
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onResetMenu,
  coupons,
  onAddCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
  orders,
  onUpdateOrderStatus,
  onClearOrders,
  onBackToStore,
  onOpenVoiceSettings,
  currentUser
}) => {
  const isSuperAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const [activeTab, setActiveTab] = useState<AdminTab>('settings');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restaurant Settings Form state
  const [settingsForm, setSettingsForm] = useState<RestaurantInfo>({ ...restaurantInfo });

  // Sync settings when external restaurantInfo updates
  useEffect(() => {
    setSettingsForm({ ...restaurantInfo });
  }, [restaurantInfo]);

  // Menu Search & Filter
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState<string>('all');

  // Menu Item Modal Form (Add / Edit)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [itemFormData, setItemFormData] = useState<Partial<MenuItem>>({
    name: '',
    category: 'food',
    subcategory: 'pizza',
    price: 150,
    originalPrice: 180,
    description: '',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 150,
    isVeg: true,
    isSpicy: false,
    isBestseller: false,
    isChefSpecial: false,
    inStock: true,
    calories: 500,
    prepTime: '15 mins',
    tags: ['Popular', 'Fresh']
  });

  // Real food photo suggestions based on typed item name and subcategory
  const quickPhotoMatches = useMemo(() => {
    return matchRealFoodPhotos(itemFormData.name || '', itemFormData.subcategory || 'all').slice(0, 4);
  }, [itemFormData.name, itemFormData.subcategory]);

  // Coupon Form state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponFormData, setCouponFormData] = useState<LuckyCoupon>({
    code: '',
    discountPercent: 15,
    title: '',
    description: '',
    isLuckyDraw: false,
    isActive: true
  });

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Live Cloud Database Users & Activity Logs State (Super Admin View)
  const [dbUsers, setDbUsers] = useState<FirestoreUserProfile[]>([]);
  const [dbLogs, setDbLogs] = useState<UserLogRecord[]>([]);
  const [allStores, setAllStores] = useState<TenantRestaurantInfo[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(false);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [userProviderFilter, setUserProviderFilter] = useState<string>('all');
  const [userViewSubTab, setUserViewSubTab] = useState<'stores' | 'accounts' | 'logs'>('stores');

  // Derived unique restaurant customers from this restaurant's orders
  const storeCustomers = useMemo(() => {
    const customerMap = new Map<string, {
      name: string;
      mobile: string;
      email?: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderAt: string;
      lastOrderType: string;
    }>();

    orders.forEach(order => {
      const key = order.customer.mobile || order.customer.email || order.customer.name;
      if (!key) return;
      
      const existing = customerMap.get(key);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += order.finalTotal;
        if (new Date(order.createdAt) > new Date(existing.lastOrderAt)) {
          existing.lastOrderAt = order.createdAt;
          existing.lastOrderType = order.customer.orderType;
        }
      } else {
        customerMap.set(key, {
          name: order.customer.name || 'Diner',
          mobile: order.customer.mobile || '-',
          email: order.customer.email || '',
          totalOrders: 1,
          totalSpent: order.finalTotal,
          lastOrderAt: order.createdAt,
          lastOrderType: order.customer.orderType
        });
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  // Fetch Live Database Users, Logs & All Platform Stores from Firestore (Super Admin only)
  const loadDatabaseUsersAndLogs = async () => {
    if (!isSuperAdmin) return;
    setIsLoadingDb(true);
    try {
      const [fetchedUsers, fetchedLogs, fetchedStores] = await Promise.all([
        fetchAllUsersFromFirestore(),
        fetchAllUserLogsFromFirestore(),
        getAllRestaurants()
      ]);
      setDbUsers(fetchedUsers);
      setDbLogs(fetchedLogs);
      setAllStores(fetchedStores);
    } catch (e) {
      console.warn('Error loading Firestore database records:', e);
    } finally {
      setIsLoadingDb(false);
    }
  };

  // Load database info on mount and tab switch
  useEffect(() => {
    if (isSuperAdmin) {
      loadDatabaseUsersAndLogs();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (activeTab === 'users' && isSuperAdmin) {
      loadDatabaseUsersAndLogs();
    }
  }, [activeTab, isSuperAdmin]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save Restaurant Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRestaurantInfo(settingsForm);
    showToast('Restaurant information updated successfully!');
  };

  // Open Add Item Modal
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemFormData({
      id: `custom-${Date.now()}`,
      name: '',
      category: 'food',
      subcategory: 'pizza',
      price: 150,
      originalPrice: 180,
      description: '',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviewsCount: 120,
      isVeg: true,
      isSpicy: false,
      isBestseller: false,
      isChefSpecial: false,
      inStock: true,
      calories: 500,
      prepTime: '15 mins',
      tags: ['Chef Pick']
    });
    setIsItemModalOpen(true);
  };

  // Open Edit Item Modal
  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemFormData({ ...item });
    setIsItemModalOpen(true);
  };

  // Save Menu Item
  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemFormData.name || !itemFormData.price) {
      alert('Please provide item name and price.');
      return;
    }

    const itemToSave: MenuItem = {
      id: editingItem ? editingItem.id : `item-${Date.now()}`,
      name: itemFormData.name || 'Delicious Item',
      category: itemFormData.category || 'food',
      subcategory: itemFormData.subcategory || 'pizza',
      price: Number(itemFormData.price),
      originalPrice: itemFormData.originalPrice ? Number(itemFormData.originalPrice) : undefined,
      description: itemFormData.description || 'Freshly prepared specialty dish.',
      image: itemFormData.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      rating: itemFormData.rating ? Number(itemFormData.rating) : 4.8,
      reviewsCount: itemFormData.reviewsCount ? Number(itemFormData.reviewsCount) : 100,
      isVeg: !!itemFormData.isVeg,
      isSpicy: !!itemFormData.isSpicy,
      isBestseller: !!itemFormData.isBestseller,
      isChefSpecial: !!itemFormData.isChefSpecial,
      inStock: itemFormData.inStock !== false,
      calories: itemFormData.calories ? Number(itemFormData.calories) : undefined,
      prepTime: itemFormData.prepTime || '15 mins',
      tags: itemFormData.tags || ['Special']
    };

    if (editingItem) {
      onUpdateMenuItem(itemToSave);
      showToast(`Updated "${itemToSave.name}" in menu!`);
    } else {
      onAddMenuItem(itemToSave);
      showToast(`Added new item "${itemToSave.name}"!`);
    }
    setIsItemModalOpen(false);
  };

  // Toggle Item Stock
  const handleToggleStock = (item: MenuItem) => {
    const updated = { ...item, inStock: !item.inStock };
    onUpdateMenuItem(updated);
    showToast(`Marked "${item.name}" as ${updated.inStock ? 'In Stock' : 'Out of Stock'}`);
  };

  // Save Coupon
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponFormData.code || !couponFormData.discountPercent) {
      alert('Please provide code and discount %');
      return;
    }
    const cleanCoupon = {
      ...couponFormData,
      code: couponFormData.code.toUpperCase().trim(),
      discountPercent: Number(couponFormData.discountPercent)
    };
    onAddCoupon(cleanCoupon);
    showToast(`Coupon ${cleanCoupon.code} (${cleanCoupon.discountPercent}%) saved!`);
    setIsCouponModalOpen(false);
  };

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.finalTotal : 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  
  // Filtered Menu
  const filteredMenuItems = menuItems.filter(item => {
    if (menuFilterCategory !== 'all' && item.category !== menuFilterCategory && item.subcategory !== menuFilterCategory) {
      return false;
    }
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    if (orderStatusFilter !== 'all' && order.orderStatus !== orderStatusFilter) {
      return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.mobile.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-slideUp text-xs font-bold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navigation Bar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${
              isSuperAdmin ? 'bg-gradient-to-tr from-red-600 to-amber-600' : 'bg-gradient-to-tr from-orange-500 to-amber-500'
            }`}>
              {isSuperAdmin ? 'ADMIN' : 'HUB'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {restaurantInfo.name} {isSuperAdmin ? 'Master CMS' : 'Manager Hub'}
                </h1>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                  isSuperAdmin 
                    ? 'bg-red-600/30 text-red-300 border-red-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isSuperAdmin ? 'Master Portal' : 'Restaurant Manager'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isSuperAdmin 
                  ? 'Global Master Portal — Database Audit, Platform Users, System Analytics'
                  : 'Manage your restaurant menu, pricing, live kitchen orders, and customer activity'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Live Store</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 py-1.5 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>1. Restaurant &amp; Brand Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'menu' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-orange-500" />
            <span>2. Menu Catalog ({menuItems.length} items)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span>3. Live Kitchen Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'coupons' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Gift className="w-4 h-4 text-emerald-400" />
            <span>4. Lucky Coupons &amp; Offers</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>5. Sales &amp; Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'users' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {isSuperAdmin ? (
              <>
                <Database className="w-4 h-4 text-emerald-400" />
                <span>6. Live Database Users ({dbUsers.length || 'Cloud DB'})</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4 text-amber-400" />
                <span>6. Restaurant Customers ({storeCustomers.length})</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Global Public Store Link Banner */}
        {restaurantSlug && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/20">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    Your Live Customer Storefront
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-sm font-mono text-slate-300 font-bold break-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/r/${restaurantSlug}` : `/r/${restaurantSlug}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/r/${restaurantSlug}`;
                  navigator.clipboard.writeText(url);
                  showToast('📋 Store link copied to clipboard!');
                }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-600 transition-all cursor-pointer"
              >
                Copy Link
              </button>
              <a
                href={`/r/${restaurantSlug}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Store</span>
                <Eye className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 1: RESTAURANT & BRAND SETTINGS CMS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Top Info Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-300/80 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
                  <span>Real-Time Store Configuration &amp; Global State Engine</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                  Any setting changed here immediately updates everywhere across the app in real-time — including Header, Hero Banner, Menu, Cart calculations, Checkout billing, Payment Gateway, and Tax Invoice receipts.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateRestaurantInfo(settingsForm);
                    showToast('✅ All settings saved and synced across entire site!');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Sync All Settings Now</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Controls */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Store Brand &amp; Operational Details
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure your outlet identity, announcements, and tax parameters.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsForm({ ...restaurantInfo });
                      showToast('Reset form to current stored settings');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Store Name */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Restaurant / Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="e.g. Frozen Bottle & QuickBite"
                      />
                      <p className="text-[11px] text-slate-400">
                        Updates Header logo, Hero title, Checkout security seal, and Tax invoices.
                      </p>
                    </div>

                    {/* Tagline */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Brand Tagline / Slogan *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="e.g. Signature Thickshakes • Gourmet Pizzas"
                      />
                    </div>

                    {/* Logo Initials */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Brand Logo Text / Initials
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={settingsForm.logoText || 'FB'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none uppercase font-mono"
                        placeholder="e.g. FB"
                      />
                    </div>

                    {/* Announcement Banner */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Top Micro-Bar Announcement Ticker
                      </label>
                      <input
                        type="text"
                        value={settingsForm.announcement}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="e.g. QuickBite Special: 5% Flat GST & Win Up to 43% Lucky Coupons!"
                      />
                    </div>

                    {/* Hotline */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Hotline / Contact Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.hotline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hotline: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Customer Support Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Outlet Location / Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Store Hours */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Operating Hours / Timings *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.timings}
                        onChange={(e) => setSettingsForm({ ...settingsForm, timings: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* GST Rate & Quick Presets */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          GST Tax Rate (%) *
                        </label>
                        <div className="flex items-center gap-1">
                          {[0, 5, 12, 18].map((rate) => (
                            <button
                              key={rate}
                              type="button"
                              onClick={() => setSettingsForm({ ...settingsForm, gstPercentage: rate })}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                settingsForm.gstPercentage === rate
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {rate}%
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="28"
                        required
                        value={settingsForm.gstPercentage}
                        onChange={(e) => setSettingsForm({ ...settingsForm, gstPercentage: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Voice Assistant & Audio Personas in Settings */}
                    {onOpenVoiceSettings && (
                      <div className="md:col-span-2 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-amber-950 text-white border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                            <Volume2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-white">
                              Voice Assistant &amp; Narration Studio
                            </h4>
                            <p className="text-xs text-slate-300">
                              Configure multi-voice personas, speed tempo, pitch and automated customer audio welcomes
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={onOpenVoiceSettings}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                        >
                          Configure Voices
                        </button>
                      </div>
                    )}

                    {/* Delivery Fee & Free Delivery Threshold */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Base Delivery Fee (₹)
                        </label>
                        <div className="flex items-center gap-1">
                          {[0, 30, 40, 50].map((fee) => (
                            <button
                              key={fee}
                              type="button"
                              onClick={() => setSettingsForm({ ...settingsForm, deliveryFee: fee })}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                settingsForm.deliveryFee === fee
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {fee === 0 ? 'Free' : `₹${fee}`}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={settingsForm.deliveryFee}
                        onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Minimum Free Delivery Threshold */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Minimum Cart Total for Free Delivery (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={settingsForm.freeDeliveryMin ?? 200}
                        onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryMin: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="e.g. 200"
                      />
                      <p className="text-[11px] text-slate-400">
                        Orders at or above ₹{settingsForm.freeDeliveryMin ?? 200} will automatically receive FREE delivery.
                      </p>
                    </div>

                  </div>

                  {/* Submit Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Changes propagate live throughout the entire application</span>
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save &amp; Apply All Settings</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Live Real-Time Preview Card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>Live Site Preview</span>
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                      ACTIVE STATE
                    </span>
                  </div>

                  {/* Header Ticker Preview */}
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-3 rounded-2xl">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Top Announcement Bar</p>
                    <p className="text-xs font-semibold text-amber-300 mt-0.5 line-clamp-2">
                      {settingsForm.announcement || 'No announcement set'}
                    </p>
                  </div>

                  {/* Brand Preview */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-white text-sm shadow-md">
                        {settingsForm.logoText || 'FB'}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">
                          {settingsForm.name || 'Brand Name'}
                        </h4>
                        <p className="text-[11px] text-slate-300 line-clamp-1">
                          {settingsForm.tagline || 'Brand Tagline'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Breakdown Preview */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono text-xs">
                    <p className="text-[11px] font-sans font-bold text-slate-400 uppercase">
                      Sample ₹500 Bill Math Preview:
                    </p>
                    <div className="flex justify-between text-slate-300">
                      <span>Order Subtotal</span>
                      <span>₹500.00</span>
                    </div>
                    <div className="flex justify-between text-amber-300">
                      <span>GST ({settingsForm.gstPercentage}%)</span>
                      <span>₹{(500 * (settingsForm.gstPercentage / 100)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Delivery Fee</span>
                      <span>
                        {500 >= (settingsForm.freeDeliveryMin ?? 200) ? (
                          <span className="text-emerald-400 font-bold">FREE (≥ ₹{settingsForm.freeDeliveryMin ?? 200})</span>
                        ) : (
                          `₹${settingsForm.deliveryFee}`
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                      <span>Estimated Total</span>
                      <span className="text-amber-400">
                        ₹{(500 + (500 * (settingsForm.gstPercentage / 100)) + (500 >= (settingsForm.freeDeliveryMin ?? 200) ? 0 : settingsForm.deliveryFee)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Outlet info preview */}
                  <div className="text-xs text-slate-400 space-y-1 pt-1">
                    <p className="flex items-center gap-2">
                      <span className="text-slate-500">📍 Outlet:</span>
                      <span className="text-slate-200">{settingsForm.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-slate-500">🕒 Timings:</span>
                      <span className="text-slate-200">{settingsForm.timings}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-slate-500">📞 Hotline:</span>
                      <span className="text-slate-200">{settingsForm.hotline}</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: MENU CATALOG MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Header controls bar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Menu Items Catalog ({filteredMenuItems.length} of {menuItems.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add new dishes, edit descriptions, adjust prices, and toggle in-stock availability.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onResetMenu}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to 40+ Items</span>
                </button>

                <button
                  onClick={handleOpenAddItem}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Menu Item</span>
                </button>
              </div>
            </div>

            {/* Filter and search bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter menu item by name..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full pl-9.5 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category pill filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
                {['all', 'food', 'drink', 'snack', 'combo', 'dessert'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setMenuFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      menuFilterCategory === cat 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Table of items */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Attributes</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMenuItems.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-sm">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                            {item.category} • {item.subcategory || 'General'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-black text-slate-900 text-sm">
                            Rs. {item.price}
                            {item.originalPrice && (
                              <span className="text-[10px] text-slate-400 line-through ml-1 font-normal">
                                Rs. {item.originalPrice}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleStock(item)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${
                              item.inStock !== false 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {item.inStock !== false ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3 text-rose-600" />
                                <span>Out of Stock</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {item.isVeg && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                Veg
                              </span>
                            )}
                            {item.isBestseller && (
                              <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-bold text-[10px]">
                                Bestseller
                              </span>
                            )}
                            {item.isChefSpecial && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                                Chef Pick
                              </span>
                            )}
                            {item.isSpicy && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[10px]">
                                Spicy
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditItem(item)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              title="Edit item"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                                  onDeleteMenuItem(item.id);
                                  showToast(`Deleted "${item.name}"`);
                                }
                              }}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: LIVE KITCHEN ORDERS & STATUS CMS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Live Kitchen Order Flow ({filteredOrders.length} orders)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update kitchen status, mark orders as cooking/ready/delivered in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {orders.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear all order history records?')) {
                        onClearOrders();
                        showToast('Order logs cleared.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Order Logs</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order #, customer name, mobile..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9.5 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
                {['all', 'placed', 'confirmed', 'kitchen_preparing', 'ready', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                      orderStatusFilter === st 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Order cards list */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div 
                    key={order.orderId}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-slate-900">
                            #{order.orderNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-100 text-slate-700">
                            {order.customer.orderType.replace('_', ' ')} {order.customer.tableNumber ? `(${order.customer.tableNumber})` : ''}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-800">
                            {order.paymentMethod.toUpperCase()} • {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Customer: <span className="font-bold text-slate-800">{order.customer.name}</span> ({order.customer.mobile}) • {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      {/* Live Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Status:</span>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => {
                            onUpdateOrderStatus(order.orderId, e.target.value as OrderStatus);
                            showToast(`Order #${order.orderNumber} updated to ${e.target.value}`);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none ${
                            order.orderStatus === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.orderStatus === 'kitchen_preparing'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : order.orderStatus === 'ready'
                              ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
                              : order.orderStatus === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="placed">Placed (Received)</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="kitchen_preparing">Kitchen Preparing</option>
                          <option value="ready">Ready for Service</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="completed">Completed (Served)</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {order.items.map(item => (
                        <div key={item.cartItemId} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center gap-2.5">
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-slate-900 line-clamp-1">{item.menuItem.name}</p>
                            <p className="text-[11px] text-slate-500">Qty: {item.quantity} × Rs.{item.unitPrice}</p>
                            {item.selectedSize && (
                              <span className="text-[10px] text-amber-700 font-semibold">{item.selectedSize}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order summary bar */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">
                        Subtotal: Rs.{order.originalTotal} • Discount: -Rs.{order.discountAmount} • GST 5%: Rs.{order.gstAmount}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        Final Bill: Rs. {order.finalTotal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
                <p className="text-xs text-slate-500 mt-1">Orders placed by customers in the store will appear here in real time.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LUCKY COUPONS & OFFERS MANAGER */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Lucky Coupons &amp; Discount Management
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure the original C++ lucky coupon codes (101E - 105E) and custom promo codes.
                </p>
              </div>
              <button
                onClick={() => {
                  setCouponFormData({
                    code: '',
                    discountPercent: 15,
                    title: '',
                    description: '',
                    isLuckyDraw: false,
                    isActive: true
                  });
                  setIsCouponModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map(coupon => (
                <div
                  key={coupon.code}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-black px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
                        {coupon.code}
                      </span>
                      <span className="text-lg font-black text-emerald-600">
                        {coupon.discountPercent}% OFF
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-3">
                      {coupon.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {coupon.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      coupon.isLuckyDraw ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {coupon.isLuckyDraw ? 'Lucky Wheel Draw' : 'Standard Promo'}
                    </span>

                    <button
                      onClick={() => {
                        if (confirm(`Delete coupon ${coupon.code}?`)) {
                          onDeleteCoupon(coupon.code);
                          showToast(`Deleted coupon ${coupon.code}`);
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SALES & BUSINESS ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-black text-slate-900 mt-1">Rs. {totalRevenue.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Across all settled bills</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{totalOrdersCount}</p>
                <p className="text-[11px] text-cyan-600 font-semibold mt-1">Live customer orders</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Order Value</p>
                <p className="text-2xl font-black text-slate-900 mt-1">Rs. {averageOrderValue}</p>
                <p className="text-[11px] text-amber-600 font-semibold mt-1">Avg basket spend</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Strength</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{menuItems.length} Dishes</p>
                <p className="text-[11px] text-indigo-600 font-semibold mt-1">Across 10+ subcategories</p>
              </div>
            </div>

            {/* Subcategory Distribution & Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Menu Subcategory Breakdown
                </h3>
                <div className="space-y-2 text-xs">
                  {['pizza', 'burger', 'sandwich', 'pasta', 'taco_wrap', 'shake', 'coffee', 'snack', 'combo', 'dessert'].map(sub => {
                    const count = menuItems.filter(i => i.subcategory === sub || i.category === sub).length;
                    const percent = Math.round((count / (menuItems.length || 1)) * 100);
                    return (
                      <div key={sub} className="space-y-1">
                        <div className="flex justify-between font-bold text-slate-700 capitalize">
                          <span>{sub.replace('_', ' & ')}</span>
                          <span>{count} items ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Top Performing Signature Dishes
                </h3>
                <div className="space-y-3 text-xs">
                  {menuItems.filter(i => i.isBestseller).slice(0, 5).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-500">{item.reviewsCount} customer reviews ★ {item.rating}</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">Rs. {item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: CUSTOMERS (MANAGER VIEW) VS LIVE DATABASE AUDIT (SUPER ADMIN VIEW) */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            {/* MANAGER VIEW: RESTAURANT-SCOPED CUSTOMERS ONLY */}
            {!isSuperAdmin ? (
              <div className="space-y-6">
                {/* Manager Top Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-3xl p-6 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                        <span>{restaurantInfo.name} Customer Directory</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                          Store Scope
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300">
                        View customers who have logged in or ordered from your restaurant storefront.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Diners &amp; Customers</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{storeCustomers.length}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Unique diners at this store</p>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Store Orders</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">{orders.length}</p>
                    <p className="text-[11px] text-amber-600 font-semibold mt-1">Lifetime orders placed</p>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Customer Revenue</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">
                      ₹{orders.reduce((sum, o) => sum + o.finalTotal, 0).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Generated from your menu</p>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Dine-In Guests</p>
                    <p className="text-2xl font-black text-blue-600 mt-1">
                      {storeCustomers.filter(c => c.lastOrderType === 'dine_in').length}
                    </p>
                    <p className="text-[11px] text-blue-600 font-semibold mt-1">Table dining customers</p>
                  </div>
                </div>

                {/* Customer List Table */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900">Your Store's Customers</h4>
                  {storeCustomers.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                      <Users className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-sm text-slate-700">No customer orders yet</p>
                      <p className="text-xs text-slate-400">Share your store link with customers to see them appear here as they order!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                            <th className="py-2.5 px-3">Customer</th>
                            <th className="py-2.5 px-3">Mobile Contact</th>
                            <th className="py-2.5 px-3">Total Orders</th>
                            <th className="py-2.5 px-3">Total Spent</th>
                            <th className="py-2.5 px-3">Last Order</th>
                            <th className="py-2.5 px-3">Service Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {storeCustomers.map((cust, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                                    {cust.name.slice(0, 1).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{cust.name}</p>
                                    {cust.email && <p className="text-[10px] text-slate-400">{cust.email}</p>}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-mono text-slate-700 font-semibold">{cust.mobile}</td>
                              <td className="py-3 px-3 font-bold text-slate-900">{cust.totalOrders} orders</td>
                              <td className="py-3 px-3 font-black text-emerald-600">₹{cust.totalSpent.toLocaleString()}</td>
                              <td className="py-3 px-3 text-slate-500 text-[11px]">
                                {new Date(cust.lastOrderAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                                  {cust.lastOrderType.replace('_', ' ')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* SUPER ADMIN MASTER VIEW: FULL DATABASE & AUDIT LOGS */
              <div className="space-y-6">
                {/* Top Database Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white rounded-3xl p-6 border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center font-black shrink-0 shadow-lg">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                        <span>Master Cloud Firestore User Accounts &amp; Auth Database</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold uppercase">
                          Platform Owner Only
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300">
                        Audit real-time Google account logins, sign-ups, phone OTPs, customer profiles, and session activity logs.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={loadDatabaseUsersAndLogs}
                    disabled={isLoadingDb}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingDb ? 'animate-spin' : ''}`} />
                    <span>{isLoadingDb ? 'Syncing Firestore...' : 'Refresh Master Database'}</span>
                  </button>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Stores &amp; Cafes</p>
                    <p className="text-2xl font-black text-orange-600 mt-1">{allStores.length}</p>
                    <p className="text-[11px] text-orange-600 font-semibold mt-1">Live Multi-Tenant Outlets</p>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Accounts</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{dbUsers.length}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Synced in Firestore Database</p>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Google Authenticated Users</p>
                    <p className="text-2xl font-black text-blue-600 mt-1">
                      {dbUsers.filter(u => u.provider?.includes('google')).length}
                    </p>
                    <p className="text-[11px] text-blue-600 font-semibold mt-1">Verified Real Google Accounts</p>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Activity Audit Logs</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{dbLogs.length}</p>
                    <p className="text-[11px] text-cyan-600 font-semibold mt-1">Real-time authentication events</p>
                  </div>
                </div>

                {/* Sub-Tabs: Stores vs Accounts vs Activity Logs */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    
                    {/* Switcher */}
                    <div className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-bold flex-wrap gap-1">
                      <button
                        onClick={() => setUserViewSubTab('stores')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                          userViewSubTab === 'stores' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Store className="w-3.5 h-3.5 text-orange-500" />
                        <span>Registered Stores &amp; Cafes ({allStores.length})</span>
                      </button>
                      <button
                        onClick={() => setUserViewSubTab('accounts')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                          userViewSubTab === 'accounts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        <span>All Platform Users ({dbUsers.length})</span>
                      </button>
                      <button
                        onClick={() => setUserViewSubTab('logs')}
                        className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                          userViewSubTab === 'logs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Activity className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Live Audit Logs ({dbLogs.length})</span>
                      </button>
                    </div>

                    {/* Filter and Search */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search stores, users, or logs..."
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                  </div>

                  {/* VIEW 1: REGISTERED RESTAURANTS & CAFES DIRECTORY */}
                  {userViewSubTab === 'stores' && (
                    <div className="space-y-4">
                      {allStores.length === 0 && !isLoadingDb ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                          <Store className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="font-bold text-sm text-slate-700">No external restaurants registered yet</p>
                          <p className="text-xs text-slate-400">When restaurant managers create their cafes via onboarding, they will automatically appear in this master directory.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                                <th className="py-2.5 px-3">Restaurant &amp; Brand</th>
                                <th className="py-2.5 px-3">Public Store Link</th>
                                <th className="py-2.5 px-3">Manager / Owner UID</th>
                                <th className="py-2.5 px-3">Hotline &amp; Address</th>
                                <th className="py-2.5 px-3">Created On</th>
                                <th className="py-2.5 px-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {allStores
                                .filter(s => {
                                  if (userSearchQuery.trim()) {
                                    const q = userSearchQuery.toLowerCase();
                                    return (
                                      s.name?.toLowerCase().includes(q) ||
                                      s.slug?.toLowerCase().includes(q) ||
                                      s.ownerUid?.toLowerCase().includes(q)
                                    );
                                  }
                                  return true;
                                })
                                .map((store) => (
                                  <tr key={store.ownerUid} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3 px-3">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 font-black flex items-center justify-center text-xs">
                                          {store.logoText || store.name?.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-900">{store.name}</p>
                                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{store.tagline}</p>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="py-3 px-3">
                                      <span className="font-mono text-orange-600 font-bold text-[11px] bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                                        /r/{store.slug}
                                      </span>
                                    </td>

                                    <td className="py-3 px-3 font-mono text-slate-500 text-[10px]">
                                      {store.ownerUid}
                                    </td>

                                    <td className="py-3 px-3 text-slate-600 text-[11px]">
                                      <p className="font-medium text-slate-800">{store.hotline || '-'}</p>
                                      <p className="text-[10px] text-slate-400 truncate max-w-xs">{store.address || '-'}</p>
                                    </td>

                                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                                      {store.createdAt ? new Date(store.createdAt).toLocaleDateString() : 'Active'}
                                    </td>

                                    <td className="py-3 px-3">
                                      <a
                                        href={`/r/${store.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-all"
                                      >
                                        <Eye className="w-3 h-3" />
                                        <span>View Store</span>
                                      </a>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* VIEW A: REGISTERED USER ACCOUNTS DIRECTORY */}
                  {userViewSubTab === 'accounts' && (
                    <div className="space-y-4">
                      {dbUsers.length === 0 && !isLoadingDb ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                          <Users className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="font-bold text-sm text-slate-700">No database user accounts found yet</p>
                          <p className="text-xs text-slate-400">Sign in with Google, Phone OTP, or Email to see live profiles populate here!</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                                <th className="py-2.5 px-3">Master User Profile</th>
                                <th className="py-2.5 px-3">Auth Method</th>
                                <th className="py-2.5 px-3">System Role</th>
                                <th className="py-2.5 px-3">Created At</th>
                                <th className="py-2.5 px-3">Last Active</th>
                                <th className="py-2.5 px-3">Orders &amp; Spent</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {dbUsers
                                .filter(u => {
                                  if (userProviderFilter !== 'all' && !u.provider?.includes(userProviderFilter)) return false;
                                  if (userSearchQuery.trim()) {
                                    const q = userSearchQuery.toLowerCase();
                                    return (
                                      u.displayName?.toLowerCase().includes(q) ||
                                      u.email?.toLowerCase().includes(q) ||
                                      u.uid?.toLowerCase().includes(q)
                                    );
                                  }
                                  return true;
                                })
                                .map((user) => (
                                  <tr key={user.uid} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3 px-3">
                                      <div className="flex items-center gap-2.5">
                                        <img
                                          src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                                          alt={user.displayName}
                                          className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                                        />
                                        <div>
                                          <p className="font-bold text-slate-900">{user.displayName || 'Anonymous User'}</p>
                                          <p className="text-[10px] text-slate-400 font-mono">{user.email || user.phone || user.uid}</p>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="py-3 px-3">
                                      {user.provider?.includes('google') ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
                                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                                          <span>Google Auth</span>
                                        </span>
                                      ) : user.provider?.includes('phone') ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                                          <Smartphone className="w-3 h-3" />
                                          <span>Phone OTP</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-200">
                                          <Mail className="w-3 h-3" />
                                          <span>Email / Pass</span>
                                        </span>
                                      )}
                                    </td>

                                    <td className="py-3 px-3">
                                      {user.role === 'admin' ? (
                                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-black text-[10px] uppercase">
                                          Super Admin
                                        </span>
                                      ) : user.role === 'manager' ? (
                                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                                          Manager
                                        </span>
                                      ) : (
                                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                                          Customer
                                        </span>
                                      )}
                                    </td>

                                    <td className="py-3 px-3 text-slate-600 text-[11px]">
                                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}
                                    </td>

                                    <td className="py-3 px-3 text-slate-600 text-[11px]">
                                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                    </td>

                                    <td className="py-3 px-3 font-bold text-slate-900">
                                      <span>{user.totalOrders || 0} Orders</span>
                                      <span className="text-slate-400 font-normal text-[11px] ml-1">
                                        (₹{(user.totalSpent || 0).toLocaleString()})
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* VIEW B: LIVE ACTIVITY & AUTH AUDIT LOGS */}
                  {userViewSubTab === 'logs' && (
                    <div className="space-y-3">
                      {dbLogs.length === 0 && !isLoadingDb ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                          <Activity className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="font-bold text-sm text-slate-700">No activity logs recorded yet</p>
                          <p className="text-xs text-slate-400">All user sign-ins, checkouts, and logouts stream directly into this audit trail.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                          {dbLogs
                            .filter(log => {
                              if (userSearchQuery.trim()) {
                                const q = userSearchQuery.toLowerCase();
                                return (
                                  log.displayName?.toLowerCase().includes(q) ||
                                  log.email?.toLowerCase().includes(q) ||
                                  log.action?.toLowerCase().includes(q) ||
                                  log.details?.toLowerCase().includes(q)
                                );
                              }
                              return true;
                            })
                            .map((log) => (
                              <div key={log.id} className="p-3.5 hover:bg-slate-50/90 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="flex items-start sm:items-center gap-3">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                    log.action === 'login' ? 'bg-blue-100 text-blue-700' :
                                    log.action === 'signup' ? 'bg-emerald-100 text-emerald-700' :
                                    log.action === 'order_placed' ? 'bg-amber-100 text-amber-800' :
                                    'bg-slate-100 text-slate-600'
                                  }`}>
                                    {log.action === 'login' ? <LogIn className="w-4 h-4" /> :
                                     log.action === 'signup' ? <UserCheck className="w-4 h-4" /> :
                                     log.action === 'order_placed' ? <ShoppingBag className="w-4 h-4" /> :
                                     <Activity className="w-4 h-4" />}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900">{log.displayName || 'Customer'}</span>
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                        log.action === 'signup' ? 'bg-emerald-100 text-emerald-700' :
                                        log.action === 'login' ? 'bg-blue-100 text-blue-700' :
                                        log.action === 'order_placed' ? 'bg-amber-100 text-amber-800' :
                                        'bg-slate-100 text-slate-700'
                                      }`}>
                                        {log.action?.replace('_', ' ')}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                                      {log.details || `Authenticated via ${log.provider}`}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <p className="text-[11px] font-bold text-slate-700">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    {new Date(log.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT MENU ITEM */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 animate-slideUp p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900">
                {editingItem ? `Edit "${editingItem.name}"` : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={itemFormData.name}
                    onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. Tandoori Paneer Supreme Pizza"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Main Category *</label>
                  <select
                    value={itemFormData.category}
                    onChange={(e: any) => setItemFormData({ ...itemFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="food">Food (Pizza, Burger, Pasta)</option>
                    <option value="drink">Drinks &amp; Shakes</option>
                    <option value="snack">Snacks &amp; Fries</option>
                    <option value="combo">Combo Platter</option>
                    <option value="dessert">Desserts &amp; Sundaes</option>
                  </select>
                </div>

                {/* Subcategory */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Subcategory *</label>
                  <select
                    value={itemFormData.subcategory}
                    onChange={(e: any) => setItemFormData({ ...itemFormData, subcategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="pizza">Pizza</option>
                    <option value="burger">Burger</option>
                    <option value="sandwich">Sandwich &amp; Toast</option>
                    <option value="pasta">Pasta</option>
                    <option value="taco_wrap">Taco &amp; Wrap</option>
                    <option value="shake">Thickshake</option>
                    <option value="coffee">Coffee &amp; Cold Brew</option>
                    <option value="refresher">Mojito &amp; Refresher</option>
                    <option value="snack">Snacks &amp; Fries</option>
                    <option value="combo">Combo Platter</option>
                    <option value="dessert">Dessert &amp; Waffle</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={itemFormData.price}
                    onChange={(e) => setItemFormData({ ...itemFormData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Original / Strike Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={itemFormData.originalPrice || ''}
                    onChange={(e) => setItemFormData({ ...itemFormData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. 180 (shows strikethrough)"
                  />
                </div>

                {/* Real Food Picture Studio & Image URL */}
                <div className="sm:col-span-2 space-y-2 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-amber-600" />
                      <label className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                        Item Real Picture *
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPhotoPickerOpen(true)}
                      className="px-3 py-1 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Browse Real Photo Library</span>
                    </button>
                  </div>

                  {/* Current Image Preview & Input */}
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-100 shrink-0 group">
                      <img
                        src={itemFormData.image}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setIsPhotoPickerOpen(true)}
                        className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold p-1 text-center"
                      >
                        <Wand2 className="w-4 h-4 mb-0.5" />
                        <span>Change Photo</span>
                      </button>
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          value={itemFormData.image}
                          onChange={(e) => setItemFormData({ ...itemFormData, image: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-[11px] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          placeholder="https://images.unsplash.com/..."
                        />
                        <button
                          type="button"
                          onClick={() => setIsPhotoPickerOpen(true)}
                          className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-colors shrink-0"
                          title="Open Real Photo Studio"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quick Auto-Match Suggestions */}
                      {quickPhotoMatches.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Suggested Real Photos for "{itemFormData.name || 'Dish'}":</span>
                          </p>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {quickPhotoMatches.map((photo) => (
                              <button
                                key={photo.id}
                                type="button"
                                onClick={() => setItemFormData({ ...itemFormData, image: photo.url })}
                                className={`flex items-center gap-1.5 p-1 pr-2 rounded-lg border text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                                  itemFormData.image === photo.url
                                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                                }`}
                              >
                                <img
                                  src={photo.url}
                                  alt={photo.title}
                                  className="w-5 h-5 rounded-md object-cover"
                                />
                                <span className="truncate max-w-[110px]">{photo.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={itemFormData.description}
                    onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Prep Time & Calories */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Preparation Time</label>
                  <input
                    type="text"
                    value={itemFormData.prepTime}
                    onChange={(e) => setItemFormData({ ...itemFormData, prepTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. 12-15 mins"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Calories (kcal)</label>
                  <input
                    type="number"
                    value={itemFormData.calories || ''}
                    onChange={(e) => setItemFormData({ ...itemFormData, calories: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. 520"
                  />
                </div>

                {/* Badges and toggles */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={itemFormData.isVeg}
                      onChange={(e) => setItemFormData({ ...itemFormData, isVeg: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>100% Pure Veg</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={itemFormData.isBestseller}
                      onChange={(e) => setItemFormData({ ...itemFormData, isBestseller: e.target.checked })}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span>Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={itemFormData.isChefSpecial}
                      onChange={(e) => setItemFormData({ ...itemFormData, isChefSpecial: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>Chef Special</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={itemFormData.isSpicy}
                      onChange={(e) => setItemFormData({ ...itemFormData, isSpicy: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span>Spicy</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={itemFormData.inStock !== false}
                      onChange={(e) => setItemFormData({ ...itemFormData, inStock: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>In Stock (Available)</span>
                  </label>
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-900 hover:bg-orange-500 text-white font-black rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {editingItem ? 'Save Item Changes' : 'Add Item to Menu'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: CREATE COUPON */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 animate-slideUp p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-lg text-slate-900">
                Create Discount Coupon
              </h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code (e.g. VIP40)</label>
                <input
                  type="text"
                  required
                  value={couponFormData.code}
                  onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. FEAST25"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Discount Percentage (%) *</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  required
                  value={couponFormData.discountPercent}
                  onChange={(e) => setCouponFormData({ ...couponFormData, discountPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Title</label>
                <input
                  type="text"
                  value={couponFormData.title}
                  onChange={(e) => setCouponFormData({ ...couponFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. Weekend Mega Treat"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={couponFormData.description}
                  onChange={(e) => setCouponFormData({ ...couponFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. 25% discount on all shakes and pizzas"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-black rounded-xl shadow-md transition-colors"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real Food Photo Studio Modal */}
      <FoodPhotoPickerModal
        isOpen={isPhotoPickerOpen}
        onClose={() => setIsPhotoPickerOpen(false)}
        currentImageUrl={itemFormData.image || ''}
        itemName={itemFormData.name || ''}
        itemCategory={itemFormData.subcategory || 'all'}
        onSelectPhoto={(url) => {
          setItemFormData(prev => ({ ...prev, image: url }));
          showToast('Real food picture applied to item!');
        }}
      />

    </div>
  );
};
