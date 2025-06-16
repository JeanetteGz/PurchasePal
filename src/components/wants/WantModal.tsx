
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Trash2, X, Calendar, Tag, FileText } from 'lucide-react';

interface WantItem {
  id: string;
  product_name: string;
  category: string;
  product_url: string;
  product_image_url?: string;
  notes?: string;
  created_at: string;
}

interface WantModalProps {
  want: WantItem | null;
  categoryEmoji: string;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const WantModal = ({ want, categoryEmoji, onClose, onDelete }: WantModalProps) => {
  if (!want) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl border-0" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold flex items-center gap-3 text-gray-800 dark:text-gray-200">
              <span className="text-3xl">{categoryEmoji}</span>
              <span>{want.product_name}</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {want.product_image_url && (
            <div className="w-full h-80 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-purple-900/30 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={want.product_image_url}
                alt={want.product_name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-6xl">📷</div>';
                  }
                }}
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Tag className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Category:</span>
              <span className="text-gray-600 dark:text-gray-400 capitalize">
                {categoryEmoji} {want.category}
              </span>
            </div>
            
            {want.notes && (
              <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <FileText className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Notes:</span>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{want.notes}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Added:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {new Date(want.created_at).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            {want.product_url && (
              <Button
                onClick={() => window.open(want.product_url, '_blank')}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-4 text-lg rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Product
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(want.id);
                onClose();
              }}
              className="px-8 py-4 text-lg rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
