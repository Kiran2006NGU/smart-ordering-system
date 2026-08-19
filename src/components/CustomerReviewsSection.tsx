import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { RestaurantInfo } from '../types';

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  orderedItems: string[];
  likes: number;
  verified: boolean;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Aarav Sharma',
    rating: 5,
    date: 'Yesterday',
    comment: 'The Artisan Truffle & Burrata pizza was heavenly! Crust was thin and crispy with a deep wood-fired aroma. Delivered in just 18 mins piping hot.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    orderedItems: ['Artisan Truffle & Burrata Pizza', 'Belgian Chocolate Shake'],
    likes: 24,
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Priya Patel',
    rating: 5,
    date: '2 days ago',
    comment: 'Best thick shakes in the city hands down! Super creamy, not overly sweet. The lucky coupon game gave me a 20% discount on my first order too!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    orderedItems: ['Belgian Dark Chocolate Thick Shake', 'Crispy Peri Peri Paneer Burger'],
    likes: 19,
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Rohan Deshmukh',
    rating: 5,
    date: '3 days ago',
    comment: 'Seamless ordering experience. The live AI assistant guided me to pick the right combo for 4 people and saved us Rs. 150. Highly recommended!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
    orderedItems: ['Burger + Fries + Milkshake Combo', 'Cheesy Garlic Bread'],
    likes: 15,
    verified: true
  }
];

export const CustomerReviewsSection: React.FC<{ restaurantInfo: RestaurantInfo }> = ({ restaurantInfo }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [likesMap, setLikesMap] = useState<Record<string, boolean>>({});
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');

  const handleLike = (id: string) => {
    const isLiked = likesMap[id];
    setLikesMap(prev => ({ ...prev, [id]: !isLiked }));
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, likes: isLiked ? r.likes - 1 : r.likes + 1 };
      }
      return r;
    }));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newAuthor}`,
      orderedItems: ['Chef Special Recommendation'],
      likes: 1,
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setNewAuthor('');
    setNewComment('');
    setShowReviewModal(false);
  };

  return (
    <section className="mx-4 sm:mx-6 lg:mx-8 my-8 select-none">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Verified Customer Reviews &amp; Ratings
              </h2>
              <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Authentic
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Read real feedback from over 2,400+ satisfied foodies at {restaurantInfo.name}
            </p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Ratings Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
          
          {/* Average Score Box */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-200">
            <span className="text-5xl font-black text-slate-900 tracking-tight">4.9</span>
            <div className="flex items-center gap-1 text-amber-400 my-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">Based on 2,418 ratings</span>
          </div>

          {/* Star Breakdown Bars */}
          <div className="md:col-span-8 space-y-2">
            {[
              { stars: 5, pct: 92, count: '2,224' },
              { stars: 4, pct: 6, count: '145' },
              { stars: 3, pct: 1.5, count: '36' },
              { stars: 2, pct: 0.3, count: '8' },
              { stars: 1, pct: 0.2, count: '5' }
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="w-7">{bar.stars} ★</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bar.pct}%` }} />
                </div>
                <span className="w-12 text-right text-slate-400 text-[11px]">{bar.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img src={rev.avatar} alt={rev.author} className="w-9 h-9 rounded-full bg-slate-100" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                        <span>{rev.author}</span>
                        {rev.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-current text-white" />}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Ordered Items Tag */}
                {rev.orderedItems && rev.orderedItems.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {rev.orderedItems.map((dish, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        🍴 {dish}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Helpfulness */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                <span>Verified Purchase</span>
                <button
                  onClick={() => handleLike(rev.id)}
                  className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                    likesMap[rev.id] ? 'text-orange-600' : 'hover:text-slate-700'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${likesMap[rev.id] ? 'fill-current' : ''}`} />
                  <span>Helpful ({rev.likes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Share Your Experience</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`p-1.5 rounded-lg text-amber-400 cursor-pointer ${
                        newRating >= star ? 'scale-110' : 'opacity-40'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Review Comments</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How was the food, taste, packaging and delivery speed?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md cursor-pointer transition-all"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
