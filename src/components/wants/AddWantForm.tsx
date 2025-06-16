
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, X, Loader2, Sparkles } from 'lucide-react';
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
}

export const AddWantForm = ({ newWant, onNewWantChange, onUrlChange, onSubmit, onCancel }: AddWantFormProps) => {
  const [isExtractingImage, setIsExtractingImage] = useState(false);

  const handleUrlChange = async (url: string) => {
    setIsExtractingImage(true);
    await onUrlChange(url);
    setIsExtractingImage(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 pointer-events-none"></div>
        <CardHeader className="relative pb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-4 text-3xl text-purple-600 dark:text-purple-400">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Add New Item
                </span>
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
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-2xl h-12 w-12"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-8 p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newWant.product_name}
                  onChange={(e) => onNewWantChange({ ...newWant, product_name: e.target.value })}
                  className="w-full p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-purple-500/25 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg placeholder-gray-400"
                  placeholder="What's catching your eye?"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Category *
                </label>
                <select
                  value={newWant.category}
                  onChange={(e) => onNewWantChange({ ...newWant, category: e.target.value })}
                  className="w-full p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-purple-500/25 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg"
                  required
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
            
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Product URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={newWant.product_url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full p-5 pr-16 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-purple-500/25 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg placeholder-gray-400"
                  placeholder="https://... (we'll auto-detect the product image)"
                />
                {isExtractingImage && (
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                  </div>
                )}
              </div>
              {newWant.product_image_url && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-400 font-semibold flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    Product image detected and ready to display!
                  </p>
                </div>
              )}
            </div>
            
            {/* Enhanced Image Preview */}
            {newWant.product_image_url && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Image Preview
                </label>
                <div className="relative w-full h-64 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-700 dark:to-purple-900/30 rounded-2xl overflow-hidden shadow-inner border-2 border-purple-100 dark:border-purple-800">
                  <img
                    src={newWant.product_image_url}
                    alt="Product preview"
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
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Personal Notes
              </label>
              <textarea
                value={newWant.notes}
                onChange={(e) => onNewWantChange({ ...newWant, notes: e.target.value })}
                className="w-full p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-purple-500/25 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 text-lg resize-none placeholder-gray-400"
                rows={4}
                placeholder="Why do you want this? Any specific details or memories attached?"
              />
            </div>
            
            <div className="flex gap-6 pt-6">
              <Button
                type="submit"
                disabled={isExtractingImage}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6 text-xl rounded-2xl shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 font-semibold"
              >
                {isExtractingImage ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Processing Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3" />
                    Add to Wishlist
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-10 py-6 text-xl rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-semibold"
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
