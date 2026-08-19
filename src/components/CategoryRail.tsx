import React, { useRef } from 'react';
import { 
  Flame, 
  Sparkles, 
  Pizza, 
  Sandwich, 
  Coffee, 
  IceCream, 
  Percent, 
  UtensilsCrossed, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Cookie
} from 'lucide-react';
import { SubCategoryType } from '../types';

interface CategoryRailProps {
  activeSubcategory: SubCategoryType;
  onSelectSubcategory: (subcat: SubCategoryType) => void;
  onOpenLuckyModal: () => void;
  onSelectDeals?: () => void;
}

interface CategoryItem {
  id: SubCategoryType | 'deals';
  label: string;
  badge?: string;
  badgeColor?: string;
  icon: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    label: 'All Items',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80',
    badge: 'Popular',
    badgeColor: 'bg-amber-500'
  },
  {
    id: 'pizza',
    label: 'Pizzas',
    icon: '🍕',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80',
    badge: 'Wood-Fired',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 'burger',
    label: 'Burgers',
    icon: '🍔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80',
    badge: 'Crispy',
    badgeColor: 'bg-rose-500'
  },
  {
    id: 'shake',
    label: 'Thick Shakes',
    icon: '🥤',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=150&q=80',
    badge: 'Frozen Special',
    badgeColor: 'bg-cyan-500'
  },
  {
    id: 'sandwich',
    label: 'Sandwiches',
    icon: '🥪',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=150&q=80',
    badge: 'Grilled',
    badgeColor: 'bg-emerald-500'
  },
  {
    id: 'pasta',
    label: 'Pastas & Bowls',
    icon: '🍝',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=150&q=80',
    badge: 'Creamy',
    badgeColor: 'bg-indigo-500'
  },
  {
    id: 'snack',
    label: 'Starters & Fries',
    icon: '🍟',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=150&q=80',
    badge: 'Crunchy',
    badgeColor: 'bg-yellow-500'
  },
  {
    id: 'dessert',
    label: 'Desserts & Ice',
    icon: '🍰',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=150&q=80',
    badge: 'Sweet',
    badgeColor: 'bg-pink-500'
  },
  {
    id: 'combo',
    label: 'Mega Combos',
    icon: '🔥',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=150&q=80',
    badge: 'Save 35%',
    badgeColor: 'bg-red-600'
  },
  {
    id: 'refresher',
    label: 'Mojitos & Coolers',
    icon: '🍹',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=150&q=80',
    badge: 'Chilled',
    badgeColor: 'bg-teal-500'
  },
  {
    id: 'coffee',
    label: 'Brewed Coffee',
    icon: '☕',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=150&q=80',
    badge: 'Hot & Cold',
    badgeColor: 'bg-amber-700'
  }
];

export const CategoryRail: React.FC<CategoryRailProps> = ({
  activeSubcategory,
  onSelectSubcategory,
  onOpenLuckyModal,
  onSelectDeals
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white border-y border-slate-200/80 shadow-2xs py-4 px-4 sm:px-6 lg:px-8 relative select-none">
      <div className="max-w-7xl mx-auto relative group">
        
        {/* Left Scroll Trigger */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 hover:text-orange-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden sm:flex cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-1 px-1 scroll-smooth"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = activeSubcategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'deals') {
                    onOpenLuckyModal();
                  } else {
                    onSelectSubcategory(cat.id as SubCategoryType);
                  }
                }}
                className="flex flex-col items-center gap-1.5 shrink-0 group/item cursor-pointer focus:outline-none"
              >
                {/* Circular Product Thumbnail */}
                <div className="relative">
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden transition-all duration-300 p-0.5 ${
                      isSelected
                        ? 'ring-3 ring-orange-500 shadow-md scale-105 bg-gradient-to-tr from-orange-500 to-amber-400'
                        : 'border border-slate-200 hover:border-orange-300 hover:shadow-sm group-hover/item:scale-105 bg-slate-100'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover rounded-[14px]"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>

                  {/* Badge */}
                  {cat.badge && (
                    <span
                      className={`absolute -top-1.5 -right-1.5 text-[9px] font-black text-white px-1.5 py-0.2 rounded-full shadow-xs whitespace-nowrap ${
                        cat.badgeColor || 'bg-orange-500'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-bold text-center whitespace-nowrap transition-colors ${
                    isSelected ? 'text-orange-600 font-black' : 'text-slate-700 group-hover/item:text-orange-500'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Scroll Trigger */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 hover:text-orange-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden sm:flex cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
