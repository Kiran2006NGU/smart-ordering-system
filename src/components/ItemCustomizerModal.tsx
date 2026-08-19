import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Check, 
  Sparkles, 
  Info,
  Flame
} from 'lucide-react';
import { MenuItem, MenuItemOption } from '../types';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdd: (
    item: MenuItem,
    quantity: number,
    selectedSize?: string,
    selectedSpice?: string,
    selectedAddOns?: MenuItemOption[],
    specialInstructions?: string
  ) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmAdd
}) => {
  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    item.customizations?.sizes?.[0]?.name || ''
  );
  const [selectedSpice, setSelectedSpice] = useState<string>(
    item.customizations?.spiceLevels?.[0] || ''
  );
  const [selectedAddOns, setSelectedAddOns] = useState<MenuItemOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Price calculation
  const sizeMultiplier = item.customizations?.sizes?.find(s => s.name === selectedSize)?.priceMultiplier || 1.0;
  const baseCalculatedPrice = Math.round(item.price * sizeMultiplier);
  const addOnsTotal = selectedAddOns.reduce((sum, add) => sum + add.price, 0);
  const unitPrice = baseCalculatedPrice + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (option: MenuItemOption) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.name === option.name);
      if (exists) {
        return prev.filter(a => a.name !== option.name);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleAdd = () => {
    onConfirmAdd(
      item,
      quantity,
      selectedSize || undefined,
      selectedSpice || undefined,
      selectedAddOns.length > 0 ? selectedAddOns : undefined,
      specialInstructions.trim() || undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        id="customizer-modal-content"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 my-8 flex flex-col max-h-[90vh]"
      >
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h2 className="text-xl font-black">{item.name}</h2>
            <p className="text-xs text-slate-200 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Scrollable configuration body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-slate-800">
          {/* Sizes */}
          {item.customizations?.sizes && item.customizations.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>Select Size</span>
                <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
                  Required
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {item.customizations.sizes.map((s) => {
                  const isSelected = selectedSize === s.name;
                  const calculated = Math.round(item.price * s.priceMultiplier);
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSelectedSize(s.name)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/80 text-orange-950 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{s.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-orange-600" />}
                      </div>
                      <span className="text-xs font-black text-slate-700 mt-1">
                        Rs.{calculated}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice level */}
          {item.customizations?.spiceLevels && item.customizations.spiceLevels.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>Spice Level</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {item.customizations.spiceLevels.map((spice) => {
                  const isSelected = selectedSpice === spice;
                  return (
                    <button
                      key={spice}
                      type="button"
                      onClick={() => setSelectedSpice(spice)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {spice}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {item.customizations?.addOns && item.customizations.addOns.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Add Extra Toppings &amp; Dips</span>
              </label>
              <div className="space-y-2">
                {item.customizations.addOns.map((add) => {
                  const isSelected = selectedAddOns.some(a => a.name === add.name);
                  return (
                    <div
                      key={add.name}
                      onClick={() => toggleAddOn(add)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50/60 text-amber-950'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div 
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-semibold">{add.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        +Rs.{add.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Chef Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Special Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Less ice, extra crispy, sauce on side"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Footer controls & price summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {/* Quantity selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-extrabold text-sm text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-black text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Confirm Button with dynamic price */}
          <button
            id="customizer-add-btn"
            onClick={handleAdd}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-sm shadow-md hover:shadow-orange-200 transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Add Customized Item</span>
            <span className="bg-white/20 px-2.5 py-1 rounded-xl text-xs font-black">
              Rs. {totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
