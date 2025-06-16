
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

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
      className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer"
      onClick={() => onView(want)}
    >
      <div className="relative">
        {want.product_image_url && (
          <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-purple-900/30 flex items-center justify-center overflow-hidden">
            <img
              src={want.product_image_url}
              alt={want.product_name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 text-4xl">📷</div>';
                }
              }}
            />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="icon"
            className="bg-purple-500/90 hover:bg-purple-600 text-white shadow-lg rounded-full h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onView(want);
            }}
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="bg-red-500/90 hover:bg-red-600 shadow-lg rounded-full h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(want.id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h4 className="text-lg text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 flex items-center gap-2">
          {categoryEmoji} 
          <span className="font-bold">{want.product_name}</span>
        </h4>
        {want.notes && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            📝 {want.notes}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            📅 Added {new Date(want.created_at).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-purple-600 dark:text-purple-400 capitalize font-medium">
              {categoryEmoji} {want.category}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
