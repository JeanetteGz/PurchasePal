
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Package, ExternalLink, TrendingUp } from 'lucide-react';

interface WantItem {
  id: string;
  product_name: string;
  category: string;
  product_url: string;
  product_image_url?: string;
  notes?: string;
  created_at: string;
}

interface CategoryCardProps {
  category: string;
  items: WantItem[];
  categoryEmoji: string;
  onClick: () => void;
}

export const CategoryCard = ({ category, items, categoryEmoji, onClick }: CategoryCardProps) => {
  const itemsWithImages = items.filter(item => item.product_image_url).length;
  const itemsWithLinks = items.filter(item => item.product_url).length;

  return (
    <Card 
      className="group cursor-pointer bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/30 shadow-lg hover:shadow-xl hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden rounded-2xl relative h-full"
      onClick={onClick}
    >
      <CardContent className="relative p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
              {categoryEmoji}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 capitalize group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                {category}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="p-2 bg-white/20 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl group-hover:bg-white/30 dark:group-hover:bg-gray-700/40 transition-colors duration-300">
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>

        {/* Preview items */}
        <div className="flex -space-x-1 overflow-hidden mb-4">
          {items.slice(0, 3).map((item, index) => (
            <div
              key={item.id}
              className="relative inline-block h-10 w-10 rounded-lg ring-2 ring-white dark:ring-gray-800 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden shadow-sm hover:scale-110 transition-transform duration-300"
              style={{ zIndex: 3 - index }}
            >
              {item.product_image_url ? (
                <img
                  src={item.product_image_url}
                  alt={item.product_name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="text-lg">📦</div>';
                    }
                  }}
                />
              ) : (
                <Package className="w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
          {items.length > 3 && (
            <div className="relative inline-block h-10 w-10 rounded-lg ring-2 ring-white dark:ring-gray-800 bg-white/20 dark:bg-gray-700/30 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400 shadow-sm">
              +{Math.min(items.length - 3, 99)}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-2 mt-auto">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-white/20 dark:bg-gray-700/30 backdrop-blur-sm rounded-lg p-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="font-medium">{itemsWithImages} with images</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-white/20 dark:bg-gray-700/30 backdrop-blur-sm rounded-lg p-2">
            <ExternalLink className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            <span className="font-medium">{itemsWithLinks} with links</span>
          </div>
        </div>

        {/* Latest item preview */}
        {items.length > 0 && (
          <div className="bg-white/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-600/30 mt-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Latest
              </p>
            </div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 truncate text-sm mb-1">
              {items[0].product_name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(items[0].created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
