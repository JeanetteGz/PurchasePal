
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Trash2, Calendar, StickyNote, Tag } from 'lucide-react';

interface WantItem {
  id: string;
  product_name: string;
  category: string;
  product_url: string;
  product_image_url?: string;
  notes?: string;
  created_at: string;
}

interface CategoryDetailModalProps {
  category: string | null;
  items: WantItem[];
  categoryEmoji: string;
  onClose: () => void;
  onDeleteWant: (id: string) => void;
}

export const CategoryDetailModal = ({ 
  category, 
  items, 
  categoryEmoji, 
  onClose, 
  onDeleteWant 
}: CategoryDetailModalProps) => {
  if (!category) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <Card className="max-w-7xl w-full max-h-[90vh] overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-3xl border-0" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold flex items-center gap-4 text-gray-800 dark:text-gray-200">
              <span className="text-5xl">{categoryEmoji}</span>
              <div>
                <span className="capitalize">{category}</span>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {items.length} item{items.length !== 1 ? 's' : ''} in this category
                </p>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full h-12 w-12 hover:bg-white/50 dark:hover:bg-gray-700/50"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="bg-white dark:bg-gray-700/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group hover:scale-[1.02]">
                <div className="relative">
                  {item.product_image_url ? (
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 overflow-hidden">
                      <img
                        src={item.product_image_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-gray-400"><div class="text-4xl mb-2">${categoryEmoji}</div><div class="text-sm">No Image</div></div>`;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 flex flex-col items-center justify-center">
                      <div className="text-4xl mb-2">{categoryEmoji}</div>
                      <div className="text-gray-400 text-sm">No Image</div>
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="bg-red-500/90 hover:bg-red-600 shadow-lg rounded-full h-9 w-9 backdrop-blur-sm"
                      onClick={() => onDeleteWant(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-5 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 leading-tight">
                      {item.product_name}
                    </h4>
                    {item.notes && (
                      <div className="flex gap-2 items-start bg-gray-50 dark:bg-gray-600/30 p-3 rounded-xl">
                        <StickyNote className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(item.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {item.product_url && (
                    <Button
                      onClick={() => window.open(item.product_url, '_blank')}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl py-3 shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {items.length === 0 && (
            <div className="text-center py-12">
              <div className="text-8xl mb-4">{categoryEmoji}</div>
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                No items in {category}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Start adding items to this category!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
