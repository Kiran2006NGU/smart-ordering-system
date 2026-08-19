import React, { useState } from 'react';
import { 
  Sparkles, 
  ChefHat,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { RestaurantInfo } from '../types';

interface FloatingRobotAIBotProps {
  onOpenAiAssistant: () => void;
  restaurantInfo: RestaurantInfo;
  menuItemsCount: number;
  couponsCount: number;
  cartCount: number;
  onVoiceClick?: () => void;
}

export const FloatingRobotAIBot: React.FC<FloatingRobotAIBotProps> = ({
  onOpenAiAssistant,
  restaurantInfo,
  couponsCount
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <aside
      id="stationary-robot-ai-bot"
      aria-label="Chef Frosty Robot AI Menu Assistant"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 select-none"
    >
      <div 
        className="relative flex flex-col items-center group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onOpenAiAssistant}
      >
        {/* Floating Interactive Speech Bubble - ONLY VISIBLE ON HOVER */}
        {isHovered && (
          <div className="absolute bottom-full mb-3 right-0 w-64 sm:w-72 bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-amber-400/50 backdrop-blur-md text-xs animate-fadeIn transition-all z-50">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-amber-300 text-[11px] flex items-center gap-1">
                  <span>Chef Frosty Robot AI</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200 border border-amber-400/30">
                    Live Grounded
                  </span>
                </p>
                <p className="text-[11px] sm:text-xs leading-snug text-slate-200 mt-0.5">
                  Click me to get real-time recommendations for {restaurantInfo.name}, check active coupons, or ask about dish pairings!
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-amber-400 font-extrabold flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>Ask me anything</span>
                <ChevronRight className="w-3 h-3" />
              </span>
              <span className="text-slate-400">
                {couponsCount || 4} Deals Available
              </span>
            </div>

            {/* Bubble arrow pointing down towards robot */}
            <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-slate-900 border-b border-r border-amber-400/50 rotate-45" />
          </div>
        )}

        {/* The Articulated Robot Character with Head, Torso, Hands, and Legs */}
        <div 
          className="relative transition-all duration-300 group-hover:scale-105"
          title="Click to Open Site-Grounded Chef Frosty AI"
        >
          {/* Ambient Glow Aura */}
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/25 via-cyan-500/25 to-purple-500/25 rounded-3xl blur-md group-hover:blur-lg animate-pulse pointer-events-none" />

          {/* Complete Animated Robot Assembly (Floating / Stepping In Place) */}
          <div className="relative flex flex-col items-center animate-robot-hover">
            
            {/* 1. ROBOT HEAD */}
            <div className="relative flex flex-col items-center z-20">
              
              {/* Antenna with Pulsing Beacon LED */}
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-ping" />
                <div className="w-0.5 h-2 bg-amber-400" />
              </div>

              {/* Head Chassis & Visor */}
              <div className="w-12 h-9 sm:w-14 sm:h-10 bg-gradient-to-b from-slate-800 via-slate-900 to-indigo-950 rounded-2xl border-2 border-amber-400/90 shadow-xl flex items-center justify-center p-1 relative overflow-hidden">
                
                {/* Cybernetic Visor Screen */}
                <div className="w-full h-full bg-slate-950 rounded-xl border border-cyan-400/60 flex items-center justify-center relative overflow-hidden shadow-inner">
                  {/* Digital Scanline */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent animate-pulse pointer-events-none" />
                  
                  {/* Expressive Glowing Robot Eyes */}
                  <div className="flex items-center gap-2 z-10">
                    <div className="w-2 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                    <div className="w-2 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                  </div>
                </div>

                {/* Ear Sensor Bolts */}
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-amber-400 rounded-l-xs" />
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-amber-400 rounded-r-xs" />
              </div>

            </div>

            {/* 2. ROBOT TORSO WITH ARMS & HANDS */}
            <div className="relative flex items-center justify-center mt-[-2px] z-10">
              
              {/* LEFT ARM & HAND (Steadies / Balances) */}
              <div className="animate-robot-arm-left flex flex-col items-center mr-[-4px]">
                {/* Shoulder joint */}
                <div className="w-2 h-2 rounded-full bg-amber-400 border border-slate-900" />
                {/* Arm limb */}
                <div className="w-1.5 h-4 bg-slate-700 rounded-full border border-slate-600" />
                {/* Hand / Claw */}
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900 shadow-xs flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-slate-900" />
                </div>
              </div>

              {/* MAIN BODY CHASSIS */}
              <div className="w-11 h-10 sm:w-13 sm:h-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border-2 border-amber-400/90 shadow-xl flex flex-col items-center justify-between p-1 relative">
                {/* Power Core Reactor */}
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center mt-0.5 shadow-[0_0_6px_#22d3ee]">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
                </div>

                {/* Chef / Assistant Emblem */}
                <div className="flex items-center gap-0.5 mb-0.5">
                  <ChefHat className="w-2.5 h-2.5 text-amber-300" />
                  <span className="text-[7px] font-black text-amber-300 tracking-tighter">AI</span>
                </div>
              </div>

              {/* RIGHT ARM & HAND (Waves Friendly Greeting!) */}
              <div className="animate-robot-wave flex flex-col items-center ml-[-4px]">
                {/* Shoulder joint */}
                <div className="w-2 h-2 rounded-full bg-amber-400 border border-slate-900" />
                {/* Arm limb */}
                <div className="w-1.5 h-4 bg-slate-700 rounded-full border border-slate-600" />
                {/* Hand / Claw (Waving) */}
                <div className="w-3 h-3 rounded-full bg-amber-400 border border-slate-900 shadow-xs flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-slate-900" />
                </div>
              </div>

            </div>

            {/* 3. ROBOT LEGS & FEET (Stepping in Place!) */}
            <div className="flex items-center gap-2 mt-[-3px] z-0">
              
              {/* LEFT LEG & FOOT */}
              <div className="animate-robot-step-l flex flex-col items-center">
                {/* Hip / Thigh */}
                <div className="w-1.5 h-3 bg-slate-700 rounded-xs" />
                {/* Knee Joint */}
                <div className="w-2 h-1.5 rounded-full bg-amber-400" />
                {/* Mechanical Shoe / Foot */}
                <div className="w-3.5 h-2 bg-gradient-to-r from-slate-900 to-amber-500 rounded-b-md border border-amber-400 shadow-xs" />
              </div>

              {/* RIGHT LEG & FOOT */}
              <div className="animate-robot-step-r flex flex-col items-center">
                {/* Hip / Thigh */}
                <div className="w-1.5 h-3 bg-slate-700 rounded-xs" />
                {/* Knee Joint */}
                <div className="w-2 h-1.5 rounded-full bg-amber-400" />
                {/* Mechanical Shoe / Foot */}
                <div className="w-3.5 h-2 bg-gradient-to-r from-slate-900 to-amber-500 rounded-b-md border border-amber-400 shadow-xs" />
              </div>

            </div>

            {/* Under-foot Shadow */}
            <div className="w-8 h-1.5 bg-slate-950/30 rounded-full blur-[1px] mt-0.5" />

          </div>

          {/* Status Online Pill */}
          <div className="absolute -top-1 -right-1 flex items-center justify-center">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 text-[7px] text-slate-950 font-bold items-center justify-center border border-white">
                ✓
              </span>
            </span>
          </div>

          {/* Quick Helper Label below robot */}
          <div className="mt-1 flex items-center justify-center">
            <span className="text-[10px] font-black bg-slate-900/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40 shadow-md whitespace-nowrap">
              Chef Frosty
            </span>
          </div>

        </div>

      </div>
    </aside>
  );
};
