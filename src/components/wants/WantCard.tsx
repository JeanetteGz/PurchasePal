
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, ExternalLink } from 'lucide-react';

interface WantItem {
  id: string;
  product_name: string;
  category: string;
  product_url: string;
  product_image_url?: string;
  notes?: string;
  created_at: string;
}

interface WantCardProps {
  want: WantItem;
  categoryEmoji: string;
  onView: (want: WantItem) => void;
  onDelete: (id: string) => void;
}

export const WantCard = ({ want, categoryEmoji, onView, onDelete }: WantCardProps) => {
  return (
    <Card 
      className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer rounded-2xl"
      onClick={() => onView(want)}
    >
      <div className="relative">
        {want.product_image_url ? (
          <div className="h-52 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-purple-900/30 flex items-center justify-center overflow-hidden">
            <img
              src={want.product_image_url}
              alt={want.product_name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-6xl">📷</div>';
                }
              }}
            />
          </div>
        ) : (
          <div className="h-52 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-purple-900/30 flex items-center justify-center">
            <div className="text-gray-400 text-6xl">{categoryEmoji}</div>
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {want.product_url && (
            <Button
              size="icon"
              className="bg-blue-500/90 hover:bg-blue-600 text-white shadow-lg rounded-full h-10 w-10 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(want.product_url, '_blank');
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="icon"
            className="bg-purple-500/90 hover:bg-purple-600 text-white shadow-lg rounded-full h-10 w-10 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(want);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="bg-red-500/90 hover:bg-red-600 shadow-lg rounded-full h-10 w-10 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(want.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {categoryEmoji} {want.category}
            </span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {want.product_name}
          </h4>
          {want.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {want.notes}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Added {new Date(want.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          {want.product_url && (
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <ExternalLink className="w-3 h-3" />
              <span>Link</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
