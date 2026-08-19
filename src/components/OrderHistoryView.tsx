import React from 'react';
import { 
  History, 
  ShoppingBag, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Receipt,
  RotateCcw
} from 'lucide-react';
import { OrderRecord } from '../types';

interface OrderHistoryViewProps {
  orders: OrderRecord[];
  onViewOrder: (order: OrderRecord) => void;
  onReorder: (order: OrderRecord) => void;
  onExploreMenu: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orders,
  onViewOrder,
  onReorder,
  onExploreMenu
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-orange-500" />
            <span>Order History</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track past QuickBite meals, reprint GST invoices, or re-order in 1-click
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No previous orders yet</h3>
            <p className="text-xs text-slate-500">
              When you place orders for pizzas, burgers, or shakes, they will appear here with full invoice summaries.
            </p>
          </div>
          <button
            onClick={onExploreMenu}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-500 text-white font-bold text-xs transition-colors"
          >
            Start Your First Order
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    #{order.orderNumber}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Paid (Rs.{order.finalTotal.toFixed(2)})
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <p className="font-semibold text-slate-800">
                    {order.items.map(i => `${i.menuItem.name} (x${i.quantity})`).join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Customer: <strong>{order.customer.name}</strong> • {order.customer.mobile} • {order.customer.orderType.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onViewOrder(order)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>

                <button
                  onClick={() => onReorder(order)}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
