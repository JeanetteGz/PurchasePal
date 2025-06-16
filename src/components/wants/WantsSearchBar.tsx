
import { Search } from 'lucide-react';

interface WantsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const WantsSearchBar = ({ searchQuery, onSearchChange }: WantsSearchBarProps) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur opacity-60"></div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <input
          type="text"
          placeholder="Search your wishlist items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 shadow-lg transition-all duration-300 placeholder-gray-400"
        />
      </div>
    </div>
  );
};
