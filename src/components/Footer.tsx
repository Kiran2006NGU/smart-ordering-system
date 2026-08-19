import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  ShieldCheck, 
  Volume2,
  Clock,
  Shield
} from 'lucide-react';
import { RestaurantInfo } from '../types';

interface FooterProps {
  restaurantInfo: RestaurantInfo;
  onOpenLuckyModal: () => void;
  onExploreMenu: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  restaurantInfo, 
  onOpenLuckyModal, 
  onExploreMenu,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Origin */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white font-black text-xs">
                {restaurantInfo.logoText || (restaurantInfo.name ? restaurantInfo.name.substring(0, 2).toUpperCase() : 'APP')}
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                {restaurantInfo.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {restaurantInfo.tagline}. Handcrafted thickshakes, stone-baked pizzas, smash burgers, and delicious treats.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flat {restaurantInfo.gstPercentage}% GST on All Menu Items</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Explore Menu</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={onExploreMenu} className="hover:text-white transition-colors cursor-pointer">
                  Food Menu (Pizzas, Burgers, Pastas, Wraps)
                </button>
              </li>
              <li>
                <button onClick={onExploreMenu} className="hover:text-white transition-colors cursor-pointer">
                  Signature Thickshakes &amp; Cold Brews
                </button>
              </li>
              <li>
                <button onClick={onExploreMenu} className="hover:text-white transition-colors cursor-pointer">
                  Crispy Finger Snacks &amp; Fries
                </button>
              </li>
              <li>
                <button onClick={onOpenLuckyModal} className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer">
                  <span>🎁 Spin Lucky Draw (101E - 105E)</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin &amp; Store CMS Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Outlet Info */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Dine-In Outlets</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{restaurantInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{restaurantInfo.timings}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hotline: {restaurantInfo.hotline}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Email: {restaurantInfo.email}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality Commitment */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{restaurantInfo.name} Quality Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              100% Pure Vegetarian options, fresh dairy ice creams, sanitized wood-fired ovens, and transparent GST billing with every order.
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {restaurantInfo.name}. Inspired by original C++ terminal architecture.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Foodies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
