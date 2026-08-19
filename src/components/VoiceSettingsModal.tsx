import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Play, 
  Square, 
  Check, 
  Sliders, 
  Radio, 
  RotateCcw,
  Mic,
  Globe,
  Settings2,
  Zap
} from 'lucide-react';
import { VoicePersona, VoiceSettings, RestaurantInfo } from '../types';
import { DEFAULT_VOICE_SETTINGS } from '../data/voicePersonas';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSettings: VoiceSettings;
  personas: VoicePersona[];
  availableVoices: SpeechSynthesisVoice[];
  activePersona: VoicePersona;
  isSpeaking: boolean;
  restaurantInfo: RestaurantInfo;
  onUpdateSettings: (newSettings: Partial<VoiceSettings>) => void;
  onTestPersona: (personaId: string, customPhrase?: string) => void;
  onStopSpeaking: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  voiceSettings,
  personas,
  availableVoices,
  activePersona,
  isSpeaking,
  restaurantInfo,
  onUpdateSettings,
  onTestPersona,
  onStopSpeaking
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(voiceSettings.personaId);
  const [testPhrase, setTestPhrase] = useState<string>(`Welcome to ${restaurantInfo.name}! How may I serve you today?`);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectPersona = (pId: string) => {
    setSelectedPersonaId(pId);
    const persona = personas.find(p => p.id === pId);
    if (persona) {
      onUpdateSettings({ 
        personaId: pId, 
        pitch: persona.defaultPitch, 
        rate: persona.defaultRate,
        customVoiceURI: undefined // Reset explicit override to let persona matcher work
      });
      onTestPersona(pId, persona.samplePhrase);
    }
  };

  const handleResetDefaults = () => {
    setSelectedPersonaId(DEFAULT_VOICE_SETTINGS.personaId);
    onUpdateSettings({ ...DEFAULT_VOICE_SETTINGS });
    onTestPersona(DEFAULT_VOICE_SETTINGS.personaId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-5 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Voice Assistant &amp; Narration Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Multiple Voices
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose your restaurant guide voice persona, tune tempo, and preview live speech
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          
          {/* Master Enable/Disable & Status Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-amber-50/40 border border-amber-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateSettings({ enabled: !voiceSettings.enabled })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  voiceSettings.enabled ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    voiceSettings.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-900">
                  {voiceSettings.enabled ? 'Voice Narration is Active' : 'Voice Narration is Muted'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Speaks welcome greetings, menu descriptions, and order status updates
                </p>
              </div>
            </div>

            {/* Speaking animation indicator */}
            {isSpeaking ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400 text-amber-800 text-xs font-bold animate-pulse">
                <span className="flex gap-0.5 items-end h-3.5">
                  <span className="w-1 bg-amber-600 rounded-full animate-bounce h-2" />
                  <span className="w-1 bg-amber-600 rounded-full animate-bounce h-3.5 delay-75" />
                  <span className="w-1 bg-amber-600 rounded-full animate-bounce h-2.5 delay-150" />
                </span>
                <span>Speaking Now</span>
                <button
                  onClick={onStopSpeaking}
                  className="ml-1 p-0.5 hover:bg-amber-200 rounded text-amber-900"
                  title="Stop"
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onTestPersona(voiceSettings.personaId, testPhrase)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Voice</span>
              </button>
            )}
          </div>

          {/* Voice Personas Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Select Voice Persona
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                {personas.length} Distinct Styles Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {personas.map((persona) => {
                const isSelected = voiceSettings.personaId === persona.id;
                return (
                  <div
                    key={persona.id}
                    onClick={() => handleSelectPersona(persona.id)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-slate-900 truncate">
                              {persona.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md font-bold uppercase bg-slate-100 text-slate-600">
                              {persona.gender}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            {persona.tag}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-amber-700 mt-0.5">
                          {persona.accent}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                          {persona.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTestPersona(persona.id, persona.samplePhrase);
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-amber-600 transition-colors p-1"
                      >
                        <Play className="w-3 h-3 fill-current text-amber-500" />
                        <span>Preview Sample</span>
                      </button>

                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-black text-amber-600">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 group-hover:text-slate-600 font-medium">
                          Click to select
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pitch & Rate Customization Sliders */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                Fine-Tune Voice Tone &amp; Tempo
              </h4>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Sliders</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pitch */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Voice Pitch</span>
                  <span className="text-amber-600 font-mono">{voiceSettings.pitch?.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={voiceSettings.pitch}
                  onChange={(e) => onUpdateSettings({ pitch: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Deeper Baritone</span>
                  <span>Higher Pitch</span>
                </div>
              </div>

              {/* Speed / Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Speech Speed</span>
                  <span className="text-amber-600 font-mono">{voiceSettings.rate?.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.05"
                  value={voiceSettings.rate}
                  onChange={(e) => onUpdateSettings({ rate: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Calm &amp; Slow</span>
                  <span>Fast Tempo</span>
                </div>
              </div>
            </div>

            {/* Custom Preview Phrase Input */}
            <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Custom Phrase Tester</span>
                <span className="text-[10px] text-slate-400">Type anything to test with current voice</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPhrase}
                  onChange={(e) => setTestPhrase(e.target.value)}
                  placeholder="Type test sentence..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => onTestPersona(voiceSettings.personaId, testPhrase)}
                  className="px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Speak</span>
                </button>
              </div>
            </div>

            {/* Toggle Advanced Browser Voices */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <Settings2 className="w-3 h-3 text-amber-500" />
                <span>{showAdvanced ? 'Hide System TTS Voice Details' : 'Show Advanced Native Device Voices'}</span>
                <span className="text-slate-400">({availableVoices.length} detected)</span>
              </button>

              {showAdvanced && (
                <div className="mt-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                  <label className="font-bold text-slate-700 block">
                    Direct Browser Speech Synthesis Voice:
                  </label>
                  <select
                    value={voiceSettings.customVoiceURI || ''}
                    onChange={(e) => onUpdateSettings({ customVoiceURI: e.target.value || undefined })}
                    className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  >
                    <option value="">-- Use Auto-Matched Persona Engine --</option>
                    {availableVoices.map((voice) => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang}) {voice.default ? '★ System Default' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Persona: <strong className="text-slate-900">{activePersona.name}</strong> ({activePersona.accent})</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Save &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
};
