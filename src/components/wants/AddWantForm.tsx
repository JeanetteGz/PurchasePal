
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, X, Loader2, Sparkles, ImageIcon } from 'lucide-react';
import { useState } from 'react';

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
  isLoading?: boolean;
}

export const AddWantForm = ({ newWant, onNewWantChange, onUrlChange, onSubmit, onCancel, isLoading = false }: AddWantFormProps) => {
  const [isExtractingImage, setIsExtractingImage] = useState(false);

  const handleUrlChange = async (url: string) => {
    setIsExtractingImage(true);
    await onUrlChange(url);
    setIsExtractingImage(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl text-gray-800 dark:text-gray-200">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <span className="font-semibold">Add New Item</span>
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                    Add something special to your wishlist
                  </span>
                </div>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl h-10 w-10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 placeholder-gray-400"
                  placeholder="What's on your wishlist?"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Category *
                </label>
                <select
                  value={newWant.category}
                  onChange={(e) => onNewWantChange({ ...newWant, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  required
                  disabled={isLoading}
                >
                  <option value="">Choose a category</option>
                  <option value="clothing">👕 Clothing & Fashion</option>
                  <option value="electronics">📱 Electronics & Tech</option>
                  <option value="books">📚 Books & Learning</option>
                  <option value="home">🏠 Home & Garden</option>
                  <option value="beauty">💄 Beauty & Personal Care</option>
                  <option value="sports">⚽ Sports & Fitness</option>
                  <option value="food">🍔 Food & Beverages</option>
                  <option value="travel">✈️ Travel & Experiences</option>
                  <option value="other">🛍️ Other</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Product URL (Optional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={newWant.product_url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 placeholder-gray-400"
                  placeholder="https://... (we'll auto-detect the product image)"
                  disabled={isLoading}
                />
                {isExtractingImage && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                  </div>
                )}
              </div>
              {newWant.product_image_url && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Product image detected successfully!
                  </p>
                </div>
              )}
            </div>
            
            {newWant.product_image_url && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Image Preview
                </label>
                <div className="relative w-full h-48 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                  <img
                    src={newWant.product_image_url}
                    alt="Product preview"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-4xl">📷</div>';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Personal Notes (Optional)
              </label>
              <textarea
                value={newWant.notes}
                onChange={(e) => onNewWantChange({ ...newWant, notes: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none placeholder-gray-400"
                rows={3}
                placeholder="Why do you want this? Any specific details?"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isExtractingImage || isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Adding to Wishlist...
                  </>
                ) : isExtractingImage ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Add to Wishlist
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-semibold"
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
