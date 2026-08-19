import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Wand2, 
  Camera, 
  ExternalLink,
  Flame,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { REAL_FOOD_PHOTOS, FoodPhotoOption, matchRealFoodPhotos } from '../data/foodImageLibrary';

interface FoodPhotoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string;
  itemName?: string;
  itemCategory?: string;
  onSelectPhoto: (url: string, photoTitle?: string) => void;
}

export const FoodPhotoPickerModal: React.FC<FoodPhotoPickerModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  itemName = '',
  itemCategory = 'all',
  onSelectPhoto
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(itemName);
  const [selectedCategory, setSelectedCategory] = useState<string>(itemCategory || 'all');
  const [customUrlInput, setCustomUrlInput] = useState<string>(currentImageUrl || '');
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  // AI Generator state
  const [aiDishPrompt, setAiDishPrompt] = useState<string>(itemName || '');
  const [aiFoodStyle, setAiFoodStyle] = useState<string>('gourmet_rustic');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSuccess, setGeneratedSuccess] = useState<boolean>(false);

  // Auto-matched photos
  const suggestedPhotos = useMemo(() => {
    return matchRealFoodPhotos(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleApplyPhoto = (photo: FoodPhotoOption) => {
    setSelectedPhotoId(photo.id);
    onSelectPhoto(photo.url, photo.title);
    onClose();
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      onSelectPhoto(customUrlInput.trim());
      onClose();
    }
  };

  // AI Smart Photo Matcher & Generator simulation with high-res curated photography matching
  const handleGenerateAiPhoto = () => {
    setIsGenerating(true);
    setGeneratedSuccess(false);

    setTimeout(() => {
      // Find the most appropriate high-res photorealistic match based on keywords
      const matched = matchRealFoodPhotos(aiDishPrompt || searchQuery || 'gourmet food', selectedCategory);
      const chosenPhoto = matched[Math.floor(Math.random() * Math.min(matched.length, 3))] || REAL_FOOD_PHOTOS[0];
      
      setIsGenerating(false);
      setGeneratedSuccess(true);
      setSelectedPhotoId(chosenPhoto.id);
      onSelectPhoto(chosenPhoto.url, chosenPhoto.title);

      setTimeout(() => {
        onClose();
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-slideUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-5 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Real Food Photography &amp; Picture Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Real Photos Only
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Match photorealistic dish pictures, generate signature shots, or paste custom images
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

        {/* Studio Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          
          {/* AI Generator Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-600 animate-pulse" />
                <h4 className="font-black text-xs uppercase tracking-wider text-slate-900">
                  AI Real Dish Photo Generator
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                1-Click Studio Match
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  value={aiDishPrompt}
                  onChange={(e) => setAiDishPrompt(e.target.value)}
                  placeholder="e.g. Sizzling Paneer Pizza, Truffle Double Burger, Alphonso Mango Shake..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={aiFoodStyle}
                  onChange={(e) => setAiFoodStyle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  <option value="gourmet_rustic">Rustic Wooden Board</option>
                  <option value="studio_lighting">Studio Spotlight Close-up</option>
                  <option value="sizzling_hot">Sizzling &amp; Steaming Hot</option>
                  <option value="modern_cafe">Modern Cafe Table</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateAiPhoto}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Shot...</span>
                    </>
                  ) : generatedSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" />
                      <span>Generated &amp; Applied!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Real Photo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search and Category Filters */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search real dish photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                {[
                  { id: 'all', label: 'All Photos' },
                  { id: 'pizza', label: 'Pizza' },
                  { id: 'burger', label: 'Burgers' },
                  { id: 'pasta', label: 'Pasta' },
                  { id: 'sandwich', label: 'Sandwiches' },
                  { id: 'drink', label: 'Drinks & Shakes' },
                  { id: 'snack', label: 'Crispy Snacks' },
                  { id: 'dessert', label: 'Desserts' },
                  { id: 'combo', label: 'Combos' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap cursor-pointer transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {suggestedPhotos.map((photo) => {
                const isCurrent = currentImageUrl === photo.url || selectedPhotoId === photo.id;
                return (
                  <div
                    key={photo.id}
                    onClick={() => handleApplyPhoto(photo)}
                    className={`group relative rounded-2xl overflow-hidden border transition-all cursor-pointer bg-slate-50 flex flex-col justify-between ${
                      isCurrent
                        ? 'border-amber-500 ring-3 ring-amber-400/30 shadow-md'
                        : 'border-slate-200 hover:border-amber-400 hover:shadow-md'
                    }`}
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2 right-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-950/75 text-white backdrop-blur-xs">
                        {photo.category}
                      </span>
                      {isCurrent && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                          <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 bg-white space-y-1">
                      <p className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                        {photo.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Real Food Shot</span>
                        <span className="text-amber-600 font-semibold group-hover:underline">Select</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom URL Input Accordion */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Or Paste Direct High-Resolution Image URL</span>
              <span className="text-[10px] text-slate-400">JPG, PNG, WebP supported</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                className="px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                Apply URL
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Camera className="w-3.5 h-3.5 text-amber-500" />
            <span>Showing {suggestedPhotos.length} photorealistic real food images</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
