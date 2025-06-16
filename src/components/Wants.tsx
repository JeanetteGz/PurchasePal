
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Heart, Sparkles, Search, Grid3X3, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AddWantForm } from './wants/AddWantForm';
import { CategoryCard } from './wants/CategoryCard';
import { CategoryDetailModal } from './wants/CategoryDetailModal';
import { getCategoryEmoji, extractImageFromUrl } from './wants/utils';

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleUrlChange = async (url: string) => {
    setNewWant(prev => ({ ...prev, product_url: url }));
    
    if (url) {
      const extractedImage = await extractImageFromUrl(url);
      if (extractedImage) {
        setNewWant(prev => ({ ...prev, product_image_url: extractedImage }));
      }
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
          product_image_url: extractedImage || newWant.product_image_url || null,
          notes: newWant.notes || null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setWants(prev => [data, ...prev]);
      setNewWant({ product_name: '', category: '', product_url: '', product_image_url: '', notes: '' });
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

  // Filter wants based on search query
  const filteredWants = wants.filter(want =>
    want.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    want.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    want.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered wants by category
  const wantsByCategory = filteredWants.reduce((acc, want) => {
    const category = want.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(want);
    return acc;
  }, {} as Record<string, WantItem[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white px-10 py-6 rounded-3xl shadow-2xl mb-8">
            <Heart className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Your Wishlist</h1>
            <Sparkles className="w-8 h-8" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-xl leading-relaxed">
            Organize your desires by category. Take time to think before making impulse purchases! 🤔💭
          </p>
        </div>

        {/* Search and Add Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search across all categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-xl transition-all duration-200 text-lg"
            />
          </div>

          {/* Add Item Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl transform transition-all hover:scale-105 px-10 py-6 text-xl rounded-3xl"
            >
              <Plus className="w-7 h-7 mr-3" />
              Add to Wishlist
            </Button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="animate-fade-in">
            <AddWantForm
              newWant={newWant}
              onNewWantChange={setNewWant}
              onUrlChange={handleUrlChange}
              onSubmit={addWant}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Category Detail Modal */}
        <CategoryDetailModal
          category={selectedCategory}
          items={selectedCategory ? wantsByCategory[selectedCategory] || [] : []}
          categoryEmoji={selectedCategory ? getCategoryEmoji(selectedCategory) : ''}
          onClose={() => setSelectedCategory(null)}
          onDeleteWant={deleteWant}
        />

        {/* Category Cards */}
        {Object.keys(wantsByCategory).length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800 border-0 shadow-2xl rounded-3xl">
              <CardContent className="text-center py-20">
                <div className="text-9xl mb-8">🎯</div>
                <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-6">
                  {searchQuery ? 'No items found' : 'Your wishlist is empty'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed">
                  {searchQuery ? 'Try a different search term' : 'Start organizing your future purchases by category! ✨'}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-3 justify-center">
              <Grid3X3 className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Categories ({Object.keys(wantsByCategory).length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {Object.entries(wantsByCategory).map(([category, items]) => (
                <CategoryCard
                  key={category}
                  category={category}
                  items={items}
                  categoryEmoji={getCategoryEmoji(category)}
                  onClick={() => setSelectedCategory(category)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Stats Section */}
        {wants.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <Card className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 dark:from-gray-800 dark:via-purple-900/30 dark:to-gray-800 border-0 shadow-2xl rounded-3xl">
              <CardContent className="p-10">
                <div className="flex items-center gap-3 justify-center mb-8">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Wishlist Statistics
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                  <div className="bg-white dark:bg-gray-700/50 rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {wants.length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold">Total Items</div>
                  </div>
                  <div className="bg-white dark:bg-gray-700/50 rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {Object.keys(wantsByCategory).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold">Categories</div>
                  </div>
                  <div className="bg-white dark:bg-gray-700/50 rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {wants.filter(want => want.product_url).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold">With Links</div>
                  </div>
                  <div className="bg-white dark:bg-gray-700/50 rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {wants.filter(want => want.product_image_url).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold">With Images</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
