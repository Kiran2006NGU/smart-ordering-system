import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Pizza, 
  Coffee, 
  Cookie, 
  Layers, 
  Sparkles, 
  SlidersHorizontal,
  Flame,
  Star,
  CheckCircle2,
  X
} from 'lucide-react';
import { MenuItem, CategoryType, RestaurantInfo } from '../types';
import { MenuItemCard } from './MenuItemCard';

interface MenuSectionProps {
  items: MenuItem[];
  restaurantInfo?: RestaurantInfo;
  cartItems: { [itemId: string]: number };
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (item: MenuItem, newQty: number) => void;
  onCustomize: (item: MenuItem) => void;
  onCategoryChange?: (category: string) => void;
  wishlistIds?: Set<string>;
  onToggleWishlist?: (item: MenuItem) => void;
  onQuickView?: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  restaurantInfo,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onCustomize,
  onCategoryChange,
  wishlistIds,
  onToggleWishlist,
  onQuickView
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState<'all' | 'veg' | 'bestseller' | 'spicy'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  const categories: { id: CategoryType; label: string; icon: React.ReactNode; count: number }[] = [
    { 
      id: 'all', 
      label: 'All Delights', 
      icon: <Sparkles className="w-4 h-4" />, 
      count: items.length 
    },
    { 
      id: 'food', 
      label: '1. Food (Pizza, Burger, Pasta...)', 
      icon: <Pizza className="w-4 h-4" />, 
      count: items.filter(i => i.category === 'food').length 
    },
    { 
      id: 'drink', 
      label: '2. Drinks & Shakes', 
      icon: <Coffee className="w-4 h-4" />, 
      count: items.filter(i => i.category === 'drink').length 
    },
    { 
      id: 'snack', 
      label: '3. Snacks (Fries, Nuggets...)', 
      icon: <Cookie className="w-4 h-4" />, 
      count: items.filter(i => i.category === 'snack').length 
    },
    { 
      id: 'combo', 
      label: '4. Combo Offers & Platters', 
      icon: <Layers className="w-4 h-4" />, 
      count: items.filter(i => i.category === 'combo').length 
    },
    { 
      id: 'dessert', 
      label: 'Desserts & Sundaes', 
      icon: <Sparkles className="w-4 h-4" />, 
      count: items.filter(i => i.category === 'dessert').length 
    }
  ];

  const handleCategoryClick = (cat: CategoryType) => {
    setSelectedCategory(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  // Filtered & Sorted Items
  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        // Category match
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Dietary filter
        if (selectedDiet === 'veg' && !item.isVeg) return false;
        if (selectedDiet === 'bestseller' && !item.isBestseller) return false;
        if (selectedDiet === 'spicy' && !item.isSpicy) return false;

        // Search query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesCategory = item.category.toLowerCase().includes(q);
          const matchesTags = item.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesCategory && !matchesTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewsCount - a.reviewsCount;
      });
  }, [items, selectedCategory, selectedDiet, searchQuery, sortBy]);

  return (
    <section id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Tabs Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {restaurantInfo?.name || 'Chef Specials'} &amp; Delights
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Select category or explore our chef special combos
            </p>
          </div>
        </div>

        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-tab-${cat.id}`}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-102'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
                }`}
              >
                <span className={isSelected ? 'text-amber-400' : 'text-slate-500'}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                <span 
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 my-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="menu-search-input"
            type="text"
            placeholder="Search pizza, burger, milkshake..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dietary Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedDiet('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedDiet === 'all'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setSelectedDiet('veg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              selectedDiet === 'veg'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Pure Veg</span>
          </button>
          <button
            onClick={() => setSelectedDiet('bestseller')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              selectedDiet === 'bestseller'
                ? 'bg-orange-100 text-orange-900 border border-orange-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span>Bestsellers</span>
          </button>
          <button
            onClick={() => setSelectedDiet('spicy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              selectedDiet === 'spicy'
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>🌶️ Spicy</span>
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort:</span>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated (★)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid of Menu Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              cartQuantity={cartItems[item.id] || 0}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
              onCustomize={onCustomize}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds ? wishlistIds.has(item.id) : false}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No delicious items found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keywords or dietary filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDiet('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
