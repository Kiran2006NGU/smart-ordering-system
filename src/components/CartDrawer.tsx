import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  Check, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { CartItem, CustomerDetails, LuckyCoupon, RestaurantInfo } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  restaurantInfo: RestaurantInfo;
  coupons: LuckyCoupon[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  customer: CustomerDetails;
  appliedCoupon: LuckyCoupon | null;
  onApplyCoupon: (coupon: LuckyCoupon | null) => void;
  onProceedToCheckout: () => void;
  onOpenLuckyDraw: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  restaurantInfo,
  coupons,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  customer,
  appliedCoupon,
  onApplyCoupon,
  onProceedToCheckout,
  onOpenLuckyDraw
}) => {
  if (!isOpen) return null;

  const [inputCouponCode, setInputCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Dynamic billing math based on Admin Site Settings
  const originalTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 0;
  const discountAmount = Math.round((originalTotal * discountPercent) / 100);
  const subtotalAfterDiscount = originalTotal - discountAmount;
  
  const gstRate = (restaurantInfo.gstPercentage ?? 5) / 100;
  const gstAmount = +(subtotalAfterDiscount * gstRate).toFixed(2);
  const finalTotal = +(subtotalAfterDiscount + gstAmount).toFixed(2);

  const handleApplyCode = () => {
    setCouponError('');
    setCouponSuccess('');
    const found = coupons.find(
      c => c.code.toUpperCase() === inputCouponCode.trim().toUpperCase() && c.isActive !== false
    );
    if (found) {
      onApplyCoupon(found);
      setCouponSuccess(`Coupon ${found.code} applied! ${found.discountPercent}% OFF.`);
      setInputCouponCode('');
    } else {
      setCouponError('Invalid or inactive coupon code. Try spinning the lucky draw!');
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-100 animate-slideLeft"
        >
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">Your Order Cart</h2>
                <p className="text-xs text-slate-400">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  title="Clear Cart"
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-800 text-lg">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Explore our wood-fired pizzas, gourmet burgers, thickshakes, and combo platters!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-orange-500 transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3 group"
                    >
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-sm text-slate-900 truncate">
                            {item.menuItem.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Customization labels */}
                        <div className="flex flex-wrap gap-1 mt-1 text-[11px] text-slate-500">
                          {item.selectedSize && (
                            <span className="bg-white px-1.5 py-0.5 rounded-md border border-slate-200 font-semibold">
                              {item.selectedSize}
                            </span>
                          )}
                          {item.selectedSpice && (
                            <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-md border border-rose-200 font-semibold">
                              {item.selectedSpice}
                            </span>
                          )}
                          {item.selectedAddOns?.map((add, i) => (
                            <span key={i} className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-200">
                              +{add.name}
                            </span>
                          ))}
                        </div>

                        {item.specialInstructions && (
                          <p className="text-[10px] text-slate-400 italic mt-1 truncate">
                            Note: "{item.specialInstructions}"
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-sm font-black text-slate-900">
                            Rs. {item.totalPrice}
                          </span>

                          {/* Stepper */}
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-black text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-orange-500 text-white hover:bg-orange-600 flex items-center justify-center font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lucky Draw Trigger banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                    <div>
                      <p className="text-xs font-extrabold text-amber-900">
                        Have you scratched today's coupon?
                      </p>
                      <p className="text-[11px] text-amber-700">
                        Unlock 16% to 43% off instantly!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenLuckyDraw}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                  >
                    Play Draw
                  </button>
                </div>

                {/* Promo Code Input */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-orange-500" />
                    <span>Apply Coupon Code</span>
                  </label>

                  {appliedCoupon ? (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          %
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-xs text-emerald-900">
                              {appliedCoupon.code}
                            </span>
                            <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded-full">
                              {appliedCoupon.discountPercent}% OFF
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-700">
                            Saved Rs. {discountAmount} on this bill
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon (e.g. 104E, 103E)"
                        value={inputCouponCode}
                        onChange={(e) => {
                          setInputCouponCode(e.target.value);
                          setCouponError('');
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                      <button
                        onClick={handleApplyCode}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{couponError}</span>
                    </p>
                  )}
                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>{couponSuccess}</span>
                    </p>
                  )}
                </div>

                {/* C++ Billing math breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Original Total</span>
                    <span>Rs. {originalTotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 font-semibold">
                      <span>Discount Applied ({discountPercent}%)</span>
                      <span>- Rs. {discountAmount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-600">
                    <span>GST ({restaurantInfo.gstPercentage}%)</span>
                    <span>Rs. {gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-900">
                    <span>Final Total with GST</span>
                    <span className="text-base text-orange-600">Rs. {finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Proceed Button */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-white border-t border-slate-100 space-y-2">
              <button
                id="proceed-checkout-btn"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-between px-5 cursor-pointer active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1">
                  <span>Rs. {finalTotal.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Safe Payment Gateway • Instant Kitchen Confirmation</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
