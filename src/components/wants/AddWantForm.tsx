
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

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
    <Card className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
          <ShoppingBag className="w-5 h-5" />
          ➕ Add New Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🛍️ Product Name *
              </label>
              <input
                type="text"
                value={newWant.product_name}
                onChange={(e) => onNewWantChange({ ...newWant, product_name: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="What do you want?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📂 Category *
              </label>
              <select
                value={newWant.category}
                onChange={(e) => onNewWantChange({ ...newWant, category: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔗 Product URL
            </label>
            <input
              type="url"
              value={newWant.product_url}
              onChange={(e) => onUrlChange(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://... (image will be auto-detected for Amazon)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📝 Notes
            </label>
            <textarea
              value={newWant.notes}
              onChange={(e) => onNewWantChange({ ...newWant, notes: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Why do you want this? Any specific details?"
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              ➕ Add to Wishlist
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
