import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Percent, 
  ShieldCheck, 
  IceCream,
  Utensils
} from 'lucide-react';
import { RestaurantInfo } from '../types';

interface HeroBannerProps {
  onExploreMenu: () => void;
  onOpenLuckyModal: () => void;
  onExploreCombos: () => void;
  customerName: string;
  restaurantInfo: RestaurantInfo;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreMenu,
  onOpenLuckyModal,
  onExploreCombos,
  customerName,
  restaurantInfo
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-2xl border border-slate-800">
      {/* Ambient background glow elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & CTA column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-amber-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>
                {customerName ? `Welcome back, ${customerName}!` : restaurantInfo.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-normal">{restaurantInfo.timings || 'Open Now'}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                {restaurantInfo.name.split('&')[0] || 'Frozen Shakes'} &amp; <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
                  {restaurantInfo.name.split('&')[1] || 'Sizzling QuickBites'}
                </span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed pt-2">
                {restaurantInfo.tagline || 'Signature Thickshakes • Stone-Baked Pizzas • Crisp Snacks'} with transparent {restaurantInfo.gstPercentage}% GST &amp; instant lucky coupon discounts.
              </p>
            </div>

            {/* Feature badging row */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Wood-Fired &amp; Freshly Cooked</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                <IceCream className="w-4 h-4 text-cyan-400" />
                <span>{restaurantInfo.name} Specials</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                <Percent className="w-4 h-4 text-emerald-400" />
                <span>Up to 43% Lucky Codes</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <button
                id="hero-explore-menu-btn"
                onClick={onExploreMenu}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
              >
                <Utensils className="w-5 h-5" />
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-lucky-draw-btn"
                onClick={onOpenLuckyModal}
                className="px-6 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>🎁 Spin &amp; Scratch Lucky Coupon</span>
              </button>

              <button
                id="hero-combos-btn"
                onClick={onExploreCombos}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                Combo Platters
              </button>
            </div>

            {/* Trust footer stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <p className="text-2xl font-extrabold text-white">4.9 ★</p>
                <p className="text-xs text-slate-400">12,000+ Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">15 Min</p>
                <p className="text-xs text-slate-400">Fast Table Prep</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-400">{restaurantInfo.gstPercentage}% GST</p>
                <p className="text-xs text-slate-400">Exact Transparent Bill</p>
              </div>
            </div>

          </div>

          {/* Right Visual Bento Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Main Food card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-800/50 backdrop-blur-xs group">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
                  alt="QuickBite Feast Burger"
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-orange-500 text-[11px] font-extrabold uppercase tracking-wider">
                      Chef Special Combo
                    </span>
                    <span className="text-amber-300 font-extrabold text-sm">
                      Only Rs. 250
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white mt-1">
                    Classic Burger + Golden Fries + Thickshake
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    The legendary Frozen Bottle trio platter.
                  </p>
                </div>
              </div>

              {/* Floating Drink Badge card */}
              <div className="absolute -top-6 -right-4 sm:-right-6 bg-slate-900/90 border border-slate-700 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3 animate-bounce">
                <img
                  src="https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=200&q=80"
                  alt="Decadent Chocolate Shake"
                  className="w-12 h-12 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-xs font-bold text-white">Chocolate Shake</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">Rs. 100 • Frozen Thick</p>
                </div>
              </div>

              {/* Floating Lucky Discount badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-3 text-white shadow-xl flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-200" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-amber-100">Lucky Coupon 104E</p>
                  <p className="text-xs font-black">43% Super Savings</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
