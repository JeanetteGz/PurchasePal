
import { Search } from 'lucide-react';

interface WantsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const WantsSearchBar = ({ searchQuery, onSearchChange }: WantsSearchBarProps) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
      <div className="relative">
        <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 z-10" />
        <input
          type="text"
          placeholder="Search across all your wishlist items..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-20 pr-8 py-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-purple-100 dark:border-purple-900/50 rounded-3xl focus:ring-4 focus:ring-purple-500/25 focus:border-purple-400 shadow-xl transition-all duration-300 text-lg placeholder-gray-400"
        />
      </div>
    </div>
  );
};
