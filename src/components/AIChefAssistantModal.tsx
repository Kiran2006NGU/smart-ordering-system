import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ChefHat, 
  Bot, 
  User, 
  Loader2, 
  Utensils, 
  Plus 
} from 'lucide-react';
import { CartItem, MenuItem, RestaurantInfo, LuckyCoupon } from '../types';

interface AIChefAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  customerName: string;
  restaurantInfo: RestaurantInfo;
  menuItems?: MenuItem[];
  coupons?: LuckyCoupon[];
  onAddItemByName: (itemName: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestedItems?: string[];
}

export const AIChefAssistantModal: React.FC<AIChefAssistantModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  customerName,
  restaurantInfo,
  menuItems = [],
  coupons = [],
  onAddItemByName
}) => {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hey ${customerName || 'there'}! I'm Chef Frosty, your virtual culinary assistant at ${restaurantInfo.name}. Ask me anything about our dishes, drink pairings, spicy or veg options, live coupons, or timings!`
    }
  ]);

  const quickPrompts = [
    "What shake pairs best with Margherita Pizza?",
    "Suggest a delicious meal under Rs. 250",
    "What are today's best coupon discounts?",
    "What are your opening hours and delivery fees?"
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          prompt: textToSend,
          restaurantInfo,
          menuCatalog: menuItems,
          coupons,
          cartItems: cartItems.map(i => ({ name: i.menuItem.name, quantity: i.quantity })),
          customerName: customerName || 'Foodie',
          conversationHistory: messages.map(m => ({ sender: m.role, text: m.content }))
        })
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || data.recommendation || "Our Chef recommends pairing any hot QuickBite with an icy cold Mojito or signature Chocolate Shake!",
        suggestedItems: data.suggestedItems
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I recommend pairing your order with our signature Chocolate Thick Shake and Crispy Cheese Balls for the ultimate dining experience!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        id="ai-chef-modal"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-indigo-100 flex flex-col h-[560px] max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 backdrop-blur-md flex items-center justify-center border-2 border-amber-400/80 shadow-md relative">
              <Bot className="w-6 h-6 text-amber-300 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 absolute -top-0.5 -right-0.5 shadow-[0_0_6px_#22d3ee]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>Chef Frosty Robot AI</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40 font-black">
                    Live Grounded
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-300">Live Menu Recommendations, Timing &amp; Deals Assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 border border-amber-400/50 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>

                {msg.suggestedItems && msg.suggestedItems.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {msg.suggestedItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => onAddItemByName(item)}
                        className="text-[11px] font-bold px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add {item}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs italic">
              <div className="w-7 h-7 rounded-xl bg-indigo-600/20 text-indigo-600 flex items-center justify-center">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>Chef Frosty is finding the best menu recommendations...</span>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Chef Frosty for recommendations, prices, coupons..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
