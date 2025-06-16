
import { Heart, Sparkles } from 'lucide-react';

export const WantsHeader = () => {
  return (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-2xl blur-xl opacity-20 transform scale-110"></div>
        <div className="relative inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white px-10 py-6 rounded-2xl shadow-xl">
          <Heart className="w-8 h-8" />
          <h1 className="text-4xl font-bold">
            Your Wishlist
          </h1>
          <Sparkles className="w-8 h-8" />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
        Organize your desires by category and think before you buy! ✨
      </p>
    </div>
  );
};
