import { MenuItem, LuckyCoupon, RestaurantInfo, UserAccount } from '../types';

export const DEFAULT_RESTAURANT_INFO: RestaurantInfo = {
  name: 'Smart Food & Dine',
  tagline: 'Signature Thickshakes • Stone-Baked Pizzas • Crisp Gourmet Snacks',
  logoText: 'SMART',
  announcement: 'Special Offer: Flat GST & Win Up to 43% Lucky Coupons on Every Order!',
  hotline: '1800-SMART-DINE (1800-762-783)',
  email: 'orders@smartdine.com',
  address: 'Flagship Lounge: 42 MG Road & Central Food Court, Sector 5',
  timings: 'Open Daily: 10:00 AM – 11:30 PM',
  gstPercentage: 5,
  deliveryFee: 30,
  freeDeliveryMin: 200
};

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'user-admin',
    name: 'Admin Manager',
    email: 'admin@restaurant.com',
    mobile: '9876543210',
    role: 'admin',
    loginMethod: 'admin',
    loyaltyPoints: 1250,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-kiran',
    name: 'Kiran Kumar Behera',
    email: 'kirankumarbehera2006@gmail.com',
    mobile: '9876543210',
    role: 'customer',
    loginMethod: 'google',
    loyaltyPoints: 480,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // ================= 1. PIZZAS (Category: food, Subcategory: pizza) =================
  {
    id: 'pizza-signature-truffle',
    name: 'Artisan Truffle & Burrata Wood-Fired Pizza',
    category: 'food',
    subcategory: 'pizza',
    price: 249,
    originalPrice: 299,
    description: 'Chef signature hand-stretched sourdough crust with imported Italian black truffle reduction, creamy molten burrata core, roasted cherry tomatoes, and fresh sweet basil.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
    reviewsCount: 420,
    isVeg: true,
    isBestseller: true,
    isChefSpecial: true,
    inStock: true,
    calories: 720,
    prepTime: '15-18 mins',
    tags: ['Chef Signature', 'Truffle Glaze', 'Burrata Cheese', 'Artisan Crust'],
    ingredients: ['Italian Burrata', 'Black Truffle Oil', 'San Marzano Tomatoes', 'Fresh Basil', 'EVOO'],
    customizations: {
      sizes: [
        { name: 'Personal (8")', priceMultiplier: 1.0 },
        { name: 'Gourmet Medium (10")', priceMultiplier: 1.35 },
        { name: 'Grand Feast (12")', priceMultiplier: 1.75 }
      ],
      addOns: [
        { name: 'Extra Molten Burrata', price: 60 },
        { name: 'Truffle Garlic Dip', price: 40 },
        { name: 'Charred Jalapeños & Olives', price: 35 }
      ]
    }
  },
  {
    id: 'pizza-1',
    name: 'Margherita Classic Pizza',
    category: 'food',
    subcategory: 'pizza',
    price: 150,
    originalPrice: 180,
    description: 'Crisp hand-stretched crust layered with rich San Marzano marinara, 100% mozzarella cheese, and fresh basil leaves.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 342,
    isVeg: true,
    isBestseller: true,
    inStock: true,
    calories: 680,
    prepTime: '15-20 mins',
    tags: ['Cheesy', 'Wood-Fired', 'Classic'],
    ingredients: ['Mozzarella', 'San Marzano Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
    customizations: {
      sizes: [
        { name: 'Regular (8")', priceMultiplier: 1.0 },
        { name: 'Medium (10")', priceMultiplier: 1.4 },
        { name: 'Large (12")', priceMultiplier: 1.8 }
      ],
      addOns: [
        { name: 'Extra Mozzarella Cheese', price: 40 },
        { name: 'Black Olives & Jalapeños', price: 30 },
        { name: 'Paneer Cubes', price: 45 }
      ]
    }
  },
  {
    id: 'pizza-2',
    name: 'Paneer Tikka Gourmet Pizza',
    category: 'food',
    subcategory: 'pizza',
    price: 210,
    originalPrice: 240,
    description: 'Tandoori-spiced cottage cheese cubes, charred bell peppers, sliced red onion, and smoky coriander pesto drizzle over mozzarella.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 280,
    isVeg: true,
    isChefSpecial: true,
    inStock: true,
    calories: 740,
    prepTime: '18-22 mins',
    tags: ['Gourmet', 'Tandoori', 'Spicy'],
    ingredients: ['Tandoori Paneer', 'Bell Peppers', 'Red Onion', 'Makhani Sauce', 'Mozzarella'],
    customizations: {
      sizes: [
        { name: 'Regular (8")', priceMultiplier: 1.0 },
        { name: 'Medium (10")', priceMultiplier: 1.4 },
        { name: 'Large (12")', priceMultiplier: 1.8 }
      ],
      addOns: [
        { name: 'Cheese Burst Stuffed Crust', price: 60 },
        { name: 'Extra Tandoori Mayo', price: 25 }
      ]
    }
  },
  {
    id: 'pizza-3',
    name: 'Farmhouse Garden Supreme Pizza',
    category: 'food',
    subcategory: 'pizza',
    price: 190,
    originalPrice: 220,
    description: 'Loaded with crisp bell peppers, sweet golden corn, button mushrooms, baby corn, red onions, and melted herb cheese.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 210,
    isVeg: true,
    inStock: true,
    calories: 620,
    prepTime: '15-18 mins',
    tags: ['Farmfresh', 'Veggie Loaded', 'Crispy'],
    ingredients: ['Button Mushrooms', 'Sweet Corn', 'Capsicum', 'Onions', 'Herb Marinara'],
    customizations: {
      sizes: [
        { name: 'Regular (8")', priceMultiplier: 1.0 },
        { name: 'Medium (10")', priceMultiplier: 1.4 },
        { name: 'Large (12")', priceMultiplier: 1.8 }
      ],
      addOns: [
        { name: 'Extra Cheese', price: 40 },
        { name: 'Peri Peri Seasoning', price: 20 }
      ]
    }
  },
  {
    id: 'pizza-4',
    name: 'Fiery Peri Peri Cottage Cheese Pizza',
    category: 'food',
    subcategory: 'pizza',
    price: 220,
    originalPrice: 250,
    description: 'Spicy African birds eye chilli glazed cottage cheese, pickled jalapenos, roasted paprika, and fiery peri-peri cheese spread.',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 165,
    isVeg: true,
    isSpicy: true,
    inStock: true,
    calories: 710,
    prepTime: '16-20 mins',
    tags: ['Fiery', 'Peri Peri', 'Hot'],
    ingredients: ['Peri Peri Cottage Cheese', 'Jalapeños', 'Paprika', 'Chilli Flakes'],
    customizations: {
      spiceLevels: ['Medium Kick', 'Fiery Hot', 'Ghost Pepper Extreme'],
      addOns: [
        { name: 'Cooling Mint Mayo Dip', price: 25 },
        { name: 'Cheese Burst Edge', price: 55 }
      ]
    }
  },
  {
    id: 'pizza-5',
    name: 'Four Cheese Quattro Formaggi Pizza',
    category: 'food',
    subcategory: 'pizza',
    price: 240,
    originalPrice: 280,
    description: 'Ultimate cheese fantasy featuring rich blend of Mozzarella, English Cheddar, creamy Gouda, and sharp Parmesan.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 390,
    isVeg: true,
    isBestseller: true,
    isChefSpecial: true,
    inStock: true,
    calories: 820,
    prepTime: '16-20 mins',
    tags: ['Cheese Pull', 'Gourmet', 'Must Try'],
    ingredients: ['Mozzarella', 'Cheddar', 'Gouda', 'Parmesan', 'Garlic Butter']
  },

  // ================= 2. BURGERS & SLIDERS (Category: food, Subcategory: burger) =================
  {
    id: 'burger-1',
    name: 'Classic Crunch Burger',
    category: 'food',
    subcategory: 'burger',
    price: 100,
    originalPrice: 120,
    description: 'Crispy spiced vegetable patty topped with melted cheddar slice, crisp lettuce, red onions, and house special thousand-island sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 289,
    isVeg: true,
    isBestseller: true,
    inStock: true,
    calories: 520,
    prepTime: '10-15 mins',
    tags: ['Crispy', 'Juicy', 'Chef Special'],
    ingredients: ['Veg Patty', 'Cheddar Slice', 'Iceberg Lettuce', 'Burger Mayo', 'Brioche Bun'],
    customizations: {
      spiceLevels: ['Mild', 'Medium Spicy', 'Fiery Hot'],
      addOns: [
        { name: 'Extra Cheese Slice', price: 25 },
        { name: 'Caramelized Onions', price: 20 },
        { name: 'Spicy Peri Peri Dip', price: 25 }
      ]
    }
  },
  {
    id: 'burger-2',
    name: 'Crispy Paneer Maharaja Burger',
    category: 'food',
    subcategory: 'burger',
    price: 150,
    originalPrice: 180,
    description: 'Thick fried panko-crumbed cottage cheese slab infused with herbs, tangy tandoori mayo, crunchy coleslaw, and sliced gherkins in a toasted sesame bun.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 410,
    isVeg: true,
    isChefSpecial: true,
    inStock: true,
    calories: 640,
    prepTime: '12-15 mins',
    tags: ['Maharaja', 'Paneer Crunch', 'King Size'],
    ingredients: ['Paneer Slab', 'Tandoori Dressing', 'Coleslaw', 'Toasted Sesame Bun'],
    customizations: {
      addOns: [
        { name: 'Double Paneer Patty', price: 60 },
        { name: 'Smoked Cheese Melt', price: 30 }
      ]
    }
  },
  {
    id: 'burger-3',
    name: 'Cheesy Jalapeño Smash Burger',
    category: 'food',
    subcategory: 'burger',
    price: 130,
    originalPrice: 160,
    description: 'Double melted cheddar blend, grilled spicy pickled jalapeños, crispy potato patty, and smoky chipotle aioli.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 230,
    isVeg: true,
    isSpicy: true,
    inStock: true,
    calories: 580,
    prepTime: '10-12 mins',
    tags: ['Cheesy', 'Jalapeño', 'Zesty'],
    ingredients: ['Smash Patty', 'Jalapeños', 'Chipotle Sauce', 'Molten Cheddar']
  },
  {
    id: 'burger-4',
    name: 'Smoky BBQ Veggie Delight Burger',
    category: 'food',
    subcategory: 'burger',
    price: 120,
    originalPrice: 145,
    description: 'Char-grilled vegetable patty smothered in American Hickory BBQ glaze, golden onion rings, crisp lettuce, and vegan garlic sauce.',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewsCount: 175,
    isVeg: true,
    inStock: true,
    calories: 510,
    prepTime: '10-14 mins',
    tags: ['Smoky BBQ', 'Crispy', 'American Style']
  },

  // ================= 3. SANDWICHES & TOASTS (Category: food, Subcategory: sandwich) =================
  {
    id: 'sandwich-1',
    name: 'Grilled Club Sandwich',
    category: 'food',
    subcategory: 'sandwich',
    price: 90,
    originalPrice: 110,
    description: 'Triple-decker butter-toasted sandwich loaded with garden cucumber, juicy tomatoes, coleslaw, and herb-infused mint chutney.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewsCount: 195,
    isVeg: true,
    inStock: true,
    calories: 410,
    prepTime: '8-12 mins',
    tags: ['Toasted', 'Healthy', 'Quick Snack'],
    customizations: {
      addOns: [
        { name: 'Cheese Burst', price: 30 },
        { name: 'Grilled Corn & Paneer', price: 35 }
      ]
    }
  },
  {
    id: 'sandwich-2',
    name: 'Mumbai Masala Cheese Toast',
    category: 'food',
    subcategory: 'sandwich',
    price: 95,
    originalPrice: 115,
    description: 'Street-style spiced potato mash, chopped green chillies, chaat masala, loaded processed cheese, and fresh coriander mint dip.',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 310,
    isVeg: true,
    isBestseller: true,
    isSpicy: true,
    inStock: true,
    calories: 460,
    prepTime: '8-10 mins',
    tags: ['Street Food', 'Masala', 'Spicy Toast']
  },
  {
    id: 'sandwich-3',
    name: 'Corn & Spinach Cheese Melt Sub',
    category: 'food',
    subcategory: 'sandwich',
    price: 115,
    originalPrice: 140,
    description: 'Creamy sauteed sweet corn and baby spinach cooked in garlic bechamel sauce, stuffed inside toasted herb baguette with mozzarella.',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 140,
    isVeg: true,
    inStock: true,
    calories: 440,
    prepTime: '10 mins',
    tags: ['Creamy', 'Herb Sub', 'Gourmet']
  },

  // ================= 4. PASTAS & BOWLS (Category: food, Subcategory: pasta) =================
  {
    id: 'pasta-1',
    name: 'Creamy Alfredo White Pasta',
    category: 'food',
    subcategory: 'pasta',
    price: 130,
    originalPrice: 160,
    description: 'Al dente penne smothered in velvety garlic-parmesan white cream sauce, tossed with bell peppers, olives, and sweet corn.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169a?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 412,
    isVeg: true,
    isBestseller: true,
    inStock: true,
    calories: 620,
    prepTime: '12-16 mins',
    tags: ['Creamy', 'Italian', 'Rich'],
    customizations: {
      spiceLevels: ['Mild', 'Spicy Herbs', 'Chilli Flakes Max'],
      addOns: [
        { name: 'Garlic Bread Pair (2 pcs)', price: 45 },
        { name: 'Extra Cream & Cheese', price: 35 }
      ]
    }
  },
  {
    id: 'pasta-2',
    name: 'Spicy Arrabbiata Red Sauce Pasta',
    category: 'food',
    subcategory: 'pasta',
    price: 130,
    originalPrice: 155,
    description: 'Authentic Italian tomato marinara infused with fiery red pepper flakes, fresh basil, garlic cloves, and Kalamata olives.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 220,
    isVeg: true,
    isSpicy: true,
    inStock: true,
    calories: 490,
    prepTime: '12-15 mins',
    tags: ['Tangy', 'Fiery Red', 'Italian Classic']
  },
  {
    id: 'pasta-3',
    name: 'Baked Pink Sauce Rose Pasta',
    category: 'food',
    subcategory: 'pasta',
    price: 155,
    originalPrice: 185,
    description: 'Harmonious fusion of slow-cooked red tomato sauce & rich white cream sauce, topped with golden broiled mozzarella crust.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 190,
    isVeg: true,
    isChefSpecial: true,
    inStock: true,
    calories: 670,
    prepTime: '15-18 mins',
    tags: ['Pink Sauce', 'Baked Cheesy', 'Signature']
  },

  // ================= 5. TACOS & WRAPS (Category: food, Subcategory: taco_wrap) =================
  {
    id: 'taco-1',
    name: 'Fiesta Crispy Corn Taco (2 pcs)',
    category: 'food',
    subcategory: 'taco_wrap',
    price: 110,
    originalPrice: 135,
    description: 'Golden crunchy corn taco shells stuffed with spiced beans, chunky fresh salsa, sour cream, and shredded Mexican cheese blend.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 220,
    isVeg: true,
    isSpicy: true,
    inStock: true,
    calories: 450,
    prepTime: '10-14 mins',
    tags: ['Mexican', 'Crunchy', 'Tangy'],
    customizations: {
      spiceLevels: ['Mild Salsa', 'Medium Jalapeno', 'Ghost Pepper Kick'],
      addOns: [
        { name: 'Extra Guacamole Dip', price: 40 },
        { name: 'Cheesy Nacho Drizzle', price: 30 }
      ]
    }
  },
  {
    id: 'wrap-1',
    name: 'Crispy Paneer Tikka Kathi Roll',
    category: 'food',
    subcategory: 'taco_wrap',
    price: 120,
    originalPrice: 145,
    description: 'Flaky paratha wrap filled with tandoori paneer strips, crunchy cabbage slaw, pickled red onions, and mint mayo.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 310,
    isVeg: true,
    isBestseller: true,
    inStock: true,
    calories: 520,
    prepTime: '10-12 mins',
    tags: ['Roll', 'Street Style', 'Tandoori']
  },
  {
    id: 'wrap-2',
    name: 'Cheesy Mexican Veg Quesadilla',
    category: 'food',
    subcategory: 'taco_wrap',
    price: 135,
    originalPrice: 160,
    description: 'Toasted flour tortilla stuffed with sauteed Mexican vegetables, sweet corn, black beans, molten pepper jack cheese, served with sour cream.',
    image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 160,
    isVeg: true,
    inStock: true,
    calories: 490,
    prepTime: '12 mins',
    tags: ['Quesadilla', 'Cheesy', 'Mexican']
  },

  // ================= 6. SIGNATURE SHAKES (Category: drink, Subcategory: shake) =================
  {
    id: 'shake-1',
    name: 'Thick Vanilla Bean Milkshake',
    category: 'drink',
    subcategory: 'shake',
    price: 120,
    originalPrice: 140,
    description: 'Signature Frozen Bottle ultra-thick vanilla bean shake blended with creamy whole milk and topped with whipped cream.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 512,
    isVeg: true,
    isBestseller: true,
    inStock: true,
    calories: 380,
    prepTime: '5 mins',
    tags: ['Frozen Bottle Signature', 'Creamy', 'Chilled'],
    customizations: {
      sizes: [
        { name: 'Standard (300ml)', priceMultiplier: 1.0 },
        { name: 'Large Jar (500ml)', priceMultiplier: 1.35 }
      ],
      addOns: [
        { name: 'Ice Cream Scoop', price: 35 },
        { name: 'Rainbow Sprinkles & Choco Chips', price: 20 }
      ]
    }
  },
  {
    id: 'shake-2',
    name: 'Decadent Belgian Chocolate Shake',
    category: 'drink',
    subcategory: 'shake',
    price: 100,
    originalPrice: 130,
    description: 'Double fudge Belgian chocolate syrup churned with dark chocolate chips, creamy dairy milk, and chocolate curls.',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 680,
    isVeg: true,
    isBestseller: true,
    inStock: true,
    calories: 460,
    prepTime: '5 mins',
    tags: ['Must Try', 'Belgian Chocolate', 'Rich'],
    customizations: {
      sizes: [
        { name: 'Regular (300ml)', priceMultiplier: 1.0 },
        { name: 'Monster Bottle (550ml)', priceMultiplier: 1.4 }
      ],
      addOns: [
        { name: 'Nutella Drizzle', price: 35 },
        { name: 'Crushed Oreo Bits', price: 25 },
        { name: 'Brownie Crumbs', price: 35 }
      ]
    }
  },
  {
    id: 'shake-3',
    name: 'Ferrero Rocher Hazelnut Overload Shake',
    category: 'drink',
    subcategory: 'shake',
    price: 160,
    originalPrice: 195,
    description: 'Whole Ferrero Rocher truffles blended with roasted hazelnut butter, cocoa fudge, and topped with crunchy praline bits.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 490,
    isVeg: true,
    isChefSpecial: true,
    inStock: true,
    calories: 560,
    prepTime: '6 mins',
    tags: ['Luxury Shake', 'Ferrero Rocher', 'Hazelnut']
  },
  {
    id: 'shake-4',
    name: 'Oreo Cookies & Cream Thickshake',
    category: 'drink',
    subcategory: 'shake',
    price: 130,
    originalPrice: 150,
    description: 'Crunchy crushed Oreo biscuits spun with vanilla soft serve, dark cocoa ganache, and topped with whole mini Oreos.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 370,
    isVeg: true,
    inStock: true,
    calories: 480,
    prepTime: '5 mins',
    tags: ['Oreo Mania', 'Cookies & Cream', 'Top Rated']
  },
  {
    id: 'shake-5',
    name: 'Alphonso Royal Mango Shake',
    category: 'drink',
    subcategory: 'shake',
    price: 140,
    originalPrice: 165,
    description: 'Pure Ratnagiri Alphonso mango pulp churned with rich malai milk and garnished with real mango fruit chunks.',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 290,
    isVeg: true,
    inStock: true,
    calories: 390,
    prepTime: '5 mins',
    tags: ['Alphonso Mango', 'Seasonal King', 'Refreshing']
  },
  {
    id: 'shake-6',
    name: 'KitKat Crunchy Chocolate Shake',
    category: 'drink',
    subcategory: 'shake',
    price: 135,
    originalPrice: 160,
    description: 'Crispy wafer KitKat fingers blended into rich chocolate cream, topped with chocolate syrup drizzle and KitKat bar.',
    image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 340,
    isVeg: true,
    inStock: true,
    calories: 510,
    prepTime: '5 mins',
    tags: ['KitKat', 'Wafer Crunch', 'Kids Favorite']
  },

  // ================= 7. COLD COFFEES & BEVERAGES (Category: drink, Subcategory: coffee & refresher) =================
  {
    id: 'drink-1',
    name: 'Creamy Classic Cold Coffee',
    category: 'drink',
    subcategory: 'coffee',
    price: 110,
    originalPrice: 130,
    description: 'Slow-brewed Arabica espresso blended with chilled condensed milk, vanilla syrup, and finished with a velvety espresso foam.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 420,
    isVeg: true,
    isBestseller: true,
    inStock: true,
    calories: 290,
    prepTime: '4 mins',
    tags: ['Arabica', 'Caffeine Boost', 'Creamy'],
    customizations: {
      addOns: [
        { name: 'Extra Espresso Shot', price: 30 },
        { name: 'Caramel Swirl', price: 25 }
      ]
    }
  },
  {
    id: 'drink-2',
    name: 'Hazelnut Mocha Frappuccino',
    category: 'drink',
    subcategory: 'coffee',
    price: 135,
    originalPrice: 160,
    description: 'Roasted hazelnut syrup with dark cocoa, iced double espresso, whole milk, and whipped chocolate foam.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 310,
    isVeg: true,
    inStock: true,
    calories: 340,
    prepTime: '4 mins',
    tags: ['Mocha', 'Hazelnut', 'Frappe']
  },
  {
    id: 'drink-3',
    name: 'Sparkling Cooldrink (Chilled)',
    category: 'drink',
    subcategory: 'refresher',
    price: 60,
    originalPrice: 70,
    description: 'Ice-cold carbonated beverage served in chilled glass with fresh lime slice and mint sprig.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewsCount: 150,
    isVeg: true,
    inStock: true,
    calories: 140,
    prepTime: '2 mins',
    tags: ['Fizzy', 'Refreshing', 'Ice Cold'],
    customizations: {
      addOns: [
        { name: 'Add Lemon & Mint Infusion', price: 15 }
      ]
    }
  },
  {
    id: 'drink-4',
    name: 'Virgin Mint Mojito Cooler',
    category: 'drink',
    subcategory: 'refresher',
    price: 90,
    originalPrice: 110,
    description: 'Freshly muddled garden mint, tangy key lime wedges, natural cane sugar, and sparkling mineral soda over crushed ice.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 310,
    isVeg: true,
    inStock: true,
    calories: 110,
    prepTime: '4 mins',
    tags: ['Mocktail', 'Citrus', 'Energizing'],
    customizations: {
      addOns: [
        { name: 'Add Green Apple Flavor', price: 20 },
        { name: 'Add Blue Curacao Flavor', price: 25 }
      ]
    }
  },
  {
    id: 'drink-5',
    name: 'Blue Curacao Lagoon Fizz',
    category: 'drink',
    subcategory: 'refresher',
    price: 95,
    originalPrice: 120,
    description: 'Vibrant electric blue curacao syrup shaken with tangy lime juice, sprite fizz, and crushed crystal ice.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 260,
    isVeg: true,
    inStock: true,
    calories: 120,
    prepTime: '3 mins',
    tags: ['Blue Lagoon', 'Citrus Fizz', 'Instagrammable']
  },

  // ================= 8. CRISPY FINGER SNACKS (Category: snack, Subcategory: snack) =================
  {
    id: 'snack-1',
    name: 'Golden Crispy Fries',
    category: 'snack',
    subcategory: 'snack',
    price: 70,
    originalPrice: 90,
    description: 'Crunchy golden salted potato batons fried to perfection, served with tangy tomato dip and garlic mayonnaise.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 460,
    isVeg: true,
    isBestseller: true,
    inStock: true,
    calories: 340,
    prepTime: '8 mins',
    tags: ['Crunchy', 'Snack Favorite'],
    customizations: {
      spiceLevels: ['Classic Salted', 'Peri Peri Spice Dust', 'Cheesy Jalapeño Seasoning'],
      addOns: [
        { name: 'Warm Cheese Sauce Dip', price: 30 },
        { name: 'Spicy Chipotle Dip', price: 25 }
      ]
    }
  },
  {
    id: 'snack-2',
    name: 'Crispy Veg Nuggets (8 pcs)',
    category: 'snack',
    subcategory: 'snack',
    price: 80,
    originalPrice: 100,
    description: 'Golden crumb-coated savoury bites packed with sweet corn, potato mash, and aromatic spices with sweet chilli dip.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewsCount: 290,
    isVeg: true,
    inStock: true,
    calories: 360,
    prepTime: '8-10 mins',
    tags: ['Bite-sized', 'Crispy'],
    customizations: {
      addOns: [
        { name: 'Honey Mustard Dip', price: 25 },
        { name: 'Extra 4 Nuggets', price: 35 }
      ]
    }
  },
  {
    id: 'snack-3',
    name: 'Crunchy Spring Rolls (4 pcs)',
    category: 'snack',
    subcategory: 'snack',
    price: 85,
    originalPrice: 105,
    description: 'Crispy paper-thin pastry wrappers stuffed with sautéed Asian vegetables, glass noodles, and ginger-garlic aromatics.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 240,
    isVeg: true,
    inStock: true,
    calories: 310,
    prepTime: '10 mins',
    tags: ['Asian Crispy', 'Appetizer'],
    customizations: {
      addOns: [
        { name: 'Schezwan Hot Dip', price: 20 }
      ]
    }
  },
  {
    id: 'snack-4',
    name: 'Gooey Cheese Balls (6 pcs)',
    category: 'snack',
    subcategory: 'snack',
    price: 95,
    originalPrice: 120,
    description: 'Crispy breadcrumb crust on the outside with molten cheddar and mozzarella cheese center infused with jalapeños and herbs.',
    image: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 520,
    isVeg: true,
    isBestseller: true,
    isChefSpecial: true,
    inStock: true,
    calories: 420,
    prepTime: '8-10 mins',
    tags: ['Cheese Pull', 'Top Rated'],
    customizations: {
      addOns: [
        { name: 'Smoked Paprika Mayo', price: 25 },
        { name: 'Extra 3 Cheese Balls', price: 45 }
      ]
    }
  },
  {
    id: 'snack-5',
    name: 'Loaded Cheesy Nachos Grand Platter',
    category: 'snack',
    subcategory: 'snack',
    price: 125,
    originalPrice: 150,
    description: 'Crunchy Mexican tortilla chips blanketed in warm queso cheese sauce, fresh pico de gallo salsa, jalapeños, and sour cream.',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 310,
    isVeg: true,
    inStock: true,
    calories: 510,
    prepTime: '8 mins',
    tags: ['Sharing', 'Loaded', 'Cheesy']
  },
  {
    id: 'snack-6',
    name: 'Garlic Breadsticks with Molten Cheese Dip',
    category: 'snack',
    subcategory: 'snack',
    price: 90,
    originalPrice: 110,
    description: 'Four freshly baked buttery herb breadsticks coated in roasted garlic butter, parsley, and served with hot cheese dip.',
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 290,
    isVeg: true,
    inStock: true,
    calories: 380,
    prepTime: '10 mins',
    tags: ['Garlic Bread', 'Buttery', 'Side Item']
  },

  // ================= 9. COMBOS & VALUE PLATTERS (Category: combo, Subcategory: combo) =================
  {
    id: 'combo-1',
    name: 'Combo 1: Pizza + Cooldrink',
    category: 'combo',
    subcategory: 'combo',
    price: 190,
    originalPrice: 210,
    description: 'Complete hunger buster! Choice of 8" Margherita Pizza paired with an icy cold sparkling drink.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 650,
    isVeg: true,
    isBestseller: true,
    inStock: true,
    calories: 820,
    prepTime: '15 mins',
    tags: ['Save Rs.20', 'Best Value', 'Original Special'],
    comboIncludes: ['Margherita Pizza (8")', 'Chilled Cooldrink (300ml)']
  },
  {
    id: 'combo-2',
    name: 'Combo 2: Burger + Fries + Milkshake',
    category: 'combo',
    subcategory: 'combo',
    price: 250,
    originalPrice: 290,
    description: 'The iconic trio! Classic Crunch Burger, Golden Crispy Fries, and our rich signature Vanilla or Chocolate Milkshake.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 890,
    isVeg: true,
    isBestseller: true,
    isChefSpecial: true,
    inStock: true,
    calories: 1240,
    prepTime: '15 mins',
    tags: ['Save Rs.40', 'Mega Saver', 'Fan Favorite'],
    comboIncludes: ['Classic Crunch Burger', 'Golden Crispy Fries', 'Thick Milkshake (Choice)']
  },
  {
    id: 'combo-3',
    name: 'Combo 3: Italian Veg Feast Platter',
    category: 'combo',
    subcategory: 'combo',
    price: 300,
    originalPrice: 350,
    description: 'Italian indulgence! Rich Creamy Alfredo Pasta served alongside a sparkling Virgin Mint Mojito and molten Gooey Cheese Balls (4 pcs).',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 430,
    isVeg: true,
    inStock: true,
    calories: 1150,
    prepTime: '18 mins',
    tags: ['Save Rs.50', 'Gourmet Platter', 'Popular'],
    comboIncludes: ['Creamy Alfredo Pasta', 'Virgin Mint Mojito', 'Gooey Cheese Balls (4 pcs)']
  },
  {
    id: 'combo-4',
    name: 'Combo 4: QuickBite Crunch Platter',
    category: 'combo',
    subcategory: 'combo',
    price: 320,
    originalPrice: 380,
    description: 'Packed with savory punch! 2x Fiesta Crispy Tacos + Creamy Cold Coffee + Crispy Veg Nuggets with dips.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 380,
    isVeg: true,
    inStock: true,
    calories: 1100,
    prepTime: '16 mins',
    tags: ['Save Rs.60', 'Platter Special', 'Spicy & Sweet'],
    comboIncludes: ['2x Fiesta Crispy Tacos', 'Creamy Cold Coffee', 'Crispy Nuggets (6 pcs)']
  },
  {
    id: 'combo-5',
    name: 'Combo 5: Frozen Party Mega Box',
    category: 'combo',
    subcategory: 'combo',
    price: 499,
    originalPrice: 620,
    description: 'Ultimate group feast! 1x Paneer Tikka Gourmet Pizza + 2x Classic Crunch Burgers + Loaded Nachos + 2x Milkshakes.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 520,
    isVeg: true,
    isChefSpecial: true,
    inStock: true,
    calories: 2100,
    prepTime: '22 mins',
    tags: ['Save Rs.121', 'Party Box', 'Feast for 3-4'],
    comboIncludes: ['Paneer Tikka Pizza (8")', '2x Crunch Burgers', 'Loaded Cheesy Nachos', '2x Chocolate Shakes']
  },

  // ================= 10. DESSERTS & SUNDAES (Category: dessert, Subcategory: dessert) =================
  {
    id: 'dessert-1',
    name: 'Gudbud Royale Sundae',
    category: 'dessert',
    subcategory: 'dessert',
    price: 160,
    originalPrice: 190,
    description: 'Layered spectacle with strawberry, vanilla, and mango ice cream scoops, roasted dry fruits, jelly cubes, tutty fruity, and dark chocolate fudge.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 340,
    isVeg: true,
    isBestseller: true,
    inStock: true,
    calories: 490,
    prepTime: '5 mins',
    tags: ['Frozen Bottle Legend', 'Sundae', 'Sweet Tooth']
  },
  {
    id: 'dessert-2',
    name: 'Sizzling Brownie with Vanilla Ice Cream',
    category: 'dessert',
    subcategory: 'dessert',
    price: 140,
    originalPrice: 170,
    description: 'Warm walnut chocolate brownie served on a sizzling hot cast iron plate, topped with vanilla bean ice cream and bubbling chocolate sauce.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 490,
    isVeg: true,
    isChefSpecial: true,
    inStock: true,
    calories: 560,
    prepTime: '6 mins',
    tags: ['Sizzling', 'Warm & Cold', 'Decadent']
  },
  {
    id: 'dessert-3',
    name: 'Belgian Chocolate Waffle Crunch',
    category: 'dessert',
    subcategory: 'dessert',
    price: 130,
    originalPrice: 155,
    description: 'Freshly baked golden Belgian waffle smothered in melted milk and dark Belgian chocolate ganache, chocolate flakes, and vanilla scoop.',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 270,
    isVeg: true,
    inStock: true,
    calories: 480,
    prepTime: '8 mins',
    tags: ['Belgian Waffle', 'Crisp & Warm', 'Choco Dripping']
  },
  {
    id: 'dessert-4',
    name: 'Nutella Banana Fluffy Pancake Stack',
    category: 'dessert',
    subcategory: 'dessert',
    price: 145,
    originalPrice: 175,
    description: 'Stack of 3 warm fluffy golden pancakes smothered in warm Nutella hazelnut spread, sliced Cavendish bananas, and maple drizzle.',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 310,
    isVeg: true,
    inStock: true,
    calories: 520,
    prepTime: '8 mins',
    tags: ['Nutella Pancakes', 'Stack', 'Breakfast & Dessert']
  }
];

// Original Lucky Coupons and Discounts
export const LUCKY_COUPONS: LuckyCoupon[] = [
  {
    code: '101E',
    discountPercent: 16,
    title: 'Silver Lucky Strike',
    description: 'Get 16% discount on your entire food order!',
    isLuckyDraw: true,
    isActive: true
  },
  {
    code: '102E',
    discountPercent: 25,
    title: 'Gold Bonanza',
    description: 'Enjoy 25% discount across all food & shakes!',
    isLuckyDraw: true,
    isActive: true
  },
  {
    code: '103E',
    discountPercent: 34,
    title: 'Platinum Jackpot',
    description: 'Massive 34% discount on your delicious feast!',
    isLuckyDraw: true,
    isActive: true
  },
  {
    code: '104E',
    discountPercent: 43,
    title: 'Diamond Super Lucky',
    description: 'Super lucky! 43% off on your current cart value!',
    isLuckyDraw: true,
    isActive: true
  },
  {
    code: '105E',
    discountPercent: 7,
    title: 'Quick Treat',
    description: 'Save 7% instant cashback discount on your bill!',
    isLuckyDraw: true,
    isActive: true
  },
  {
    code: 'WELCOME20',
    discountPercent: 20,
    title: 'Store Welcome Treat',
    description: 'Flat 20% off for all first-time visitors',
    isLuckyDraw: false,
    isActive: true
  },
  {
    code: 'SMART10',
    discountPercent: 10,
    title: 'Smart Dine Deal',
    description: '10% off on all snacks & beverages',
    isLuckyDraw: false,
    isActive: true
  },
  {
    code: 'VIP50',
    discountPercent: 50,
    title: 'Admin VIP Mega Deal',
    description: 'Special 50% privilege discount on all orders',
    isLuckyDraw: false,
    isActive: true
  }
];
