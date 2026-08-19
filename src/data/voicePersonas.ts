import { VoicePersona, VoiceSettings } from '../types';

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'priya',
    name: 'Priya',
    gender: 'female',
    accent: 'Indian English',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    description: 'Warm, hospitable and natural Indian hostess tone.',
    preferredLang: ['en-IN', 'hi-IN', 'en'],
    preferredNames: ['India', 'Priya', 'Heera', 'Rishi', 'Google हिन्दी', 'Google English (India)'],
    defaultPitch: 1.12,
    defaultRate: 1.0,
    samplePhrase: 'Namaste and welcome! We have fresh stone-baked pizzas, signature thickshakes, and lucky coupons waiting for you.',
    tag: 'Popular'
  },
  {
    id: 'james',
    name: 'James',
    gender: 'male',
    accent: 'British English',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    description: 'Refined, courteous and polite British butler styling.',
    preferredLang: ['en-GB', 'en-UK', 'en'],
    preferredNames: ['Great Britain', 'UK', 'George', 'Arthur', 'Oliver', 'Daniel'],
    defaultPitch: 0.92,
    defaultRate: 0.96,
    samplePhrase: 'Good day! It is an absolute pleasure to serve you today. May I recommend our chef special artisan platter?',
    tag: 'Classic'
  },
  {
    id: 'samantha',
    name: 'Samantha',
    gender: 'female',
    accent: 'American English',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    description: 'Smart, crystal clear and modern digital concierge.',
    preferredLang: ['en-US', 'en'],
    preferredNames: ['Samantha', 'Google US English', 'Zira', 'Jenny', 'Victoria', 'Ava'],
    defaultPitch: 1.05,
    defaultRate: 1.02,
    samplePhrase: 'Hello there! Welcome to our smart dining lounge. Your favorite dishes and instant discounts are ready to order.',
    tag: 'Concierge'
  },
  {
    id: 'chef',
    name: 'Chef Marco',
    gender: 'male',
    accent: 'Energetic Gourmet',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    description: 'Enthusiastic and passionate masterchef flavor guide.',
    preferredLang: ['en-US', 'en-GB', 'en'],
    preferredNames: ['David', 'Alex', 'Guy', 'Google', 'Fred'],
    defaultPitch: 1.08,
    defaultRate: 1.12,
    samplePhrase: 'Ciao! Fire up your taste buds with our sizzling wood-fired pizzas and loaded gourmet burgers. Bon appétit!',
    tag: 'Culinary'
  },
  {
    id: 'david',
    name: 'David',
    gender: 'male',
    accent: 'Smooth Baritone',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    description: 'Deep, calm and relaxing host voice for a luxury feel.',
    preferredLang: ['en-US', 'en-GB', 'en'],
    preferredNames: ['David', 'Mark', 'Tom', 'Google UK English Male'],
    defaultPitch: 0.78,
    defaultRate: 0.92,
    samplePhrase: 'Welcome. Take your time to relax, browse our curated gourmet menu, and enjoy our transparent billing.',
    tag: 'Calm & Deep'
  },
  {
    id: 'aria',
    name: 'Aria',
    gender: 'female',
    accent: 'Cheerful Barista',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    description: 'Bubbly, energetic, and bright morning coffeehouse mood.',
    preferredLang: ['en-US', 'en-AU', 'en'],
    preferredNames: ['Aria', 'Karen', 'Moira', 'Google English'],
    defaultPitch: 1.28,
    defaultRate: 1.08,
    samplePhrase: 'Hey there! Super happy to have you with us. Check out our ice-cold thickshakes and crispy bites!',
    tag: 'Energetic'
  }
];

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  enabled: true,
  personaId: 'priya',
  rate: 1.0,
  pitch: 1.05,
  volume: 1.0
};
