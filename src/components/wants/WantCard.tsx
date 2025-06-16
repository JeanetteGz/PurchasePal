
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, ExternalLink, Calendar, Tag } from 'lucide-react';

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
    <Card className="group bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden rounded-3xl">
      <div className="relative">
        {want.product_image_url ? (
          <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
            <img
              src={want.product_image_url}
              alt={want.product_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-gray-400"><div class="text-6xl mb-2">${categoryEmoji}</div><div class="text-sm font-medium">No Image Available</div></div>`;
                }
              }}
            />
          </div>
        ) : (
          <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex flex-col items-center justify-center">
            <div className="text-6xl mb-2">{categoryEmoji}</div>
            <div className="text-gray-500 text-sm font-medium">No Image Available</div>
          </div>
        )}
        
        {/* Action buttons overlay */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            className="bg-blue-500/90 hover:bg-blue-600 text-white shadow-lg rounded-full h-10 w-10 backdrop-blur-sm"
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
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              <Tag className="w-3 h-3 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">
                {want.category}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 line-clamp-2 leading-tight">
            {want.product_name}
          </h4>
          {want.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
              {want.notes}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <Calendar className="w-3 h-3" />
          <span className="font-medium">
            Added {new Date(want.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {want.product_url && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                window.open(want.product_url, '_blank');
              }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg rounded-xl py-3 transition-all duration-200 hover:scale-[1.02]"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Website
            </Button>
          )}
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onView(want);
            }}
            className="px-6 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
