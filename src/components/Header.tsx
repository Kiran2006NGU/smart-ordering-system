import React from 'react';
import { 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  Gift, 
  UtensilsCrossed, 
  History, 
  Phone, 
  UserCheck, 
  Shield, 
  LogIn, 
  SlidersHorizontal, 
  ChevronDown,
  Heart,
  Award,
  Store,
  ExternalLink
} from 'lucide-react';
import { CustomerDetails, RestaurantInfo, UserAccount } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenVoiceSettings?: () => void;
  activePersonaName?: string;
  isSpeaking: boolean;
  customer: CustomerDetails;
  restaurantInfo: RestaurantInfo;
  currentUser: UserAccount | null;
  onOpenCustomerModal: () => void;
  onOpenLuckyModal: () => void;
  onOpenAiChef: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  isPublicStore?: boolean;
  onGoToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  cartTotal,
  onOpenCart,
  wishlistCount = 0,
  onOpenWishlist,
  voiceEnabled,
  onToggleVoice,
  onOpenVoiceSettings,
  activePersonaName,
  isSpeaking,
  customer,
  restaurantInfo,
  currentUser,
  onOpenCustomerModal,
  onOpenLuckyModal,
  onOpenAiChef,
  onOpenAuth,
  onOpenAdmin,
  isPublicStore = false,
  onGoToLanding
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      
      {/* Top micro bar: Announcement & Fast Contacts */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white px-4 py-1.5 text-[11px] font-medium flex items-center justify-between border-b border-amber-900/40">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 animate-pulse">
            <Sparkles className="w-2.5 h-2.5" /> LIVE
          </span>
          <span className="truncate text-amber-200/90 font-medium">
            {restaurantInfo.announcement || 'Order online for lightning-fast preparation!'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-slate-300 shrink-0">
          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-amber-400" />
            {restaurantInfo.timings || '10:00 AM – 11:30 PM'}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
            <Phone className="w-3 h-3 text-amber-400" />
            {restaurantInfo.hotline || '+91 98765 43210'}
          </span>
          {isPublicStore && onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-full transition-colors cursor-pointer"
            >
              Powered by SmartDine ✨
            </button>
          )}
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo & Brand title */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-all">
                {restaurantInfo.logoText ? restaurantInfo.logoText.slice(0, 2) : 'SD'}
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
                  <span>{restaurantInfo.name || 'Smart Restaurant'}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Open
                  </span>
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 max-w-[200px] sm:max-w-xs">
                  {restaurantInfo.tagline || 'Signature Bites & Refreshing Beverages'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 text-xs font-bold">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('menu')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'menu'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />
              <span>Full Menu</span>
            </button>
            <button
              onClick={() => setCurrentTab('combos')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'combos'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Combos & Platters</span>
            </button>
            <button
              onClick={onOpenLuckyModal}
              className="px-3 py-1.5 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
              <span>Lucky Wheel</span>
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Orders</span>
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin CMS Access Button (shown for owner/admin mode, or subtle for public store) */}
            {!isPublicStore ? (
              <button
                id="admin-dashboard-btn"
                onClick={onOpenAdmin}
                title="Open Admin CMS & Settings"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isAdmin 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <Shield className={`w-3.5 h-3.5 ${isAdmin ? 'text-white' : 'text-red-600'}`} />
                <span className="hidden sm:inline">{isAdmin ? 'Admin CMS' : 'Admin'}</span>
              </button>
            ) : isAdmin ? (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Owner Dashboard</span>
              </button>
            ) : null}

            {/* User Account / Multi-Login Trigger */}
            <button
              id="user-account-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-xs font-bold text-slate-700 cursor-pointer"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-amber-300"
                />
              ) : (
                <LogIn className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span className="max-w-[85px] sm:max-w-[110px] truncate font-bold text-slate-800">
                {currentUser ? currentUser.name : 'Sign In'}
              </span>
            </button>

            {/* Voice Narration Assistant Toggle & Studio */}
            <div className="flex items-center gap-1">
              <button
                id="voice-toggle-btn"
                onClick={onOpenVoiceSettings || onToggleVoice}
                title={voiceEnabled ? `Voice active: ${activePersonaName || 'Smart Voice'} (Click to change voice)` : 'Enable Voice Assistant'}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all relative cursor-pointer ${
                  voiceEnabled
                    ? 'bg-amber-500/10 border-amber-300 text-amber-900 hover:bg-amber-500/20 shadow-2xs'
                    : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {voiceEnabled ? (
                  <Volume2 className={`w-4 h-4 text-amber-600 ${isSpeaking ? 'animate-bounce' : ''}`} />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                
                {voiceEnabled && activePersonaName && (
                  <span className="text-[11px] font-bold text-amber-900 hidden sm:inline truncate max-w-[65px]">
                    {activePersonaName}
                  </span>
                )}

                {isSpeaking && (
                  <span className="flex gap-0.5 items-end h-3 ml-0.5">
                    <span className="w-0.5 bg-amber-600 rounded-full animate-bounce h-2" />
                    <span className="w-0.5 bg-amber-600 rounded-full animate-bounce h-3 delay-75" />
                    <span className="w-0.5 bg-amber-600 rounded-full animate-bounce h-2 delay-150" />
                  </span>
                )}
              </button>
            </div>

            {/* Wishlist Button */}
            {onOpenWishlist && (
              <button
                id="wishlist-trigger-btn"
                onClick={onOpenWishlist}
                title="View Wishlist & Saved Items"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-rose-500 transition-all relative cursor-pointer"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button with Animated Counter */}
            <button
              id="cart-trigger-btn"
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-orange-200 transition-all active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-white text-orange-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartCount === 0 ? 'Cart' : `Rs. ${cartTotal}`}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex lg:hidden items-center justify-between gap-1 pt-2.5 mt-2 border-t border-slate-100 text-xs font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              currentTab === 'home' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentTab('menu')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              currentTab === 'menu' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Full Menu
          </button>
          <button
            onClick={() => setCurrentTab('combos')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              currentTab === 'combos' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Combos
          </button>
          <button
            onClick={onOpenLuckyModal}
            className="px-3 py-1.5 rounded-lg text-amber-700 bg-amber-50 border border-amber-200 whitespace-nowrap cursor-pointer"
          >
            🎁 Lucky Codes
          </button>
          <button
            onClick={() => setCurrentTab('history')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              currentTab === 'history' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Orders
          </button>
        </div>
      </div>
    </header>
  );
};
