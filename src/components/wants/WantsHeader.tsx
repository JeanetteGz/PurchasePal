
import { Heart, Sparkles } from 'lucide-react';

export const WantsHeader = () => {
  return (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-3xl blur-lg opacity-30 transform scale-110"></div>
        <div className="relative inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white px-12 py-8 rounded-3xl shadow-2xl">
          <Heart className="w-10 h-10" />
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
            Your Wishlist
          </h1>
          <Sparkles className="w-10 h-10" />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-xl leading-relaxed">
        Organize your desires by category and think before you buy! 🛍️✨
      </p>
    </div>
  );
};
