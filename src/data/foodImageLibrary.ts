export interface FoodPhotoOption {
  id: string;
  title: string;
  category: 'pizza' | 'burger' | 'pasta' | 'sandwich' | 'drink' | 'snack' | 'dessert' | 'combo';
  url: string;
  tags: string[];
}

export const REAL_FOOD_PHOTOS: FoodPhotoOption[] = [
  // === PIZZAS ===
  {
    id: 'photo-pizza-1',
    title: 'Artisan Wood-Fired Margherita Pizza',
    category: 'pizza',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    tags: ['pizza', 'margherita', 'cheese', 'mozzarella', 'italian', 'woodfired', 'crust', 'veg']
  },
  {
    id: 'photo-pizza-2',
    title: 'Farmhouse Veggie Supreme Pizza',
    category: 'pizza',
    url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    tags: ['pizza', 'veggie', 'farmhouse', 'capsicum', 'onion', 'mushroom', 'veg']
  },
  {
    id: 'photo-pizza-3',
    title: 'Gourmet Truffle & Burrata Artisan Pizza',
    category: 'pizza',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    tags: ['pizza', 'truffle', 'burrata', 'cheese', 'gourmet', 'artisan']
  },
  {
    id: 'photo-pizza-4',
    title: 'Spicy Paneer Tikka & Jalapeno Pizza',
    category: 'pizza',
    url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    tags: ['pizza', 'paneer', 'spicy', 'tikka', 'jalapeno', 'indian']
  },
  {
    id: 'photo-pizza-5',
    title: 'Cheesy Quattro Formaggi Four Cheese Pizza',
    category: 'pizza',
    url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    tags: ['pizza', 'four cheese', 'quattro', 'cheese burst', 'cheesy']
  },

  // === BURGERS ===
  {
    id: 'photo-burger-1',
    title: 'Classic Gourmet Smash Cheeseburger',
    category: 'burger',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    tags: ['burger', 'cheeseburger', 'smash', 'brioche', 'cheese', 'patty']
  },
  {
    id: 'photo-burger-2',
    title: 'Crispy Veggie & Paneer Supreme Burger',
    category: 'burger',
    url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    tags: ['burger', 'crispy', 'veg', 'paneer', 'veggie burger', 'lettuce']
  },
  {
    id: 'photo-burger-3',
    title: 'Double Stack Truffle Deluxe Burger',
    category: 'burger',
    url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    tags: ['burger', 'double', 'stack', 'deluxe', 'truffle', 'loaded']
  },
  {
    id: 'photo-burger-4',
    title: 'Fiery Jalapeno Spicy Crunch Burger',
    category: 'burger',
    url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    tags: ['burger', 'spicy', 'jalapeno', 'crunch', 'hot', 'fiery']
  },

  // === PASTAS ===
  {
    id: 'photo-pasta-1',
    title: 'Creamy Garlic Parmesan Alfredo Pasta',
    category: 'pasta',
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
    tags: ['pasta', 'alfredo', 'white sauce', 'parmesan', 'fettuccine', 'creamy']
  },
  {
    id: 'photo-pasta-2',
    title: 'Spicy Tomato Basil Penne Arrabbiata',
    category: 'pasta',
    url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    tags: ['pasta', 'penne', 'red sauce', 'arrabbiata', 'tomato', 'basil', 'spicy']
  },
  {
    id: 'photo-pasta-3',
    title: 'Basil Pesto Pine Nut Gourmet Pasta',
    category: 'pasta',
    url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
    tags: ['pasta', 'pesto', 'green sauce', 'basil', 'pine nuts', 'italian']
  },

  // === SANDWICHES & WRAPS ===
  {
    id: 'photo-sandwich-1',
    title: 'Multi-Layer Triple-Decker Club Sandwich',
    category: 'sandwich',
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    tags: ['sandwich', 'club', 'triple decker', 'grilled', 'toast', 'toastie']
  },
  {
    id: 'photo-sandwich-2',
    title: 'Artisan Grilled Sourdough Cheese Melt',
    category: 'sandwich',
    url: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=800&q=80',
    tags: ['sandwich', 'grilled cheese', 'melt', 'sourdough', 'cheesy']
  },
  {
    id: 'photo-sandwich-3',
    title: 'Grilled Paneer Tikka & Mexican Wrap',
    category: 'sandwich',
    url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    tags: ['sandwich', 'wrap', 'roll', 'taco', 'burrito', 'paneer', 'tikka', 'taco_wrap']
  },

  // === DRINKS & SHAKES ===
  {
    id: 'photo-drink-1',
    title: 'Signature Belgian Chocolate Thickshake',
    category: 'drink',
    url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    tags: ['drink', 'shake', 'thickshake', 'chocolate', 'belgian', 'milkshake', 'ice cream']
  },
  {
    id: 'photo-drink-2',
    title: 'Fresh Alphonso Mango Thickshake',
    category: 'drink',
    url: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    tags: ['drink', 'shake', 'mango', 'thickshake', 'alphonso', 'fruit', 'smoothie']
  },
  {
    id: 'photo-drink-3',
    title: 'Cold Brew Creamy Iced Coffee & Frappe',
    category: 'drink',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    tags: ['drink', 'coffee', 'cold brew', 'frappe', 'iced coffee', 'latte', 'espresso']
  },
  {
    id: 'photo-drink-4',
    title: 'Sparkling Fresh Mint & Lime Mojito',
    category: 'drink',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    tags: ['drink', 'mojito', 'mint', 'lime', 'mocktail', 'refresher', 'soda', 'sparkling']
  },
  {
    id: 'photo-drink-5',
    title: 'Wild Berry Fusion Mocktail',
    category: 'drink',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    tags: ['drink', 'berry', 'mocktail', 'refresher', 'cocktail', 'juice', 'strawberry']
  },

  // === SNACKS & SIDES ===
  {
    id: 'photo-snack-1',
    title: 'Crisp Golden French Fries with Herbs',
    category: 'snack',
    url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    tags: ['snack', 'fries', 'french fries', 'golden', 'crispy', 'potato', 'peri peri']
  },
  {
    id: 'photo-snack-2',
    title: 'Cheesy Melted Loaded Nachos Platter',
    category: 'snack',
    url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80',
    tags: ['snack', 'nachos', 'cheese', 'salsa', 'jalapeno', 'mexican', 'loaded']
  },
  {
    id: 'photo-snack-3',
    title: 'Crisp Mozzarella Sticks & Herb Dip',
    category: 'snack',
    url: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=800&q=80',
    tags: ['snack', 'mozzarella', 'cheese sticks', 'bites', 'nuggets', 'fried']
  },
  {
    id: 'photo-snack-4',
    title: 'Crunchy Golden Spring Rolls with Sweet Chilli',
    category: 'snack',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tags: ['snack', 'spring roll', 'crispy', 'asian', 'finger food', 'roll']
  },

  // === DESSERTS ===
  {
    id: 'photo-dessert-1',
    title: 'Sizzling Hot Chocolate Walnut Brownie with Gelato',
    category: 'dessert',
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    tags: ['dessert', 'brownie', 'chocolate', 'walnut', 'sizzling', 'fudge', 'cake']
  },
  {
    id: 'photo-dessert-2',
    title: 'New York Creamy Cheesecake with Berry Coulis',
    category: 'dessert',
    url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    tags: ['dessert', 'cheesecake', 'berry', 'cake', 'strawberry', 'bakery']
  },
  {
    id: 'photo-dessert-3',
    title: 'Warm Belgian Waffles with Nutella & Cream',
    category: 'dessert',
    url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
    tags: ['dessert', 'waffle', 'nutella', 'belgian', 'pancake', 'ice cream']
  },

  // === COMBOS & PLATTERS ===
  {
    id: 'photo-combo-1',
    title: 'Ultimate Gourmet Feast Combo Platter',
    category: 'combo',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    tags: ['combo', 'feast', 'platter', 'burger', 'fries', 'drink', 'meal']
  },
  {
    id: 'photo-combo-2',
    title: 'Wood-Fired Pizza & Thickshake Duo Combo',
    category: 'combo',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    tags: ['combo', 'pizza', 'duo', 'shake', 'meal deal', 'platter']
  }
];

/**
 * Smart matcher: returns best real food photos based on item name, category, and tags
 */
export function matchRealFoodPhotos(query: string, category?: string): FoodPhotoOption[] {
  const clean = query.trim().toLowerCase();
  
  if (!clean && !category) {
    return REAL_FOOD_PHOTOS;
  }

  const queryWords = clean.split(/\s+/).filter(w => w.length > 2);

  // Score each photo
  const scored = REAL_FOOD_PHOTOS.map(photo => {
    let score = 0;
    
    // Category match
    if (category && (photo.category === category || category === 'all')) {
      score += 5;
    }

    // Title includes full query
    if (clean && photo.title.toLowerCase().includes(clean)) {
      score += 15;
    }

    // Word matches in title or tags
    queryWords.forEach(word => {
      if (photo.title.toLowerCase().includes(word)) {
        score += 8;
      }
      if (photo.tags.some(tag => tag.includes(word))) {
        score += 6;
      }
    });

    return { photo, score };
  });

  // Sort by highest score first
  scored.sort((a, b) => b.score - a.score);

  const matched = scored.filter(s => s.score > 0).map(s => s.photo);

  // If no match found, fallback to category photos or entire catalog
  if (matched.length === 0) {
    if (category && category !== 'all') {
      return REAL_FOOD_PHOTOS.filter(p => p.category === category);
    }
    return REAL_FOOD_PHOTOS;
  }

  return matched;
}
