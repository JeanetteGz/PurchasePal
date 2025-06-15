import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, Trash2, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface WantItem {
  id: string;
  product_name: string;
  category: string;
  product_url: string;
  product_image_url?: string;
  notes?: string;
  created_at: string;
}

export const Wants = () => {
  const { profile } = useAuth();
  const [wants, setWants] = useState<WantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWant, setNewWant] = useState({
    product_name: '',
    category: '',
    product_url: '',
    product_image_url: '',
    notes: ''
  });

  useEffect(() => {
    fetchWants();
  }, []);

  const fetchWants = async () => {
    try {
      const { data, error } = await supabase
        .from('user_wants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWants(data || []);
    } catch (error) {
      console.error('Error fetching wants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to extract image from URL
  const extractImageFromUrl = async (url: string): Promise<string> => {
    try {
      // For Amazon URLs, try to extract product image
      if (url.includes('amazon.com')) {
        const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
        if (asinMatch) {
          return `https://images-na.ssl-images-amazon.com/images/P/${asinMatch[1]}.01.L.jpg`;
        }
      }
      
      // For other e-commerce sites, try common patterns
      if (url.includes('ebay.com')) {
        // eBay often has item images in a specific pattern
        return '';
      }
      
      return '';
    } catch (error) {
      console.error('Error extracting image:', error);
      return '';
    }
  };

  // Handle URL change and auto-fetch image
  const handleUrlChange = async (url: string) => {
    setNewWant(prev => ({ ...prev, product_url: url }));
    
    if (url) {
      const extractedImage = await extractImageFromUrl(url);
      console.log('Extracted image URL:', extractedImage);
    }
  };

  const addWant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWant.product_name || !newWant.category) return;

    try {
      const extractedImage = newWant.product_url ? await extractImageFromUrl(newWant.product_url) : '';
      
      const { data, error } = await supabase
        .from('user_wants')
        .insert({
          product_name: newWant.product_name,
          category: newWant.category,
          product_url: newWant.product_url,
          product_image_url: extractedImage || null,
          notes: newWant.notes || null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setWants(prev => [data, ...prev]);
      setNewWant({ product_name: '', category: '', product_url: '', notes: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding want:', error);
    }
  };

  const deleteWant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_wants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWants(prev => prev.filter(want => want.id !== id));
    } catch (error) {
      console.error('Error deleting want:', error);
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      clothing: '👕',
      electronics: '📱',
      books: '📚',
      home: '🏠',
      beauty: '💄',
      sports: '⚽',
      food: '🍔',
      travel: '✈️',
      other: '🛍️'
    };
    return emojiMap[category.toLowerCase()] || '🛍️';
  };

  // Group wants by category
  const wantsByCategory = wants.reduce((acc, want) => {
    const category = want.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(want);
    return acc;
  }, {} as Record<string, WantItem[]>);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg mb-4">
          <Heart className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Your Wishlist</h2>
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Keep track of items you want to buy. Take time to think before making impulse purchases!
        </p>
      </div>

      {/* Add Item Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add to Wishlist
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <ShoppingBag className="w-5 h-5" />
              Add New Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addWant} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newWant.product_name}
                    onChange={(e) => setNewWant(prev => ({ ...prev, product_name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="What do you want?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={newWant.category}
                    onChange={(e) => setNewWant(prev => ({ ...prev, category: e.target.value }))}
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
                  Product URL
                </label>
                <input
                  type="url"
                  value={newWant.product_url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://... (image will be auto-detected)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={newWant.notes}
                  onChange={(e) => setNewWant(prev => ({ ...prev, notes: e.target.value }))}
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
                  Add to Wishlist
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Wishlist Items by Category */}
      {Object.keys(wantsByCategory).length === 0 ? (
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800 border-0 shadow-xl">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 dark:text-gray-400">Start adding items you'd like to buy in the future!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
          {Object.entries(wantsByCategory).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getCategoryEmoji(category)}</span>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                  {category}
                </h3>
                <div className="bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((want) => (
                  <Card key={want.id} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                    <div className="relative">
                      {want.product_image_url && (
                        <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-purple-900/30 flex items-center justify-center overflow-hidden">
                          <img
                            src={want.product_image_url}
                            alt={want.product_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              console.log('Image failed to load:', want.product_image_url);
                              e.currentTarget.parentElement!.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', want.product_image_url);
                            }}
                          />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        {want.product_url && (
                          <Button
                            size="icon"
                            className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg rounded-full h-8 w-8"
                            onClick={() => window.open(want.product_url, '_blank')}
                          >
                            <span className="text-xs">➜</span>
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="destructive"
                          className="bg-red-500/90 hover:bg-red-600 shadow-lg rounded-full h-8 w-8"
                          onClick={() => deleteWant(want.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                        {want.product_name}
                      </h4>
                      {want.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {want.notes}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Added {new Date(want.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{getCategoryEmoji(category)}</span>
                          <span className="text-xs text-purple-600 dark:text-purple-400 capitalize font-medium">
                            {category}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
