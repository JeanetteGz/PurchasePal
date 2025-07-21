import { Heart, Sparkles, Star, ShoppingBag } from 'lucide-react';

interface CuteLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'shopping' | 'wishlist' | 'general';
}

export const CuteLoading = ({ 
  message = "Loading...", 
  size = 'md',
  variant = 'general' 
}: CuteLoadingProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderVariantContent = () => {
    switch (variant) {
      case 'shopping':
        return (
          <>
            {/* Central shopping bag */}
            <div className={`${sizeClasses[size]} relative mx-auto mb-6`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl animate-pulse shadow-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white animate-bounce" />
              </div>
            </div>
            
            {/* Floating icons */}
            <div className="relative h-16 w-full overflow-hidden">
              <div className="absolute top-2 left-1/4 animate-bounce delay-100">
                <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
              </div>
              <div className="absolute top-4 right-1/3 animate-bounce delay-300">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="absolute top-1 right-1/4 animate-bounce delay-500">
                <Star className="w-3 h-3 text-purple-400" />
              </div>
              <div className="absolute top-6 left-1/3 animate-bounce delay-700">
                <span className="text-blue-400 text-lg">💫</span>
              </div>
              <div className="absolute top-3 left-1/6 animate-bounce delay-200">
                <span className="text-pink-400 text-sm">✨</span>
              </div>
              <div className="absolute top-5 right-1/6 animate-bounce delay-600">
                <span className="text-purple-400 text-base">🎯</span>
              </div>
            </div>
          </>
        );
      
      case 'wishlist':
        return (
          <>
            {/* Central wishlist icon */}
            <div className={`${sizeClasses[size]} relative mx-auto mb-6`}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full animate-spin shadow-xl flex items-center justify-center">
                <span className="text-white text-2xl animate-pulse">🎁</span>
              </div>
            </div>
            
            {/* Floating wishlist items */}
            <div className="relative h-16 w-full overflow-hidden">
              <div className="absolute top-2 left-1/4 animate-bounce delay-100 transform">
                <span className="text-xl">👟</span>
              </div>
              <div className="absolute top-4 right-1/3 animate-bounce delay-300 transform">
                <span className="text-lg">👕</span>
              </div>
              <div className="absolute top-1 right-1/4 animate-bounce delay-500 transform">
                <span className="text-sm">💻</span>
              </div>
              <div className="absolute top-6 left-1/3 animate-bounce delay-700 transform">
                <span className="text-base">📱</span>
              </div>
              <div className="absolute top-3 left-1/6 animate-bounce delay-200 transform">
                <span className="text-lg">🎧</span>
              </div>
              <div className="absolute top-5 right-1/6 animate-bounce delay-600 transform">
                <span className="text-sm">⌚</span>
              </div>
            </div>
          </>
        );
      
      default:
        return (
          <>
            {/* Cute bouncing circles */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-bounce delay-200"></div>
            </div>
            
            {/* Floating sparkles */}
            <div className="relative h-12 w-full overflow-hidden">
              <div className="absolute top-2 left-1/4 animate-bounce delay-300">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="absolute top-1 right-1/3 animate-bounce delay-500">
                <Star className="w-3 h-3 text-pink-400" />
              </div>
              <div className="absolute top-4 right-1/4 animate-bounce delay-700">
                <Heart className="w-4 h-4 text-red-400" />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {renderVariantContent()}
      <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-300 font-medium animate-pulse mt-2`}>
        {message}
      </p>
    </div>
  );
};