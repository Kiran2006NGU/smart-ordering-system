import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Smart Restaurant Ordering System API',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString() 
  });
});

// Primary AI Assistant & Smart Menu Concierge Endpoint
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { 
      message, 
      prompt,
      cartItems = [], 
      customerName = 'Guest',
      restaurantInfo = {},
      menuCatalog = [],
      coupons = [],
      conversationHistory = []
    } = req.body;

    const userQuery = message || prompt || 'Tell me about the menu recommendations';
    const restaurantName = restaurantInfo.name || 'Smart Restaurant';
    const timings = restaurantInfo.timings || '11:00 AM - 11:30 PM';
    const address = restaurantInfo.address || 'Gourmet Food Street';
    const hotline = restaurantInfo.hotline || '+91 98765 43210';
    const deliveryFee = restaurantInfo.deliveryFee ?? 30;
    const gst = restaurantInfo.gstPercentage ?? 5;

    // Prepare compact catalog summary for AI grounding
    const menuSummary = Array.isArray(menuCatalog) && menuCatalog.length > 0
      ? menuCatalog.map((item: any) => 
          `- [${item.id}] ${item.name} (Rs.${item.price}): ${item.description || ''} | Category: ${item.category} / ${item.subcategory || ''} | Veg: ${item.isVeg ? 'Yes' : 'No'} | Rating: ${item.rating || 4.5} | Tags: ${(item.tags || []).join(', ')}`
        ).join('\n')
      : 'Menu catalog unavailable';

    const couponsSummary = Array.isArray(coupons) && coupons.length > 0
      ? coupons.map((c: any) => `- Code: "${c.code}" (${c.discountPercent}% OFF, Min spend: Rs.${c.minOrderValue || 0}): ${c.description || ''}`).join('\n')
      : 'No active coupons';

    const cartSummary = Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems.map((ci: any) => `${ci.menuItem?.name || ci.name} (Qty: ${ci.quantity}, Rs.${ci.totalPrice || ci.unitPrice})`).join(', ')
      : 'Empty';

    const ai = getGeminiClient();

    if (ai) {
      const systemInstruction = `You are the friendly, witty, and knowledgeable AI Culinary Assistant for "${restaurantName}".
Your mission is to help customers explore the menu, suggest food and drink pairings, answer questions about dietary preferences (veg, spicy, sweet, cheesy, gluten-aware), explain active coupon codes, share restaurant timings/delivery policies, and assist with order curation.

CRITICAL GUIDELINES:
1. Always ground your facts in the LIVE RESTAURANT DATA provided below.
2. If asked for item recommendations, name real items from the menu catalog along with their exact prices in Rs.
3. Keep responses warm, appetizing, engaging, and formatted with clean paragraphs or brief bullet points (no walls of text).
4. If a user asks about timings, location, delivery fee, GST or coupons, answer accurately using the store details.
5. If recommending a dish, suggest 1 to 3 top matching dish names.

--- LIVE RESTAURANT DATA ---
Restaurant Name: ${restaurantName}
Tagline/Announcement: ${restaurantInfo.announcement || 'Delicious handcrafted bites & drinks'}
Operating Hours: ${timings}
Location / Address: ${address}
Hotline: ${hotline}
Delivery Fee: Rs.${deliveryFee} (Free over Rs.200)
GST Rate: ${gst}%

--- ACTIVE MENU ITEMS (${Array.isArray(menuCatalog) ? menuCatalog.length : 0} items) ---
${menuSummary}

--- ACTIVE LUCKY COUPONS ---
${couponsSummary}

--- CURRENT CUSTOMER CONTEXT ---
Customer Name: ${customerName}
Current Cart: ${cartSummary}`;

      const chatPrompt = conversationHistory.length > 0
        ? `Conversation History:\n${conversationHistory.map((m: any) => `${m.sender === 'user' ? 'Customer' : 'Assistant'}: ${m.text}`).join('\n')}\n\nCustomer latest query: "${userQuery}"`
        : `Customer ${customerName} asks: "${userQuery}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: chatPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 600,
        }
      });

      const replyText = response.text || `Welcome to ${restaurantName}! I'm here to help you find the tastiest dishes, drinks, and combos.`;

      // Extract matching item names from menu
      const suggestedItemIds: string[] = [];
      if (Array.isArray(menuCatalog)) {
        menuCatalog.forEach((item: any) => {
          if (replyText.toLowerCase().includes(item.name.toLowerCase()) && suggestedItemIds.length < 4) {
            suggestedItemIds.push(item.id);
          }
        });
      }

      return res.json({
        reply: replyText,
        recommendation: replyText,
        suggestedItemIds,
        suggestedItems: suggestedItemIds.length > 0 
          ? menuCatalog.filter((m: any) => suggestedItemIds.includes(m.id)).map((m: any) => m.name)
          : ['Artisan Truffle & Burrata Wood-Fired Pizza', 'Chocolate Thick Shake', 'Crispy Cheese Balls']
      });
    }

    // Intelligent Offline / Dynamic Knowledge Engine Grounding
    const lowerQuery = userQuery.toLowerCase();
    let reply = '';
    let suggested: string[] = [];

    // Dynamically match items from active menu catalog
    const matchingDishes = Array.isArray(menuCatalog) ? menuCatalog.filter((item: any) => {
      const name = (item.name || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const tags = (item.tags || []).map((t: string) => t.toLowerCase());

      if (lowerQuery.includes('veg') && item.isVeg) return true;
      if (lowerQuery.includes('spicy') && tags.some(t => t.includes('spicy') || t.includes('peri'))) return true;
      if (lowerQuery.includes('sweet') || lowerQuery.includes('dessert')) {
        return cat.includes('shake') || cat.includes('dessert') || tags.includes('sweet');
      }

      const queryWords = lowerQuery.split(/\s+/).filter((w: string) => w.length > 2);
      return queryWords.some((w: string) => name.includes(w) || desc.includes(w) || cat.includes(w));
    }) : [];

    if (lowerQuery.includes('timing') || lowerQuery.includes('time') || lowerQuery.includes('open') || lowerQuery.includes('close') || lowerQuery.includes('hour')) {
      reply = `🕒 **${restaurantName} Operating Hours**\nWe are open daily from **${timings}**.\n📍 Located at: ${address}\n📞 Order Hotline: ${hotline}\nOur kitchen is actively preparing fresh orders right now!`;
    } else if (lowerQuery.includes('coupon') || lowerQuery.includes('discount') || lowerQuery.includes('offer') || lowerQuery.includes('promo') || lowerQuery.includes('code')) {
      if (Array.isArray(coupons) && coupons.length > 0) {
        const couponList = coupons.map((c: any) => `• **${c.code}**: ${c.discountPercent}% OFF (Min spend: ₹${c.minOrderValue || 0}) — ${c.description || 'Special store discount'}`).join('\n');
        reply = `🎉 **Active Coupons for Today at ${restaurantName}**:\n\n${couponList}\n\nYou can also spin our interactive **Lucky Coupon Wheel** on the home screen to unlock surprise prizes!`;
      } else {
        reply = `🎉 We have instant discounts active! Use code **LUCKY20** for 20% OFF or spin the Lucky Coupon Wheel!`;
      }
    } else if (lowerQuery.includes('delivery') || lowerQuery.includes('fee') || lowerQuery.includes('shipping')) {
      reply = `🛵 **Delivery Information**:\n• Standard Delivery Fee: ₹${deliveryFee}\n• **FREE DELIVERY**: On all orders above ₹200!\n• Estimated Delivery Time: ~20-25 mins\n• GST Rate: ${gst}%`;
    } else if (lowerQuery.includes('location') || lowerQuery.includes('address') || lowerQuery.includes('phone') || lowerQuery.includes('contact')) {
      reply = `📍 **${restaurantName} Contact & Location**\n• Address: ${address}\n• Hotline: ${hotline}\n• Hours: ${timings}\nFeel free to call us or place an instant online order!`;
    } else if (matchingDishes.length > 0) {
      const topPicks = matchingDishes.slice(0, 3);
      suggested = topPicks.map((d: any) => d.name);
      const dishesText = topPicks.map((d: any) => `• **${d.name}** (₹${d.price}): ${d.description || ''}`).join('\n');
      reply = `✨ Based on your request, here are top handcrafted picks from ${restaurantName}:\n\n${dishesText}\n\nWould you like to pair this with our signature thick shakes or crisp snacks?`;
    } else if (lowerQuery.includes('pizza')) {
      reply = `🍕 Our top pizza recommendation is the **Artisan Truffle & Burrata Wood-Fired Pizza** (₹220) and the classic **Margherita Fresh Basil Pizza** (₹150), crafted with slow-fermented dough and fresh mozzarella!`;
      suggested = ['Margherita Fresh Basil Pizza', 'Artisan Truffle & Burrata Wood-Fired Pizza'];
    } else if (lowerQuery.includes('burger') || lowerQuery.includes('sandwich')) {
      reply = `🍔 You'll love our **Crispy Peri Peri Paneer Burger** (₹140) or our triple-layered **Grilled Club Cheese Sandwich** (₹90)!`;
      suggested = ['Crispy Peri Peri Paneer Burger', 'Grilled Club Cheese Sandwich'];
    } else if (lowerQuery.includes('shake') || lowerQuery.includes('drink') || lowerQuery.includes('coffee') || lowerQuery.includes('beverage')) {
      reply = `🥤 For chilled refreshments, we recommend our signature **Belgian Dark Chocolate Thick Shake** (₹100) or a sparkling **Fresh Mint & Lime Mojito** (₹90)!`;
      suggested = ['Belgian Dark Chocolate Thick Shake', 'Fresh Mint & Lime Mojito'];
    } else if (lowerQuery.includes('combo') || lowerQuery.includes('trio')) {
      reply = `✨ Try our best-value combos! The **Burger + Fries + Shake combo** (₹250) or **Pizza + Refreshing Drink** (₹190) are customer favorites.`;
      suggested = ['Burger + Fries + Milkshake Combo', 'Pizza + Cooldrink Combo'];
    } else {
      reply = `Welcome to **${restaurantName}**, ${customerName}! 🤖 I'm Chef Frosty, your virtual culinary assistant. I recommend starting with our **Artisan Truffle Pizza**, paired with a **Belgian Chocolate Thick Shake** and **Golden Crispy Fries**! How can I delight your appetite today?`;
      suggested = ['Artisan Truffle & Burrata Wood-Fired Pizza', 'Belgian Dark Chocolate Thick Shake', 'Crispy Cheese Balls'];
    }

    return res.json({
      reply,
      recommendation: reply,
      suggestedItems: suggested.length > 0 ? suggested : ['Artisan Truffle & Burrata Wood-Fired Pizza', 'Belgian Dark Chocolate Thick Shake', 'Crispy Cheese Balls'],
      fallback: true
    });

  } catch (error: any) {
    console.error('AI Assistant server error:', error);
    res.status(500).json({
      reply: "I'm having a brief flavor brainstorm! In the meantime, try our chef signature Artisan Truffle Pizza and Chocolate Shake!",
      error: error.message
    });
  }
});

// Legacy route alias for backward compatibility
app.post('/api/ai-chef', async (req, res) => {
  req.url = '/api/ai-assistant';
  app._router.handle(req, res, () => {});
});

// Vite middleware in dev or static serving in production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Restaurant Server running on port ${PORT}`);
  });
}

start();
