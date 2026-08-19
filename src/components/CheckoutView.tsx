import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Tag, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Check, 
  AlertCircle,
  HelpCircle,
  QrCode
} from 'lucide-react';
import { CartItem, CustomerDetails, LuckyCoupon, RestaurantInfo } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  customer: CustomerDetails;
  appliedCoupon: LuckyCoupon | null;
  restaurantInfo: RestaurantInfo;
  coupons: LuckyCoupon[];
  onApplyCoupon: (coupon: LuckyCoupon | null) => void;
  onOpenCustomerModal: () => void;
  onOpenLuckyModal: () => void;
  onBackToMenu: () => void;
  onProceedToPayment: (finalAmount: number) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  customer,
  appliedCoupon,
  restaurantInfo,
  coupons,
  onApplyCoupon,
  onOpenCustomerModal,
  onOpenLuckyModal,
  onBackToMenu,
  onProceedToPayment
}) => {
  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [tipAmount, setTipAmount] = useState<number>(0);

  // Dynamic billing math based on Admin Site Settings
  const originalTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 0;
  const discountAmount = Math.round((originalTotal * discountPercent) / 100);
  const subtotalAfterDiscount = originalTotal - discountAmount;
  
  const gstRate = (restaurantInfo.gstPercentage ?? 5) / 100;
  const gstAmount = +(subtotalAfterDiscount * gstRate).toFixed(2);
  
  const minFreeDelivery = restaurantInfo.freeDeliveryMin ?? 200;
  const configuredDeliveryFee = restaurantInfo.deliveryFee ?? 30;
  const deliveryFee = customer.orderType === 'delivery' && subtotalAfterDiscount < minFreeDelivery ? configuredDeliveryFee : 0;
  const finalTotal = +(subtotalAfterDiscount + gstAmount + deliveryFee + tipAmount).toFixed(2);

  const handleApplyCouponCode = () => {
    setCouponError('');
    const found = coupons.find(
      c => c.code.toUpperCase() === inputCoupon.trim().toUpperCase() && c.isActive !== false
    );
    if (found) {
      onApplyCoupon(found);
      setInputCoupon('');
    } else {
      setCouponError('Invalid or inactive coupon code. Try the lucky scratch game!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top back banner */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{restaurantInfo.name} Verified Secure Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Order Review & Customer Confirmation */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer & Delivery card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                <span>Customer &amp; Dining Details</span>
              </h3>
              <button
                onClick={onOpenCustomerModal}
                className="text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                Edit Details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <p className="text-slate-400 font-medium">Customer Name</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{customer.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Mobile Number</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{customer.mobile || 'Not provided'}</p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 font-medium">Dining Mode</p>
                  <p className="font-bold text-orange-700 uppercase tracking-wide mt-0.5">
                    {customer.orderType === 'dine_in' ? `Dine-In (${customer.tableNumber || 'Table 4'})` : customer.orderType === 'takeaway' ? 'Takeaway Pickup' : `Delivery to: ${customer.deliveryAddress || 'Address set'}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5" /> Prep time: 15-20 mins
                </div>
              </div>
            </div>
          </div>

          {/* Ordered items itemized list */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                Ordered Items ({cartItems.length})
              </h3>
              <span className="text-xs text-slate-400">Review specifications</span>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-12 h-12 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.menuItem.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} × Rs.{item.unitPrice}
                        {item.selectedSize ? ` (${item.selectedSize})` : ''}
                        {item.selectedSpice ? ` • ${item.selectedSpice}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-slate-900">
                    Rs. {item.totalPrice}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip Chef / Delivery staff */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Tip our Kitchen &amp; Service Staff (Optional)
              </span>
              <span className="text-xs font-bold text-orange-600">
                {tipAmount > 0 ? `+Rs. ${tipAmount}` : 'No tip'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[0, 20, 50, 100].map(tip => (
                <button
                  key={tip}
                  onClick={() => setTipAmount(tip)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tipAmount === tip
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tip === 0 ? 'None' : `Rs. ${tip}`}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: C++ Exact Summary & Payment Trigger */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Coupon apply widget */}
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-300 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-xs text-amber-950 uppercase tracking-wide">
                  {restaurantInfo.name} Promo Code
                </span>
              </div>
              <button
                onClick={onOpenLuckyModal}
                className="text-[11px] font-extrabold text-amber-700 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
                <span>Spin Lucky Coupon</span>
              </button>
            </div>

            {appliedCoupon ? (
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                    %
                  </div>
                  <div>
                    <span className="font-mono font-black text-sm text-emerald-900">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[11px] text-emerald-700">
                      {appliedCoupon.discountPercent}% OFF • You saved Rs. {discountAmount}!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onApplyCoupon(null)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Lucky Coupon (e.g. 104E, 102E)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <button
                  onClick={handleApplyCouponCode}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}

            {couponError && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{couponError}</span>
              </p>
            )}
          </div>

          {/* C++ Order Summary / Billing breakdown Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 shadow-xl border border-slate-800">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-black text-lg tracking-tight flex items-center justify-between">
                <span>Billing Summary</span>
                <span className="text-xs uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  {restaurantInfo.gstPercentage}% GST System
                </span>
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Original Total</span>
                <span className="font-bold text-white">Rs. {originalTotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>🔻 Discount Applied ({discountPercent}%)</span>
                  <span className="font-bold">- Rs. {discountAmount}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>🧾 Subtotal</span>
                <span className="font-bold text-white">Rs. {subtotalAfterDiscount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>🧾 GST ({restaurantInfo.gstPercentage}%)</span>
                <span className="font-bold text-white">Rs. {gstAmount.toFixed(2)}</span>
              </div>

              {customer.orderType === 'delivery' && (
                <div className="flex items-center justify-between">
                  <span>🚚 Delivery Fee</span>
                  <span className="font-bold text-white">
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                  </span>
                </div>
              )}

              {tipAmount > 0 && (
                <div className="flex items-center justify-between text-amber-300">
                  <span>Staff Tip</span>
                  <span className="font-bold">+ Rs. {tipAmount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-base font-black text-white">
                <span>✅ Final Total with GST</span>
                <span className="text-xl text-amber-400">Rs. {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Pay Action button */}
            <button
              id="proceed-pay-gateway-btn"
              onClick={() => onProceedToPayment(finalTotal)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-base shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <CreditCard className="w-5 h-5" />
              <span>Select Payment Method (Rs. {finalTotal.toFixed(2)})</span>
            </button>

            <div className="text-[11px] text-slate-400 text-center space-y-1 pt-1">
              <p className="flex items-center justify-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>Supports UPI (GPay, PhonePe, Paytm), Cards &amp; NetBanking</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
