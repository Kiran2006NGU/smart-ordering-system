import React from 'react';
import { 
  Plus, 
  Minus, 
  Star, 
  Flame, 
  Clock, 
  Sparkles, 
  SlidersHorizontal,
  Check,
  Heart,
  Eye
} from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  cartQuantity: number;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (item: MenuItem, newQty: number) => void;
  onCustomize: (item: MenuItem) => void;
  onQuickView?: (item: MenuItem) => void;
  onToggleWishlist?: (item: MenuItem) => void;
  isWishlisted?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onCustomize,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false
}) => {
  const isOutOfStock = item.inStock === false;

  const hasCustomizations = !isOutOfStock && !!(
    item.customizations?.sizes?.length || 
    item.customizations?.spiceLevels?.length || 
    item.customizations?.addOns?.length
  );

  return (
    <div 
      id={`item-card-${item.id}`}
      className={`group bg-white rounded-3xl border border-slate-100/80 shadow-sm transition-all duration-300 flex flex-col overflow-hidden relative ${
        isOutOfStock ? 'opacity-70 grayscale-[30%]' : 'hover:shadow-xl hover:border-amber-200'
      }`}
    >
      {/* Image container */}
      <div 
        onClick={() => onQuickView ? onQuickView(item) : onCustomize(item)}
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            !isOutOfStock && 'group-hover:scale-105'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-md">
              Out of Stock
            </span>
          ) : (
            <>
              {item.isBestseller && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Bestseller
                </span>
              )}
              {item.isChefSpecial && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Chef Pick
                </span>
              )}
              {item.isSpicy && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
                  🌶️ Spicy
                </span>
              )}
            </>
          )}
        </div>

        {/* Dietary veg/non-veg dot & Wishlist Button */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(item);
              }}
              className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer ${
                isWishlisted 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/90 text-slate-400 hover:text-rose-500'
              }`}
              title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          )}

          <div 
            className={`w-6 h-6 rounded-md bg-white/95 backdrop-blur-xs flex items-center justify-center border shadow-xs ${
              item.isVeg ? 'border-emerald-600' : 'border-rose-600'
            }`}
            title={item.isVeg ? '100% Pure Vegetarian' : 'Non-Vegetarian'}
          >
            <div 
              className={`w-2.5 h-2.5 rounded-full ${
                item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
              }`} 
            />
          </div>
        </div>

        {/* Quick View Hover overlay button */}
        {onQuickView && (
          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 font-extrabold text-xs shadow-lg flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-orange-500" />
              <span>Quick View</span>
            </span>
          </div>
        )}

        {/* Prep Time pill */}
        {item.prepTime && (
          <div className="absolute bottom-3 left-3 z-10 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{item.prepTime}</span>
          </div>
        )}

        {/* Calorie pill */}
        {item.calories && (
          <div className="absolute bottom-3 right-3 z-10 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[11px] font-medium px-2.5 py-1 rounded-full">
            <span>{item.calories} kcal</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Header title & rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onQuickView ? onQuickView(item) : onCustomize(item)}
              className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-amber-600 transition-colors line-clamp-1 cursor-pointer"
            >
              {item.name}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{item.rating}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {item.description}
          </p>

          {/* Combo includes list */}
          {item.comboIncludes && (
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Combo Includes:
              </p>
              <ul className="mt-1 space-y-0.5 text-xs text-slate-600">
                {item.comboIncludes.map((inc, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {item.tags && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {item.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-slate-900">
                Rs.{item.price}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  Rs.{item.originalPrice}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">+5% GST at bill</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {hasCustomizations && (
              <button
                id={`customize-btn-${item.id}`}
                onClick={() => onCustomize(item)}
                title="Customize (Size, Spice, Add-ons)"
                className="p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-xs font-semibold cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            {isOutOfStock ? (
              <button
                disabled
                className="px-3.5 py-2 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : cartQuantity > 0 ? (
              <div className="flex items-center bg-orange-50 border border-orange-200 rounded-xl p-1 shadow-xs">
                <button
                  id={`decrement-btn-${item.id}`}
                  onClick={() => onUpdateQuantity(item, cartQuantity - 1)}
                  className="w-7 h-7 rounded-lg bg-white text-orange-600 hover:bg-orange-100 font-bold flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-extrabold text-sm text-orange-800">
                  {cartQuantity}
                </span>
                <button
                  id={`increment-btn-${item.id}`}
                  onClick={() => onUpdateQuantity(item, cartQuantity + 1)}
                  className="w-7 h-7 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-bold flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id={`add-to-cart-btn-${item.id}`}
                onClick={() => onAddToCart(item)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
