
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, X } from 'lucide-react';

interface NewWant {
  product_name: string;
  category: string;
  product_url: string;
  product_image_url: string;
  notes: string;
}

interface AddWantFormProps {
  newWant: NewWant;
  onNewWantChange: (want: NewWant) => void;
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const AddWantForm = ({ newWant, onNewWantChange, onUrlChange, onSubmit, onCancel }: AddWantFormProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl text-purple-600 dark:text-purple-400">
              <ShoppingBag className="w-6 h-6" />
              Add New Item
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newWant.product_name}
                  onChange={(e) => onNewWantChange({ ...newWant, product_name: e.target.value })}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg"
                  placeholder="What do you want?"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Category *
                </label>
                <select
                  value={newWant.category}
                  onChange={(e) => onNewWantChange({ ...newWant, category: e.target.value })}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg"
                  required
                >
                  <option value="">Select category</option>
                  <option value="clothing">👕 Clothing</option>
                  <option value="electronics">📱 Electronics</option>
                  <option value="books">📚 Books</option>
                  <option value="home">🏠 Home</option>
                  <option value="beauty">💄 Beauty</option>
                  <option value="sports">⚽ Sports</option>
                  <option value="food">🍔 Food</option>
                  <option value="travel">✈️ Travel</option>
                  <option value="other">🛍️ Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Product URL
              </label>
              <input
                type="url"
                value={newWant.product_url}
                onChange={(e) => onUrlChange(e.target.value)}
                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg"
                placeholder="https://... (image will be auto-detected for Amazon)"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                value={newWant.notes}
                onChange={(e) => onNewWantChange({ ...newWant, notes: e.target.value })}
                className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg resize-none"
                rows={4}
                placeholder="Why do you want this? Any specific details?"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 text-lg rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                Add to Wishlist
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-8 py-4 text-lg rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
