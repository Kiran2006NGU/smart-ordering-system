import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Layers, 
  Flame, 
  Star,
  Check
} from 'lucide-react';
import { MenuItem, RestaurantInfo } from '../types';

interface CombosSectionProps {
  combos: MenuItem[];
  allItems: MenuItem[];
  restaurantInfo?: RestaurantInfo;
  onAddToCart: (item: MenuItem) => void;
  onAddCustomCombo: (customComboItem: MenuItem) => void;
}

export const CombosSection: React.FC<CombosSectionProps> = ({
  combos,
  allItems,
  restaurantInfo,
  onAddToCart,
  onAddCustomCombo
}) => {
  // Custom Combo Builder state
  const foodOptions = allItems.filter(i => i.category === 'food');
  const drinkOptions = allItems.filter(i => i.category === 'drink');
  const snackOptions = allItems.filter(i => i.category === 'snack');

  const [selectedFood, setSelectedFood] = useState<MenuItem>(foodOptions[0] || allItems[0]);
  const [selectedDrink, setSelectedDrink] = useState<MenuItem>(drinkOptions[0] || allItems[1]);
  const [selectedSnack, setSelectedSnack] = useState<MenuItem>(snackOptions[0] || allItems[2]);

  // Calculate bundle price with 15% bundle discount
  const originalBundleTotal = (selectedFood?.price || 0) + (selectedDrink?.price || 0) + (selectedSnack?.price || 0);
  const discountedBundlePrice = Math.round(originalBundleTotal * 0.85);
  const savings = originalBundleTotal - discountedBundlePrice;

  const handleAddCustomBundle = () => {
    const customBundle: MenuItem = {
      id: `custom-combo-${Date.now()}`,
      name: `Custom Trio: ${selectedFood.name} + ${selectedDrink.name} + ${selectedSnack.name}`,
      category: 'combo',
      price: discountedBundlePrice,
      originalPrice: originalBundleTotal,
      description: `Custom bundle comprising ${selectedFood.name}, ${selectedDrink.name}, and ${selectedSnack.name}. Special 15% Bundle Discount applied!`,
      image: selectedFood.image,
      rating: 5.0,
      reviewsCount: 1,
      isVeg: selectedFood.isVeg && selectedDrink.isVeg && selectedSnack.isVeg,
      isChefSpecial: true,
      comboIncludes: [selectedFood.name, selectedDrink.name, selectedSnack.name],
      tags: ['Custom Combo', '15% Bundle Off']
    };

    onAddCustomCombo(customBundle);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Mega Value Combinations</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Feast Combos &amp; Platters
        </h2>
        <p className="text-slate-600 text-sm">
          Save big with our pre-curated chef platters or assemble your very own custom trio with a guaranteed 15% discount!
        </p>
      </div>

      {/* Pre-set Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {combos.map((combo, idx) => (
          <div
            key={combo.id}
            id={`combo-card-${combo.id}`}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
          >
            {/* Combo Image */}
            <div className="sm:w-2/5 relative h-56 sm:h-auto overflow-hidden bg-slate-100 shrink-0">
              <img
                src={combo.image}
                alt={combo.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                Combo #{idx + 1}
              </div>
              {combo.originalPrice && (
                <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                  Save Rs. {combo.originalPrice - combo.price}
                </div>
              )}
            </div>

            {/* Combo Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                    {combo.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-lg border border-amber-200 text-xs font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{combo.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {combo.description}
                </p>

                {/* Items included pill list */}
                {combo.comboIncludes && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      What's in the box:
                    </p>
                    <div className="space-y-1">
                      {combo.comboIncludes.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      Rs. {combo.price}
                    </span>
                    {combo.originalPrice && (
                      <span className="text-xs text-slate-400 line-through font-medium">
                        Rs. {combo.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">+{restaurantInfo?.gstPercentage || 5}% GST at bill</span>
                </div>

                <button
                  id={`add-combo-btn-${combo.id}`}
                  onClick={() => onAddToCart(combo)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-orange-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Platter</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Custom Combo Builder */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-slate-700 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Interactive Builder</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Build Your Own 3-Course Combo
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-lg mt-1">
                Pick 1 Food item, 1 Shake/Drink, and 1 Crispy Snack. Unlock automatic 15% bundle savings!
              </p>
            </div>

            {/* Savings preview widget */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4">
              <div>
                <p className="text-[11px] text-slate-300 uppercase font-semibold">Trio Combo Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-300">Rs. {discountedBundlePrice}</span>
                  <span className="text-xs text-slate-400 line-through">Rs. {originalBundleTotal}</span>
                </div>
              </div>
              <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black px-2.5 py-1.5 rounded-xl">
                Save Rs. {savings} (15% OFF)
              </div>
            </div>
          </div>

          {/* 3 Step Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Main Food */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  Step 1: Pick 1 Main Food
                </span>
                <span className="text-xs font-extrabold text-slate-300">
                  Rs.{selectedFood?.price}
                </span>
              </div>
              <select
                id="custom-food-select"
                value={selectedFood?.id}
                onChange={(e) => {
                  const item = foodOptions.find(f => f.id === e.target.value);
                  if (item) setSelectedFood(item);
                }}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {foodOptions.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} (Rs.{f.price})
                  </option>
                ))}
              </select>
              {selectedFood && (
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={selectedFood.image}
                    alt={selectedFood.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-xs text-slate-300 line-clamp-2">{selectedFood.description}</p>
                </div>
              )}
            </div>

            {/* 2. Shake / Drink */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Step 2: Pick 1 Shake / Drink
                </span>
                <span className="text-xs font-extrabold text-slate-300">
                  Rs.{selectedDrink?.price}
                </span>
              </div>
              <select
                id="custom-drink-select"
                value={selectedDrink?.id}
                onChange={(e) => {
                  const item = drinkOptions.find(d => d.id === e.target.value);
                  if (item) setSelectedDrink(item);
                }}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {drinkOptions.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} (Rs.{d.price})
                  </option>
                ))}
              </select>
              {selectedDrink && (
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={selectedDrink.image}
                    alt={selectedDrink.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-xs text-slate-300 line-clamp-2">{selectedDrink.description}</p>
                </div>
              )}
            </div>

            {/* 3. Crispy Snack */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                  Step 3: Pick 1 Snack
                </span>
                <span className="text-xs font-extrabold text-slate-300">
                  Rs.{selectedSnack?.price}
                </span>
              </div>
              <select
                id="custom-snack-select"
                value={selectedSnack?.id}
                onChange={(e) => {
                  const item = snackOptions.find(s => s.id === e.target.value);
                  if (item) setSelectedSnack(item);
                }}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {snackOptions.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Rs.{s.price})
                  </option>
                ))}
              </select>
              {selectedSnack && (
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={selectedSnack.image}
                    alt={selectedSnack.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-xs text-slate-300 line-clamp-2">{selectedSnack.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700">
            <div className="text-xs text-slate-300">
              Selected: <strong className="text-white">{selectedFood?.name}</strong> +{' '}
              <strong className="text-white">{selectedDrink?.name}</strong> +{' '}
              <strong className="text-white">{selectedSnack?.name}</strong>
            </div>

            <button
              id="add-custom-trio-btn"
              onClick={handleAddCustomBundle}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-sm shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Add Custom Trio to Cart (Rs. {discountedBundlePrice})</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
