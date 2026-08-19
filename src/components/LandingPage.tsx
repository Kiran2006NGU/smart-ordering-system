import React, { useState } from 'react';
import {
  Sparkles,
  ChefHat,
  BarChart3,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Star,
  UtensilsCrossed,
  Smartphone,
  Bot,
  Gift,
  Store,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  isLoading?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  isLoading
}) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Store className="w-7 h-7" />,
      title: 'Your Own Branded Store',
      description: 'Get a unique public link for your restaurant. Customers order directly from your page.',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      icon: <UtensilsCrossed className="w-7 h-7" />,
      title: 'Dynamic Menu Builder',
      description: 'Add, edit, reorder menu items with photos, pricing, categories & customizations.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: 'Live Orders & Analytics',
      description: 'Real-time kitchen order tracking, sales analytics, and revenue dashboards.',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Bot className="w-7 h-7" />,
      title: 'AI Chef Assistant',
      description: 'Gemini-powered AI bot that recommends dishes, explains menu, and helps customers.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Gift className="w-7 h-7" />,
      title: 'Lucky Coupon Wheel',
      description: 'Gamified discount engine — spin-to-win coupons that boost engagement & sales.',
      gradient: 'from-rose-500 to-red-500'
    },
    {
      icon: <Smartphone className="w-7 h-7" />,
      title: 'Mobile-First Design',
      description: 'Fully responsive. Your customers can order from any device, anywhere.',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ];

  const stats = [
    { value: '60s', label: 'Setup Time' },
    { value: '∞', label: 'Menu Items' },
    { value: '₹0', label: 'Forever Free' },
    { value: '24/7', label: 'AI Powered' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Smart<span className="text-orange-400">Dine</span>
          </span>
        </div>
        <button
          onClick={onSignIn}
          className="px-5 py-2.5 text-sm font-semibold text-white/90 hover:text-white border border-white/20 hover:border-orange-400/50 rounded-xl transition-all duration-300 hover:bg-white/5 cursor-pointer"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 text-sm">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-white/70">Powered by Google Gemini AI</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
          Launch Your Restaurant
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
            Online in 60 Seconds
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          The all-in-one smart ordering platform. Create your branded menu, 
          accept orders, track analytics — no coding, no fees. Just sign up and start serving.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onGetStarted}
            disabled={isLoading}
            className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-2xl text-lg font-bold shadow-xl shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/40 flex items-center gap-3 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onSignIn}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 rounded-2xl text-lg font-semibold transition-all duration-300 cursor-pointer"
          >
            I already have an account
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-orange-400">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
          How It Works
        </h2>
        <p className="text-white/50 text-center mb-14 text-lg">Three simple steps to digitize your restaurant</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Sign Up Free',
              desc: 'Create your account with Google or email in seconds.',
              icon: <ShieldCheck className="w-8 h-8" />,
              color: 'orange'
            },
            {
              step: '02',
              title: 'Set Up Your Menu',
              desc: 'Name your restaurant, add your dishes with photos & prices.',
              icon: <ChefHat className="w-8 h-8" />,
              color: 'emerald'
            },
            {
              step: '03',
              title: 'Share & Start Serving',
              desc: 'Share your unique link. Customers order, you manage everything.',
              icon: <Globe className="w-8 h-8" />,
              color: 'blue'
            }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 hover:bg-white/[0.05]">
                <div className="text-6xl font-black text-white/[0.06] absolute top-4 right-6">{item.step}</div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/10 flex items-center justify-center mb-5 text-${item.color}-400`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-white/20">
                  <ArrowRight className="w-8 h-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
          Everything You Need
        </h2>
        <p className="text-white/50 text-center mb-14 text-lg">Powerful tools built for modern restaurants</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group bg-white/[0.03] border border-white/10 rounded-3xl p-7 hover:border-white/20 transition-all duration-500 hover:bg-white/[0.05] hover:scale-[1.02]"
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 ${hoveredFeature === i ? 'scale-110' : ''}`}
                style={{ width: 52, height: 52 }}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/10 rounded-3xl p-10 sm:p-14">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-xl sm:text-2xl font-medium text-white/80 mb-6 leading-relaxed italic">
            "We set up our entire restaurant menu in under 5 minutes. Our customers love ordering online now. The AI assistant is brilliant!"
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-sm font-bold">
              RK
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Rahul Kumar</div>
              <div className="text-white/40 text-xs">Owner, Spice Kitchen Delhi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-black mb-6">
          Ready to Go
          <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"> Digital</span>?
        </h2>
        <p className="text-white/50 text-lg mb-8">
          Join hundreds of restaurant owners already using SmartDine. It's free, forever.
        </p>
        <button
          onClick={onGetStarted}
          disabled={isLoading}
          className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-2xl text-xl font-bold shadow-2xl shadow-orange-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto disabled:opacity-60 cursor-pointer"
        >
          <Zap className="w-6 h-6" />
          Create Your Restaurant — Free
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
          <ChefHat className="w-4 h-4" />
          <span>SmartDine — Built with ❤️ and Gemini AI</span>
        </div>
      </footer>
    </div>
  );
};
