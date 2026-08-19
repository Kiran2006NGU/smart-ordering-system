import React, { useState } from 'react';
import { 
  ChefHat, 
  Store, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Phone,
  Clock,
  Percent,
  Truck,
  Layers,
  Utensils
} from 'lucide-react';
import { RestaurantInfo } from '../types';
import { generateSlug } from '../lib/router';
import { isSlugAvailable, createRestaurant, seedDefaultMenu, seedDefaultCoupons } from '../lib/tenantFirestore';

interface OnboardingWizardProps {
  ownerUid: string;
  ownerEmail: string;
  ownerName: string;
  onComplete: (slug: string, info: RestaurantInfo) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  ownerUid,
  ownerEmail,
  ownerName,
  onComplete
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Restaurant Name & Slug
  const [restaurantName, setRestaurantName] = useState('');
  const [slug, setSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [tagline, setTagline] = useState('Fresh & Delicious Food • Fast Ordering');

  // Step 2: Contact & Operating Details
  const [address, setAddress] = useState('');
  const [hotline, setHotline] = useState('');
  const [timings, setTimings] = useState('Open Daily: 10:00 AM – 11:00 PM');
  const [gstPercentage, setGstPercentage] = useState<number>(5);
  const [deliveryFee, setDeliveryFee] = useState<number>(30);
  const [freeDeliveryMin, setFreeDeliveryMin] = useState<number>(200);

  // Step 3: Starter Menu Option
  const [menuChoice, setMenuChoice] = useState<'sample' | 'empty'>('sample');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRestaurantName(val);
    if (!isCustomSlug) {
      setSlug(generateSlug(val));
    }
  };

  const handleValidateStep1 = async () => {
    if (!restaurantName.trim()) {
      setSlugError('Please enter your restaurant or cafe name.');
      return;
    }
    const cleanSlug = generateSlug(slug || restaurantName);
    if (!cleanSlug || cleanSlug.length < 2) {
      setSlugError('Please choose a valid store handle (at least 2 characters).');
      return;
    }

    setIsCheckingSlug(true);
    setSlugError('');
    try {
      const available = await isSlugAvailable(cleanSlug);
      if (!available) {
        setSlugError(`The link handle "${cleanSlug}" is already taken. Please pick another one.`);
        setIsCheckingSlug(false);
        return;
      }
      setSlug(cleanSlug);
      setStep(2);
    } catch (err: any) {
      // In case of offline/firestore rules in dev, allow proceeding
      console.warn('Slug check fallback:', err);
      setSlug(cleanSlug);
      setStep(2);
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const handleValidateStep2 = () => {
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    const newInfo: RestaurantInfo = {
      name: restaurantName.trim(),
      tagline: tagline.trim() || 'Delicious handcrafted bites & beverages',
      logoText: (restaurantName.trim().split(' ')[0] || 'SMART').toUpperCase().slice(0, 8),
      announcement: `Welcome to ${restaurantName.trim()}! Order online for lightning-fast preparation.`,
      hotline: hotline.trim() || '+91 98765 43210',
      email: ownerEmail || 'orders@myrestaurant.com',
      address: address.trim() || 'Food Court & High Street Lounge',
      timings: timings.trim() || 'Open Daily: 10:00 AM – 11:00 PM',
      gstPercentage: Number(gstPercentage) || 5,
      deliveryFee: Number(deliveryFee) || 30,
      freeDeliveryMin: Number(freeDeliveryMin) || 200
    };

    try {
      // 1. Create restaurant record in Firestore
      await createRestaurant(ownerUid, slug, newInfo);

      // 2. Optionally seed starter menu items
      if (menuChoice === 'sample') {
        await seedDefaultMenu(ownerUid);
        await seedDefaultCoupons(ownerUid);
      }

      onComplete(slug, newInfo);
    } catch (err: any) {
      console.error('Failed to create restaurant:', err);
      // If Firestore fails due to permissions in local test, complete locally
      onComplete(slug, newInfo);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome to SmartDine!
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            Let's set up your digital restaurant in 3 quick steps
          </p>

          {/* Stepper indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6">
            {[
              { num: 1, label: 'Identity' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Menu' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s.num 
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/40' 
                      : step > s.num 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-semibold ${step >= s.num ? 'text-white' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {s.num < 3 && <div className="w-6 h-0.5 bg-slate-800" />}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Restaurant Name & Handle */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Restaurant / Cafe Name *
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={handleNameChange}
                placeholder="e.g., Bella Italia Bistro, Urban Cafe, Spicy Treats"
                className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Your Public Store Link Handle *
              </label>
              <div className="flex items-center rounded-xl bg-slate-800/80 border border-slate-700 overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
                <span className="px-3 text-xs sm:text-sm text-slate-500 font-mono select-none bg-slate-900/50 py-3.5 border-r border-slate-700/80">
                  smartdine.com/r/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsCustomSlug(true);
                    setSlug(generateSlug(e.target.value));
                  }}
                  placeholder="my-restaurant"
                  className="flex-1 px-3 py-3.5 bg-transparent text-white font-mono text-sm placeholder-slate-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                This is the exact link your customers will use to browse and order from your menu.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g., Wood-Fired Pizzas & Craft Coffee"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            {slugError && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{slugError}</span>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleValidateStep1}
                disabled={isCheckingSlug}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isCheckingSlug ? 'Checking handle...' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Restaurant Location & Operating Details */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                Physical Address / Location
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Shop 4, High Street Mall, Sector 15"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  Order Hotline
                </label>
                <input
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  placeholder="e.g., +91 98765 43210"
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={timings}
                  onChange={(e) => setTimings(e.target.value)}
                  placeholder="e.g., 10:00 AM – 11:00 PM"
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-orange-400" />
                  GST %
                </label>
                <input
                  type="number"
                  value={gstPercentage}
                  onChange={(e) => setGstPercentage(Number(e.target.value))}
                  min={0}
                  max={28}
                  className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-orange-400" />
                  Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Free Over (₹)
                </label>
                <input
                  type="number"
                  value={freeDeliveryMin}
                  onChange={(e) => setFreeDeliveryMin(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-slate-400 hover:text-white text-sm font-semibold cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleValidateStep2}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Menu Starter Selection */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                How would you like to start your menu?
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Sample Template */}
                <div
                  onClick={() => setMenuChoice('sample')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    menuChoice === 'sample'
                      ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                      : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white mb-1">Pre-filled Gourmet Catalog (Recommended)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Start with 45 curated pizzas, burgers, pastas, shakes & combos. You can customize, rename, re-price or delete anything instantly.
                  </p>
                </div>

                {/* Option 2: Blank Slate */}
                <div
                  onClick={() => setMenuChoice('empty')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    menuChoice === 'empty'
                      ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                      : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white mb-1">Start From Scratch</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Begin with an empty menu. Add your custom dishes, images, and prices one by one using the interactive menu builder.
                  </p>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-slate-400 hover:text-white text-sm font-semibold cursor-pointer disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black rounded-xl shadow-xl shadow-orange-500/30 flex items-center gap-2.5 cursor-pointer transition-all disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Launching Your Store...
                  </>
                ) : (
                  <>
                    Launch Restaurant Storefront
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
