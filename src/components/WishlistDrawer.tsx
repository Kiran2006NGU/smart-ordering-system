import React from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles,
  Plus
} from 'lucide-react';
import { MenuItem } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: MenuItem[];
  onRemoveFromWishlist: (itemId: string) => void;
  onAddToCart: (item: MenuItem) => void;
  onMoveAllToCart: () => void;
  onExploreMenu: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onMoveAllToCart,
  onExploreMenu
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slideLeft">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="font-extrabold text-base">Your Wishlist</h2>
                <p className="text-xs text-slate-300">
                  {wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center border border-rose-100">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-900">Your wishlist is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Tap the heart icon on any food item or thickshake to save it for your next craving!
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onExploreMenu();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex gap-3 items-center justify-between"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs font-black text-orange-600 mt-0.5">
                      ₹{item.price}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.category} • {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => onAddToCart(item)}
                      className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                      title="Add to Cart"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>

                    <button
                      onClick={() => onRemoveFromWishlist(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 self-center transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Action Footer */}
          {wishlistItems.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  onMoveAllToCart();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Cart ({wishlistItems.length})</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
