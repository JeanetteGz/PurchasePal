
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 justify-center">
        <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
        <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/30 px-4 py-3 rounded-2xl shadow-lg">
          <Grid3X3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Categories ({Object.keys(wantsByCategory).length})
          </h2>
        </div>
        <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
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
