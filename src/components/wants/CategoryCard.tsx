
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
      className="group cursor-pointer bg-gradient-to-br from-white/20 via-purple-50/20 to-blue-50/20 dark:from-gray-800/20 dark:via-purple-900/10 dark:to-blue-900/10 backdrop-blur-md border border-white/30 dark:border-gray-600/30 shadow-lg hover:shadow-xl hover:from-white/30 hover:via-purple-50/30 hover:to-blue-50/30 dark:hover:from-gray-800/30 dark:hover:via-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden rounded-2xl relative h-full"
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
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 capitalize group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                {category}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="p-2 bg-purple-100/30 dark:bg-purple-900/20 backdrop-blur-sm rounded-xl group-hover:bg-purple-200/40 dark:group-hover:bg-purple-800/30 transition-colors duration-300">
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
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
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-blue-100/30 dark:bg-blue-900/20 backdrop-blur-sm rounded-lg p-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-medium">{itemsWithImages} with images</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-green-100/30 dark:bg-green-900/20 backdrop-blur-sm rounded-lg p-2">
            <ExternalLink className="w-3 h-3 text-green-600" />
            <span className="font-medium">{itemsWithLinks} with links</span>
          </div>
        </div>

        {/* Latest item preview */}
        {items.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50/30 to-blue-50/30 dark:from-purple-900/20 dark:to-blue-900/20 backdrop-blur-sm rounded-lg p-3 border border-purple-200/30 dark:border-purple-700/30 mt-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-purple-500" />
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wide">
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
