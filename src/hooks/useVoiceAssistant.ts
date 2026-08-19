import { useState, useEffect, useCallback, useRef } from 'react';
import { VoicePersona, VoiceSettings } from '../types';
import { VOICE_PERSONAS, DEFAULT_VOICE_SETTINGS } from '../data/voicePersonas';

export function useVoiceAssistant() {
  const [voiceSettings, setVoiceSettingsState] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem('fb_voice_settings');
    if (saved) {
      try {
        return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {}
    }
    // Check legacy voice enabled flag if present
    const legacyEnabled = localStorage.getItem('fb_voice_enabled');
    if (legacyEnabled !== null) {
      return { ...DEFAULT_VOICE_SETTINGS, enabled: legacyEnabled === 'true' };
    }
    return DEFAULT_VOICE_SETTINGS;
  });

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Synchronize browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Save settings on update
  const updateVoiceSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setVoiceSettingsState(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('fb_voice_settings', JSON.stringify(updated));
      localStorage.setItem('fb_voice_enabled', String(updated.enabled));
      return updated;
    });
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceSettingsState(prev => {
      const next = !prev.enabled;
      const updated = { ...prev, enabled: next };
      localStorage.setItem('fb_voice_settings', JSON.stringify(updated));
      localStorage.setItem('fb_voice_enabled', String(next));
      if (!next && synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      return updated;
    });
  }, []);

  // Find the best voice match based on persona or custom voice URI
  const findMatchingVoice = useCallback((personaId: string, customVoiceURI?: string): SpeechSynthesisVoice | undefined => {
    if (availableVoices.length === 0) return undefined;

    // 1. If explicit custom voice URI is set
    if (customVoiceURI) {
      const match = availableVoices.find(v => v.voiceURI === customVoiceURI);
      if (match) return match;
    }

    const persona = VOICE_PERSONAS.find(p => p.id === personaId) || VOICE_PERSONAS[0];

    // 2. Try match preferred voice names
    for (const prefName of persona.preferredNames) {
      const match = availableVoices.find(v => 
        v.name.toLowerCase().includes(prefName.toLowerCase())
      );
      if (match) return match;
    }

    // 3. Try match preferred languages
    for (const lang of persona.preferredLang) {
      const match = availableVoices.find(v => 
        v.lang.toLowerCase().replace('_', '-').startsWith(lang.toLowerCase().replace('_', '-'))
      );
      if (match) return match;
    }

    // 4. Match gender heuristic if voice name contains gender
    if (persona.gender === 'female') {
      const match = availableVoices.find(v => 
        v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Siri'))
      );
      if (match) return match;
    } else if (persona.gender === 'male') {
      const match = availableVoices.find(v => 
        v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('David') || v.name.includes('George') || v.name.includes('Guy'))
      );
      if (match) return match;
    }

    // 5. Fallback to any English voice
    return availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
  }, [availableVoices]);

  const activePersona = VOICE_PERSONAS.find(p => p.id === voiceSettings.personaId) || VOICE_PERSONAS[0];

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback((text: string, force = false, overridePersonaId?: string) => {
    if (!voiceSettings.enabled && !force) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      const synth = window.speechSynthesis;
      synth.cancel(); // Cancel ongoing speech

      const targetPersonaId = overridePersonaId || voiceSettings.personaId;
      const targetPersona = VOICE_PERSONAS.find(p => p.id === targetPersonaId) || activePersona;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSettings.rate || targetPersona.defaultRate;
      utterance.pitch = voiceSettings.pitch || targetPersona.defaultPitch;
      utterance.volume = voiceSettings.volume ?? 1.0;

      const matchedVoice = findMatchingVoice(targetPersonaId, voiceSettings.customVoiceURI);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setLastSpokenText(text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not available or blocked:', e);
      setIsSpeaking(false);
    }
  }, [voiceSettings, activePersona, findMatchingVoice]);

  // Test preview of a specific persona
  const testPersona = useCallback((personaId: string, customPhrase?: string) => {
    const persona = VOICE_PERSONAS.find(p => p.id === personaId) || VOICE_PERSONAS[0];
    const phrase = customPhrase || persona.samplePhrase;
    speak(phrase, true, personaId);
  }, [speak]);

  const speakWelcome = useCallback((name?: string, restaurantName?: string) => {
    const store = restaurantName || 'our restaurant';
    if (name) {
      speak(`Hello ${name}. Welcome to ${store}! How can I help you dine today?`);
    } else {
      speak(`Welcome to ${store}! Explore our chef special combos and lucky discounts.`);
    }
  }, [speak]);

  const speakCategory = useCallback((category: string) => {
    switch (category) {
      case 'food':
        speak("Food Menu. Stone-baked pizzas, smash burgers, grilled sandwiches, and pasta.");
        break;
      case 'drink':
        speak("Drink Menu. Thick milkshakes, sparkling refreshers, and creamy cold coffees.");
        break;
      case 'snack':
        speak("Snack Menu. Golden french fries, crispy nuggets, loaded nachos, and cheese balls.");
        break;
      case 'combo':
        speak("Chef Combos. Feast platters and duo meal combos with special combo savings.");
        break;
      case 'dessert':
        speak("Dessert Menu. Sizzling walnut brownie, New York cheesecake, and Belgian waffles.");
        break;
      default:
        speak("Browsing all delicious menu items.");
    }
  }, [speak]);

  const speakItemAdded = useCallback((itemName: string, qty: number) => {
    speak(`Added ${qty} ${itemName} to your order.`);
  }, [speak]);

  const speakLuckyCoupon = useCallback((code: string, discount: number) => {
    speak(`Congratulations! You unlocked a lucky coupon. Code is ${code} for ${discount} percent discount!`);
  }, [speak]);

  const speakCouponApplied = useCallback((discountAmount: number) => {
    speak(`Coupon applied! You saved ${discountAmount} rupees on this order.`);
  }, [speak]);

  const speakCheckout = useCallback(() => {
    speak("Here is your final order summary and tax invoice breakdown.");
  }, [speak]);

  const speakOrderSuccess = useCallback((orderNumber: string, restaurantName?: string) => {
    const store = restaurantName || 'our restaurant';
    speak(`Order ${orderNumber} placed successfully! Thank you for ordering from ${store}. Please enjoy your meal!`);
  }, [speak]);

  return {
    voiceEnabled: voiceSettings.enabled,
    voiceSettings,
    activePersona,
    personas: VOICE_PERSONAS,
    availableVoices,
    isSpeaking,
    lastSpokenText,
    toggleVoice,
    updateVoiceSettings,
    stopSpeaking,
    testPersona,
    speak,
    speakWelcome,
    speakCategory,
    speakItemAdded,
    speakLuckyCoupon,
    speakCouponApplied,
    speakCheckout,
    speakOrderSuccess
  };
}
