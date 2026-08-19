import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  UtensilsCrossed, 
  ShoppingBag, 
  Truck, 
  Check 
} from 'lucide-react';
import { CustomerDetails } from '../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerDetails;
  onSave: (details: CustomerDetails) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
  onSave
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(customer.name || '');
  const [mobile, setMobile] = useState(customer.mobile || '');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>(
    customer.orderType || 'dine_in'
  );
  const [tableNumber, setTableNumber] = useState(customer.tableNumber || 'Table 4');
  const [deliveryAddress, setDeliveryAddress] = useState(
    customer.deliveryAddress || ''
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!mobile.trim() || mobile.length < 8) {
      setError('Please provide a valid contact mobile number.');
      return;
    }

    onSave({
      name: name.trim(),
      mobile: mobile.trim(),
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        id="customer-modal-box"
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Your Dining Profile</h3>
              <p className="text-xs text-slate-500">For invoice, billing, and live order tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              How would you like to enjoy?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  orderType === 'dine_in'
                    ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span className="text-xs">Dine In</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  orderType === 'takeaway'
                    ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs">Takeaway</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  orderType === 'delivery'
                    ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="text-xs">Delivery</span>
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Customer Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Kiran Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Mobile Number (SMS updates) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Table Number or Delivery Address conditional input */}
          {orderType === 'dine_in' ? (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Table Number / Section</label>
              <input
                type="text"
                placeholder="e.g. Table 4 / Lounge"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          ) : orderType === 'delivery' ? (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Delivery Street Address</label>
              <textarea
                rows={2}
                placeholder="Building, Flat No., Street, Landmark..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          ) : null}

          {error && (
            <p className="text-xs text-rose-600 font-semibold">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Details</span>
          </button>
        </form>
      </div>
    </div>
  );
};
