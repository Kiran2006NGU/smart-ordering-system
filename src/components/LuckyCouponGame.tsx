import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Gift, 
  Sparkles, 
  Copy, 
  Check, 
  Trophy, 
  RotateCcw, 
  Flame, 
  PartyPopper,
  X
} from 'lucide-react';
import { LuckyCoupon, RestaurantInfo } from '../types';

interface LuckyCouponGameProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: LuckyCoupon[];
  restaurantInfo: RestaurantInfo;
  onApplyCoupon: (coupon: LuckyCoupon) => void;
  onAnnounceWin: (code: string, discount: number) => void;
  currentAppliedCouponCode?: string;
}

export const LuckyCouponGame: React.FC<LuckyCouponGameProps> = ({
  isOpen,
  onClose,
  coupons,
  restaurantInfo,
  onApplyCoupon,
  onAnnounceWin,
  currentAppliedCouponCode
}) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState<'scratch' | 'wheel'>('scratch');
  const [isScratching, setIsScratching] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [revealedCoupon, setRevealedCoupon] = useState<LuckyCoupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dynamic active coupon pool from Admin CMS
  const activeCoupons = coupons.filter(c => c.isActive !== false);
  const luckyPool = activeCoupons.filter(c => c.isLuckyDraw);
  const drawPool = luckyPool.length > 0 ? luckyPool : (activeCoupons.length > 0 ? activeCoupons : coupons);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#ef4444']
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Scratch action
  const handleScratchReveal = () => {
    if (isScratched || drawPool.length === 0) return;
    setIsScratching(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * drawPool.length);
      const won = drawPool[randomIndex];
      setRevealedCoupon(won);
      setIsScratched(true);
      setIsScratching(false);
      triggerConfetti();
      onAnnounceWin(won.code, won.discountPercent);
    }, 600);
  };

  // Wheel Spin action
  const handleSpinWheel = () => {
    if (isSpinning || drawPool.length === 0) return;
    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * drawPool.length);
    const won = drawPool[randomIndex];
    const segmentAngle = 360 / drawPool.length;
    const targetRotation = wheelRotation + 1440 + (randomIndex * segmentAngle);

    setWheelRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setRevealedCoupon(won);
      triggerConfetti();
      onAnnounceWin(won.code, won.discountPercent);
    }, 3200);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (coupon: LuckyCoupon) => {
    onApplyCoupon(coupon);
    onClose();
  };

  const handleReset = () => {
    setIsScratched(false);
    setRevealedCoupon(null);
  };

  const maxDiscount = drawPool.length > 0 ? Math.max(...drawPool.map(c => c.discountPercent)) : 43;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        id="lucky-coupon-modal-content"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-200 my-8 flex flex-col relative"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Gift className="w-6 h-6 text-white animate-bounce" />
          </div>

          <h2 className="text-2xl font-black tracking-tight">
            {restaurantInfo.name} Lucky Draw
          </h2>
          <p className="text-xs text-amber-100 mt-1 max-w-xs mx-auto">
            Try your luck to win authentic promo codes with up to {maxDiscount}% OFF!
          </p>

          {/* Mode Switcher */}
          <div className="flex items-center justify-center gap-2 mt-4 bg-black/20 p-1 rounded-xl max-w-xs mx-auto">
            <button
              onClick={() => { setActiveMode('scratch'); handleReset(); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'scratch' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:text-white'
              }`}
            >
              Scratch Card
            </button>
            <button
              onClick={() => { setActiveMode('wheel'); handleReset(); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'wheel' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:text-white'
              }`}
            >
              Spin the Wheel
            </button>
          </div>
        </div>

        {/* Game Stage */}
        <div className="p-6 text-slate-800 space-y-6">
          {activeMode === 'scratch' ? (
            /* Scratch Card Mode */
            <div className="space-y-4 text-center">
              <div 
                id="scratch-card-box"
                onClick={handleScratchReveal}
                className={`relative w-full h-48 rounded-3xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition-all ${
                  isScratched
                    ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-inner'
                    : 'border-amber-400 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 hover:shadow-lg active:scale-98'
                }`}
              >
                {!isScratched ? (
                  <div className="text-white space-y-2 select-none px-4">
                    <Sparkles className="w-8 h-8 text-amber-100 mx-auto animate-spin" />
                    <p className="text-lg font-black tracking-wide">
                      {isScratching ? 'Revealing Lucky Prize...' : 'TAP OR CLICK TO SCRATCH'}
                    </p>
                    <p className="text-xs text-amber-100">
                      Unveil your mystery QuickBite discount!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 p-4 animate-scaleUp">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                      <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{revealedCoupon?.title}</span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {revealedCoupon?.discountPercent}% DISCOUNT
                    </div>
                    <div className="inline-block bg-white px-4 py-1.5 rounded-xl border border-emerald-300 font-mono font-black text-lg text-emerald-700 shadow-xs">
                      {revealedCoupon?.code}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {revealedCoupon?.description}
                    </p>
                  </div>
                )}
              </div>

              {isScratched && revealedCoupon && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopyCode(revealedCoupon.code)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode === revealedCoupon.code ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code ({revealedCoupon.code})</span>
                      </>
                    )}
                  </button>

                  <button
                    id="apply-scratched-coupon-btn"
                    onClick={() => handleApply(revealedCoupon)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply to Cart</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Spin the Wheel Mode */
            <div className="space-y-4 text-center">
              <div className="relative w-56 h-56 mx-auto">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-600 drop-shadow-md" />

                {/* Rotating Wheel */}
                <div 
                  className="w-full h-full rounded-full border-4 border-slate-900 overflow-hidden shadow-2xl relative transition-transform duration-[3000ms] ease-out flex items-center justify-center bg-slate-900"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600" />
                  
                  {/* Slices label */}
                  {drawPool.map((c, i) => {
                    const angle = (360 / drawPool.length) * i;
                    return (
                      <div
                        key={c.code}
                        className="absolute text-[11px] font-black text-white"
                        style={{
                          transform: `rotate(${angle}deg) translateY(-60px)`
                        }}
                      >
                        {c.discountPercent}% ({c.code})
                      </div>
                    );
                  })}

                  {/* Center hub */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-slate-900 text-amber-300 font-black text-xs flex items-center justify-center border-2 border-amber-400 shadow-md">
                    FB
                  </div>
                </div>
              </div>

              {/* Spin Button */}
              <button
                id="spin-wheel-btn"
                disabled={isSpinning}
                onClick={handleSpinWheel}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white font-black text-sm shadow-md transition-all cursor-pointer"
              >
                {isSpinning ? 'Wheel Spinning...' : 'SPIN FOR LUCKY COUPON'}
              </button>

              {revealedCoupon && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2 animate-scaleUp">
                  <p className="text-xs font-bold text-emerald-800 uppercase">You Won: {revealedCoupon.title}!</p>
                  <p className="text-2xl font-black text-slate-900">{revealedCoupon.discountPercent}% OFF</p>
                  <button
                    onClick={() => handleApply(revealedCoupon)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Apply {revealedCoupon.code} to My Order
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick List of Available Active Promo Codes */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
              All Available {restaurantInfo.name} Promo Codes:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeCoupons.map((coupon) => {
                const isApplied = currentAppliedCouponCode === coupon.code;
                return (
                  <button
                    key={coupon.code}
                    onClick={() => handleApply(coupon)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isApplied 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-xs'
                        : 'border-slate-200 hover:border-amber-300 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-slate-900">
                        {coupon.code}
                      </span>
                      {isApplied && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 mt-0.5">
                      {coupon.discountPercent}% OFF
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
