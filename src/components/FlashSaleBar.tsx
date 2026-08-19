import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Flame, 
  Sparkles, 
  Plus, 
  ChevronRight, 
  ShoppingBag,
  Star
} from 'lucide-react';
import { MenuItem } from '../types';

interface FlashSaleBarProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onOpenItemDetail: (item: MenuItem) => void;
}

export const FlashSaleBar: React.FC<FlashSaleBarProps> = ({
  menuItems,
  onAddToCart,
  onOpenItemDetail
}) => {
  // Real-time flash deal countdown timer: resets to ~3 hours
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 47,
    seconds: 35
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 3, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter top discounted / bestselling items for flash deals
  const dealItems = menuItems.filter((m) => m.originalPrice && m.originalPrice > m.price).slice(0, 4);

  if (dealItems.length === 0) return null;

  const formatTime = (val: number) => String(val).padStart(2, '0');

  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 my-6">
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
        
        {/* Ambient background rays */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-950/40 rounded-full blur-2xl pointer-events-none" />

        {/* Flash Sale Header with Timer */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Zap className="w-6 h-6 fill-current animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>LIGHTNING FLASH DEALS</span>
                  <span className="text-[10px] uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-bold border border-white/30">
                    Up to 40% OFF
                  </span>
                </h2>
              </div>
              <p className="text-xs text-red-100 font-medium">Limited stock available • Instant kitchen dispatch</p>
            </div>
          </div>

          {/* Real-Time Countdown Clocks */}
          <div className="flex items-center gap-2 bg-slate-950/40 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 self-start sm:self-auto">
            <Clock className="w-4 h-4 text-yellow-300 shrink-0" />
            <span className="text-xs font-bold text-red-100 uppercase tracking-wider">Ends in:</span>
            <div className="flex items-center gap-1 font-mono font-black text-sm text-yellow-300">
              <span className="bg-slate-900 px-1.5 py-0.5 rounded-md border border-white/10">{formatTime(timeLeft.hours)}h</span>
              <span>:</span>
              <span className="bg-slate-900 px-1.5 py-0.5 rounded-md border border-white/10">{formatTime(timeLeft.minutes)}m</span>
              <span>:</span>
              <span className="bg-slate-900 px-1.5 py-0.5 rounded-md border border-white/10">{formatTime(timeLeft.seconds)}s</span>
            </div>
          </div>
        </div>

        {/* Flash Deals Horizontal Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {dealItems.map((item, idx) => {
            const discountPercent = item.originalPrice 
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
              : 25;

            // Simulated dynamic claim percentages
            const claimedPct = 70 + (idx * 7);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 text-slate-900 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group border border-amber-100"
              >
                {/* Image & Discount Badge */}
                <div 
                  onClick={() => onOpenItemDetail(item)}
                  className="relative h-36 w-full rounded-xl overflow-hidden cursor-pointer bg-slate-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
                    {discountPercent}% OFF
                  </div>

                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Title & Pricing */}
                <div className="pt-2.5 space-y-1.5">
                  <h3 
                    onClick={() => onOpenItemDetail(item)}
                    className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 hover:text-orange-600 cursor-pointer"
                  >
                    {item.name}
                  </h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-slate-900">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Stock Left / Claimed Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span className="text-red-600 flex items-center gap-0.5">
                        <Flame className="w-3 h-3" />
                        <span>{claimedPct}% Claimed</span>
                      </span>
                      <span>Hurry!</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                        style={{ width: `${claimedPct}%` }}
                      />
                    </div>
                  </div>

                  {/* 1-Click Grab Deal Button */}
                  <button
                    onClick={() => onAddToCart(item)}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Grab Deal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
