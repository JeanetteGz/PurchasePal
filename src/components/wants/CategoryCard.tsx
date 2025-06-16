
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Package, ExternalLink, Calendar, Eye } from 'lucide-react';

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
      className="group cursor-pointer bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] overflow-hidden rounded-3xl relative"
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardContent className="relative p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="text-7xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                {categoryEmoji}
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-1">
                {category}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {items.length} item{items.length !== 1 ? 's' : ''} waiting
              </p>
            </div>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Enhanced Preview items */}
          <div className="flex -space-x-3 overflow-hidden">
            {items.slice(0, 5).map((item, index) => (
              <div
                key={item.id}
                className="relative inline-block h-16 w-16 rounded-2xl ring-3 ring-white dark:ring-gray-800 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden shadow-lg hover:scale-110 transition-transform duration-300"
                style={{ zIndex: 5 - index }}
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
                        parent.innerHTML = '<div class="text-2xl">📦</div>';
                      }
                    }}
                  />
                ) : (
                  <Package className="w-6 h-6 text-gray-400" />
                )}
              </div>
            ))}
            {items.length > 5 && (
              <div className="relative inline-block h-16 w-16 rounded-2xl ring-3 ring-white dark:ring-gray-800 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 shadow-lg">
                +{items.length - 5}
              </div>
            )}
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{itemsWithImages} with images</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
              <ExternalLink className="w-4 h-4 text-green-600" />
              <span className="font-medium">{itemsWithLinks} with links</span>
            </div>
          </div>

          {/* Enhanced Latest item preview */}
          {items.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-2xl p-5 mt-4 border border-gray-100 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">
                  Latest Added
                </p>
              </div>
              <p className="font-bold text-gray-800 dark:text-gray-200 truncate text-lg mb-1">
                {items[0].product_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {new Date(items[0].created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
