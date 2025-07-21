
import { Grid3X3 } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { getCategoryEmoji } from './utils';

interface WantItem {
  id: string;
  product_name: string;
  category: string;
  product_url: string;
  product_image_url?: string;
  notes?: string;
  created_at: string;
}

interface WantsCategoriesGridProps {
  wantsByCategory: Record<string, WantItem[]>;
  onCategoryClick: (category: string) => void;
}

export const WantsCategoriesGrid = ({ wantsByCategory, onCategoryClick }: WantsCategoriesGridProps) => {
  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12 animate-fade-in px-4">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 justify-center">
        <div className="h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        <div className="flex items-center gap-2 sm:gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 rounded-2xl shadow-lg">
          <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
            Categories ({Object.keys(wantsByCategory).length})
          </h2>
        </div>
        <div className="h-1 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
        {Object.entries(wantsByCategory).map(([category, items]) => (
          <CategoryCard
            key={category}
            category={category}
            items={items}
            categoryEmoji={getCategoryEmoji(category)}
            onClick={() => onCategoryClick(category)}
          />
        ))}
      </div>
    </div>
  );
};
