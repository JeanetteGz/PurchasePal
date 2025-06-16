
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, ExternalLink, Calendar, Tag, Heart } from 'lucide-react';

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
    <Card className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden rounded-2xl">
      <div className="relative">
        {want.product_image_url ? (
          <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
            <img
              src={want.product_image_url}
              alt={want.product_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-gray-400"><div class="text-4xl mb-2">${categoryEmoji}</div><div class="text-sm font-medium">No Image</div></div>`;
                }
              }}
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 flex flex-col items-center justify-center">
            <div className="text-4xl mb-2">{categoryEmoji}</div>
            <div className="text-gray-500 text-sm font-medium">No Image</div>
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-gray-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                {want.category}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons overlay */}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            className="bg-blue-500/90 hover:bg-blue-600 text-white shadow-md rounded-lg h-8 w-8 backdrop-blur-sm"
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
            className="bg-red-500/90 hover:bg-red-600 shadow-md rounded-lg h-8 w-8 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(want.id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 leading-tight">
            {want.product_name}
          </h4>
          {want.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
              {want.notes}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <Calendar className="w-3 h-3" />
          <span className="font-medium">
            {new Date(want.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            })}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {want.product_url && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                window.open(want.product_url, '_blank');
              }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md rounded-lg py-2 text-sm transition-all duration-200 hover:scale-[1.02]"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              Visit
            </Button>
          )}
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onView(want);
            }}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm"
          >
            <Eye className="w-3 h-3 mr-2" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
