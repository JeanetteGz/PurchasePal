
import { Heart, Target } from 'lucide-react';

export const WantsHeader = () => {
  return (
    <div className="text-center space-y-4 mb-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-20 transform scale-110"></div>
        <div className="relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-xl">
          <Target className="w-6 h-6" />
          <h1 className="text-2xl font-bold">
            My Wishlist
          </h1>
          <Heart className="w-6 h-6" />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-4">
        Organize your dreams and make mindful choices ✨
      </p>
    </div>
  );
};
