import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Printer, 
  ShoppingBag, 
  Sparkles, 
  Phone, 
  MapPin, 
  User, 
  ChefHat, 
  Utensils, 
  Share2, 
  ArrowRight,
  ReceiptText
} from 'lucide-react';
import { OrderRecord, OrderStatus, RestaurantInfo } from '../types';

interface OrderTrackerViewProps {
  order: OrderRecord;
  restaurantInfo: RestaurantInfo;
  onReorder: (order: OrderRecord) => void;
  onBackToHome: () => void;
}

export const OrderTrackerView: React.FC<OrderTrackerViewProps> = ({
  order,
  restaurantInfo,
  onReorder,
  onBackToHome
}) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.orderStatus);
  const [estimatedMinutes, setEstimatedMinutes] = useState(order.estimatedTimeMinutes || 15);

  // Live order status progression simulation
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStatus('kitchen_preparing');
    }, 4000);

    const timer2 = setTimeout(() => {
      setCurrentStatus('ready');
    }, 14000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const steps: { id: OrderStatus; label: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'placed',
      label: 'Order Confirmed',
      description: 'Payment verified and sent to POS billing system',
      icon: <CheckCircle2 className="w-5 h-5" />
    },
    {
      id: 'kitchen_preparing',
      label: 'Chef Preparing Meal',
      description: 'Handcrafted with fresh ingredients & signature recipes',
      icon: <ChefHat className="w-5 h-5" />
    },
    {
      id: 'ready',
      label: 'Ready for Service',
      description: order.customer.orderType === 'dine_in' 
        ? `Serving hot to ${order.customer.tableNumber || 'Table'}` 
        : order.customer.orderType === 'takeaway' 
        ? `Packed at ${restaurantInfo.name} Pickup Counter` 
        : 'Dispatched with Delivery Partner',
      icon: <Utensils className="w-5 h-5" />
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'placed' || status === 'confirmed') return 0;
    if (status === 'kitchen_preparing') return 1;
    return 2;
  };

  const currentStepIdx = getStepIndex(currentStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thank You for Visiting {restaurantInfo.name}!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Order #{order.orderNumber} Placed
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
              Your delicacies are being freshly crafted in our kitchen right now.
            </p>
          </div>

          {/* Live ETA Card */}
          <div className="bg-white text-slate-900 rounded-2xl p-4 text-center shadow-lg shrink-0 min-w-[150px]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
              Estimated Ready Time
            </span>
            <span className="text-2xl font-black text-emerald-600 font-mono">
              ~{estimatedMinutes} Mins
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Live Kitchen Queue</span>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <span>Live Kitchen Progress</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50/50 text-slate-800'
                    : 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      isCurrent
                        ? 'bg-orange-500 text-white animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                      {step.label}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Step {idx + 1} of 3
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* C++ Verbatim Style Printable Tax Invoice Receipt */}
      <div 
        id="printable-receipt"
        className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 text-slate-800"
      >
        {/* Receipt Header */}
        <div className="text-center border-b border-dashed border-slate-300 pb-5 space-y-1">
          <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            - : WELCOME TO {restaurantInfo.name.toUpperCase()} : -
          </p>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
            {restaurantInfo.name.toUpperCase()}
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            {restaurantInfo.address || 'Flagship Food Court Outlet'}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Hotline: {restaurantInfo.hotline} • Timings: {restaurantInfo.timings}
          </p>
          <p className="text-[11px] text-slate-400 font-mono pt-1">
            Order Ref: #{order.orderNumber} • Date: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Customer & Mobile Section (Mirrors C++ code: getCustomer() & getMobile()) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500">👤 Customer:</span>{' '}
            <strong className="text-slate-900 font-bold">{order.customer.name}</strong>
          </div>
          <div>
            <span className="text-slate-500">📱 Mobile:</span>{' '}
            <strong className="text-slate-900 font-bold">{order.customer.mobile}</strong>
          </div>
          <div>
            <span className="text-slate-500">📍 Dining:</span>{' '}
            <strong className="text-slate-900 font-bold uppercase">
              {order.customer.orderType === 'dine_in' ? `Dine-In (${order.customer.tableNumber || 'Table 4'})` : order.customer.orderType}
            </strong>
          </div>
          <div>
            <span className="text-slate-500">💳 Payment:</span>{' '}
            <strong className="text-emerald-700 font-bold uppercase">
              {order.paymentMethod} (PAID: {order.transactionId})
            </strong>
          </div>
        </div>

        {/* Items Ordered breakdown (Mirrors C++ stringstream itemList: - Item xQty (Rs.Price each) = Rs.Total) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
            🧾 Items Ordered:
          </h4>
          <div className="divide-y divide-slate-100 font-mono text-xs">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="py-2.5 flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900">
                    - {item.menuItem.name} <span className="text-orange-600">x{item.quantity}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    (Rs.{item.unitPrice} each)
                    {item.selectedSize ? ` • ${item.selectedSize}` : ''}
                    {item.selectedSpice ? ` • ${item.selectedSpice}` : ''}
                  </p>
                </div>
                <span className="font-bold text-slate-900">
                  Rs. {item.totalPrice}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Table (Mirrors C++ format) */}
        <div className="border-t border-dashed border-slate-300 pt-4 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-600">
            <span>🧾 Original Total</span>
            <span>Rs. {order.originalTotal}</span>
          </div>

          <div className="flex items-center justify-between text-emerald-700 font-bold">
            <span>🔻 Discount Applied {order.couponCode ? `(Coupon ${order.couponCode})` : ''}</span>
            <span>- Rs. {order.discountAmount}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>🧾 GST ({restaurantInfo.gstPercentage}%)</span>
            <span>Rs. {order.gstAmount.toFixed(2)}</span>
          </div>

          {order.deliveryFee > 0 && (
            <div className="flex items-center justify-between text-slate-600">
              <span>🚚 Delivery / Packaging</span>
              <span>Rs. {order.deliveryFee}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-sm sm:text-base font-black text-slate-900 font-sans">
            <span>✅ Final Total with GST</span>
            <span className="text-orange-600 font-mono text-lg">
              Rs. {order.finalTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer note matching C++ terminal signoff */}
        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono space-y-1">
          <p className="font-bold text-slate-800 uppercase">
            THANK YOU FOR VISITING {restaurantInfo.name} !
          </p>
          <p className="tracking-widest">PLEASE COME AGAIN</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-4 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Receipt</span>
          </button>

          <button
            onClick={() => onReorder(order)}
            className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Re-Order This Feast</span>
          </button>

          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Explore More Delights</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
