import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  Share2, 
  Flame, 
  ShieldCheck, 
  Clock, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Check,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';
import { MenuItem, MenuItemOption } from '../types';

interface ProductDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customizedItem: {
    menuItem: MenuItem;
    quantity: number;
    selectedSize?: string;
    selectedSpice?: string;
    selectedAddOns?: MenuItemOption[];
    specialInstructions?: string;
    unitPrice: number;
    totalPrice: number;
  }) => void;
  onToggleWishlist: (item: MenuItem) => void;
  isWishlisted: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) => {
  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    item.customizations?.sizes?.[0]?.name || 'Standard'
  );
  const [selectedSpice, setSelectedSpice] = useState<string>(
    item.customizations?.spiceLevels?.[0] || 'Medium'
  );
  const [selectedAddOns, setSelectedAddOns] = useState<MenuItemOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string>(item.image);

  // Calculate Unit Price based on base + size multiplier + add-ons
  const sizeMultiplier = item.customizations?.sizes?.find(
    s => s.name === selectedSize
  )?.priceMultiplier || 1;

  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const unitPrice = Math.round(item.price * sizeMultiplier) + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleToggleAddOn = (addOn: MenuItemOption) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.name === addOn.name);
      if (exists) {
        return prev.filter(a => a.name !== addOn.name);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAdd = () => {
    onAddToCart({
      menuItem: item,
      quantity,
      selectedSize,
      selectedSpice: item.isSpicy ? selectedSpice : undefined,
      selectedAddOns,
      specialInstructions,
      unitPrice,
      totalPrice
    });
    onClose();
  };

  // Mock photo thumbnails for gallery view
  const galleryImages = [
    item.image,
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        id="product-detail-modal"
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] my-auto"
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {item.isVeg ? '100% Pure Vegetarian' : 'Non-Vegetarian'} • {item.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(item)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isWishlisted 
                  ? 'bg-rose-50 border-rose-200 text-rose-500' 
                  : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500'
              }`}
              title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Share item"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Image & Thumbnails */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner group">
                <img
                  src={activeImage}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {item.isBestseller && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>#1 BESTSELLER</span>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails */}
              <div className="flex gap-2">
                {galleryImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === imgUrl ? 'border-orange-500 shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>

              {/* Quick Trust Badges */}
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100/80 text-xs text-emerald-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Quality &amp; Freshness Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-700">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Freshly prepared in ~{item.prepTime || '15-20 mins'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Ratings, Details & Customizations */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {item.name}
                </h1>
                
                {/* Rating & Reviews Bar */}
                <div className="flex items-center gap-3 pt-1.5">
                  <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-xs font-bold">
                    <span>{item.rating}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.reviewsCount || 142} verified customer ratings
                  </span>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-2xl font-black text-slate-900">
                  ₹{unitPrice}
                </span>
                {item.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{item.originalPrice}
                  </span>
                )}
                {item.originalPrice && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Save ₹{item.originalPrice - item.price}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 ml-auto font-medium">Inclusive of all taxes</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {/* Nutrition & Calories */}
              {item.calories && (
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 font-semibold">
                    🔥 {item.calories} kcal
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 font-semibold">
                    ⏱ {item.prepTime || '15 mins'} prep
                  </span>
                </div>
              )}

              {/* Customization: Sizes */}
              {item.customizations?.sizes && item.customizations.sizes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    Choose Portion / Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {item.customizations.sizes.map((sz) => (
                      <button
                        key={sz.name}
                        onClick={() => setSelectedSize(sz.name)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          selectedSize === sz.name
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {sz.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customization: Spice Levels */}
              {item.isSpicy && item.customizations?.spiceLevels && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    Spice Level:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {item.customizations.spiceLevels.map((spice) => (
                      <button
                        key={spice}
                        onClick={() => setSelectedSpice(spice)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          selectedSpice === spice
                            ? 'bg-red-500 text-white border-red-500 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        🌶 {spice}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customization: Add-ons */}
              {item.customizations?.addOns && item.customizations.addOns.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    Add Extras &amp; Toppings:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.customizations.addOns.map((addOn) => {
                      const isSelected = selectedAddOns.some(a => a.name === addOn.name);
                      return (
                        <button
                          key={addOn.name}
                          onClick={() => handleToggleAddOn(addOn)}
                          className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50 border-amber-400 text-slate-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <span>{addOn.name}</span>
                          </div>
                          <span className="text-slate-900 font-bold">+₹{addOn.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions Box */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Special Kitchen Note (optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less spicy, extra napkins, cutlery required..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-t border-slate-800">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-black text-sm text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm shadow-xl flex items-center justify-between cursor-pointer transition-all active:scale-98"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Order</span>
            </div>
            <span className="text-base font-black">
              ₹{totalPrice}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
