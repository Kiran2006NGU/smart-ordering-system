export type CategoryType = 'all' | 'food' | 'drink' | 'snack' | 'combo' | 'dessert';

export type SubCategoryType = 
  | 'all' 
  | 'pizza' 
  | 'burger' 
  | 'sandwich' 
  | 'pasta' 
  | 'taco_wrap' 
  | 'shake' 
  | 'coffee' 
  | 'refresher' 
  | 'snack' 
  | 'dessert' 
  | 'combo';

export type DietaryType = 'veg' | 'non-veg' | 'vegan';

export interface MenuItemOption {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'food' | 'drink' | 'snack' | 'combo' | 'dessert';
  subcategory?: SubCategoryType;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isVeg: boolean;
  isSpicy?: boolean;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  inStock?: boolean;
  calories?: number;
  prepTime?: string;
  tags?: string[];
  ingredients?: string[];
  customizations?: {
    sizes?: { name: string; priceMultiplier: number }[];
    spiceLevels?: string[];
    addOns?: MenuItemOption[];
  };
  comboIncludes?: string[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: string;
  selectedSpice?: string;
  selectedAddOns?: MenuItemOption[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerDetails {
  name: string;
  mobile: string;
  email?: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  deliveryAddress?: string;
  deliveryLandmark?: string;
}

export interface LuckyCoupon {
  code: string;
  discountPercent: number;
  title: string;
  description: string;
  minOrder?: number;
  expiresIn?: string;
  isLuckyDraw?: boolean;
  isActive?: boolean;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export type OrderStatus = 
  | 'placed' 
  | 'confirmed' 
  | 'kitchen_preparing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'completed' 
  | 'cancelled';

export interface OrderRecord {
  orderId: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: CartItem[];
  originalTotal: number;
  discountAmount: number;
  couponCode?: string;
  discountPercent?: number;
  subtotalAfterDiscount: number;
  gstAmount: number; // 5% GST
  deliveryFee: number;
  finalTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  transactionId: string;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedTimeMinutes: number;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  announcement: string;
  hotline: string;
  email: string;
  address: string;
  timings: string;
  gstPercentage: number;
  deliveryFee: number;
  freeDeliveryMin: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'staff';
  loginMethod: 'google' | 'otp' | 'email' | 'admin';
  loyaltyPoints: number;
  address?: string;
}

export interface VoicePersona {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'neutral';
  accent: string;
  avatar: string;
  description: string;
  preferredLang: string[];
  preferredNames: string[];
  defaultPitch: number;
  defaultRate: number;
  samplePhrase: string;
  tag: string;
}

export interface VoiceSettings {
  enabled: boolean;
  personaId: string;
  customVoiceURI?: string;
  rate: number;
  pitch: number;
  volume: number;
}
