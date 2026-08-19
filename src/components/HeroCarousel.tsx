import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Star, 
  Gift,
  Zap
} from 'lucide-react';
import { RestaurantInfo } from '../types';

interface HeroCarouselProps {
  onExploreMenu: () => void;
  onOpenLuckyModal: () => void;
  onOpenCombos: () => void;
  restaurantInfo: RestaurantInfo;
  customerName?: string;
}

interface BannerSlide {
  id: string;
  tag: string;
  tagColor: string;
  headline: string;
  subheadline: string;
  highlightText: string;
  ctaText: string;
  ctaAction: 'menu' | 'lucky' | 'combos';
  badge: string;
  image: string;
  accentGradient: string;
}

const SLIDES: BannerSlide[] = [
  {
    id: 'pizza-special',
    tag: 'CHEF SIGNATURE SELECTION',
    tagColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    headline: 'Handcrafted Wood-Fired',
    highlightText: 'Artisan Pizzas',
    subheadline: 'Crafted with 48-hr slow fermented dough, San Marzano tomato glaze & fresh creamy burrata.',
    ctaText: 'Order Pizzas Now',
    ctaAction: 'menu',
    badge: '4.9 ★ (2.4k+ Reviews)',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    accentGradient: 'from-amber-600/30 via-orange-600/20 to-red-600/30'
  },
  {
    id: 'shake-special',
    tag: 'FROZEN DESSERT HEAVEN',
    tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    headline: 'Belgian Dark Chocolate',
    highlightText: 'Thick Shakes',
    subheadline: 'Blended with rich whole milk, premium Belgian cocoa, crushed cookies & whipped cream peak.',
    ctaText: 'Explore Shakes & Coolers',
    ctaAction: 'menu',
    badge: 'Pure Indulgence',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    accentGradient: 'from-cyan-600/30 via-indigo-600/20 to-purple-600/30'
  },
  {
    id: 'combo-fest',
    tag: 'SUPER SAVER MEALS',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    headline: 'Feast Mega Combos',
    highlightText: 'Save Flat 35%',
    subheadline: 'Pair your favorite burgers, crispy golden fries and refreshing cold beverages for unbeatable value.',
    ctaText: 'View Mega Combos',
    ctaAction: 'combos',
    badge: 'From ₹190 only',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    accentGradient: 'from-emerald-600/30 via-teal-600/20 to-lime-600/30'
  },
  {
    id: 'lucky-wheel',
    tag: 'DAILY GAMIFIED REWARDS',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    headline: 'Spin & Scratch Wheel',
    highlightText: 'Win Up to 43% OFF',
    subheadline: 'Unlock instant surprise coupon codes on your order total with our interactive lucky draw wheel!',
    ctaText: 'Spin Lucky Wheel',
    ctaAction: 'lucky',
    badge: 'Guaranteed Prize',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    accentGradient: 'from-purple-600/30 via-pink-600/20 to-amber-600/30'
  }
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onExploreMenu,
  onOpenLuckyModal,
  onOpenCombos,
  restaurantInfo,
  customerName
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const slide = SLIDES[currentSlide];

  const handleAction = (action: 'menu' | 'lucky' | 'combos') => {
    if (action === 'lucky') onOpenLuckyModal();
    else if (action === 'combos') onOpenCombos();
    else onExploreMenu();
  };

  return (
    <section 
      className="mx-4 sm:mx-6 lg:mx-8 my-5 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl border border-slate-800">
        
        {/* Dynamic Background Ambient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentGradient} transition-all duration-700 pointer-events-none`} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-8 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Text & Content Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            {/* Tag Badge */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border backdrop-blur-md ${slide.tagColor}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{slide.tag}</span>
              </span>
              <span className="text-[11px] text-amber-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full">
                {slide.badge}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                {slide.headline} <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  {slide.highlightText}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed pt-1">
                {slide.subheadline}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleAction(slide.ctaAction)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-orange-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenLuckyModal}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Spin Lucky Draw</span>
              </button>
            </div>

            {/* Quick Micro Value Props */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> 15-20 min live dispatch
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" /> 4.8+ Store Rating
              </span>
              <span>•</span>
              <span>Free delivery on ₹200+</span>
            </div>

          </div>

          {/* Image Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl group/img">
              <img
                src={slide.image}
                alt={slide.headline}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-amber-300 font-bold uppercase">{restaurantInfo.name}</span>
                  <p className="font-bold text-white line-clamp-1">{slide.highlightText}</p>
                </div>
                <button
                  onClick={() => handleAction(slide.ctaAction)}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-xl font-bold text-[11px] hover:bg-orange-600 cursor-pointer"
                >
                  Order
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === i ? 'w-6 bg-orange-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
