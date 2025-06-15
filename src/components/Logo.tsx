
import React from 'react';
import { Pause } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const iconSizeClasses = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Just pause button */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg`}>
        <Pause 
          size={iconSizeClasses[size]} 
          className="text-white" 
          fill="currentColor"
        />
      </div>
      
      {/* App Name */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight`}>
            PausePal
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Mindful Spending</p>
          )}
        </div>
      )}
    </div>
  );
};
