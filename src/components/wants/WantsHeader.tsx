import { Heart, Target } from 'lucide-react';
export const WantsHeader = () => {
  return <div className="text-center space-y-4 mb-6">
      <div className="relative">
        <div className="relative inline-flex items-center gap-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 text-purple-700 dark:text-purple-300 px-6 py-4 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-slate-50">My Wishlist </h1>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-4">
        Organize your dreams and make mindful choices
      </p>
    </div>;
};