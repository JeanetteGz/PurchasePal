
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Package, ExternalLink } from 'lucide-react';

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
      className="group cursor-pointer bg-gradient-to-br from-white via-white to-purple-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-purple-900/20 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden rounded-3xl"
      onClick={onClick}
    >
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-6xl filter drop-shadow-lg">
              {categoryEmoji}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {category}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {items.length} item{items.length !== 1 ? 's' : ''} in wishlist
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-200" />
        </div>

        <div className="space-y-4">
          {/* Preview items */}
          <div className="flex -space-x-2 overflow-hidden">
            {items.slice(0, 4).map((item, index) => (
              <div
                key={item.id}
                className="relative inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-purple-900/30 flex items-center justify-center overflow-hidden"
                style={{ zIndex: 4 - index }}
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
                        parent.innerHTML = '<div class="text-xl">📦</div>';
                      }
                    }}
                  />
                ) : (
                  <Package className="w-5 h-5 text-gray-400" />
                )}
              </div>
            ))}
            {items.length > 4 && (
              <div className="relative inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                +{items.length - 4}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{itemsWithImages} with images</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <ExternalLink className="w-3 h-3" />
              <span>{itemsWithLinks} with links</span>
            </div>
          </div>

          {/* Latest item preview */}
          {items.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Latest added:</p>
              <p className="font-medium text-gray-700 dark:text-gray-300 truncate">
                {items[0].product_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(items[0].created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
