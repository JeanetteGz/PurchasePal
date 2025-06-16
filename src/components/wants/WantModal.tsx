
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Trash2 } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              {categoryEmoji} 
              <span className="font-bold">{want.product_name}</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {want.product_image_url && (
            <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={want.product_image_url}
                alt={want.product_name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 text-2xl">📷 Image not available</div>';
                  }
                }}
              />
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">📂 Category:</span> {categoryEmoji} {want.category}
            </p>
            {want.notes && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">📝 Notes:</span> {want.notes}
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">📅 Added:</span> {new Date(want.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            {want.product_url && (
              <Button
                onClick={() => window.open(want.product_url, '_blank')}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                🔗 View Product
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(want.id);
                onClose();
              }}
              className="px-6"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              🗑️ Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
