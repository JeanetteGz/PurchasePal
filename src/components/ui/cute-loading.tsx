import { ShoppingBag } from 'lucide-react';

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
          <div className={`${sizeClasses[size]} relative mx-auto mb-6`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl animate-pulse shadow-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white animate-bounce" />
            </div>
          </div>
        );
      
      case 'wishlist':
        return (
          <>
            {/* Animated logo with wishlist heart */}
            <div className={`${sizeClasses[size]} relative mx-auto mb-6`}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-2xl animate-spin shadow-xl flex items-center justify-center">
                <span className="text-white text-2xl animate-pulse">💝</span>
              </div>
            </div>
            
            {/* Clean floating items - just 3 items */}
            <div className="relative h-12 w-full overflow-hidden">
              <div className="absolute top-2 left-1/3 animate-bounce delay-100">
                <span className="text-lg">🛍️</span>
              </div>
              <div className="absolute top-4 right-1/3 animate-bounce delay-300">
                <span className="text-base">✨</span>
              </div>
              <div className="absolute top-1 left-1/2 animate-bounce delay-500">
                <span className="text-sm">🎯</span>
              </div>
            </div>
          </>
        );
      
      default:
        return (
          <>
            {/* Simple bouncing logo */}
            <div className={`${sizeClasses[size]} relative mx-auto mb-4`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg flex items-center justify-center animate-bounce">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Clean bouncing dots */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-bounce delay-200"></div>
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