
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
  const [addLoading, setAddLoading] = useState(false);
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
      try {
        const extractedImage = await extractImageFromUrl(url);
        if (extractedImage) {
          setNewWant(prev => ({ ...prev, product_image_url: extractedImage }));
        }
      } catch (error) {
        console.error('Error extracting image:', error);
      }
    }
  };

  const addWant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWant.product_name || !newWant.category) return;

    setAddLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const extractedImage = newWant.product_url ? await extractImageFromUrl(newWant.product_url) : '';
      
      const { data, error } = await supabase
        .from('user_wants')
        .insert({
          product_name: newWant.product_name,
          category: newWant.category,
          product_url: newWant.product_url || '',
          product_image_url: extractedImage || newWant.product_image_url || null,
          notes: newWant.notes || null,
          user_id: userData.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setWants(prev => [data, ...prev]);
      setNewWant({ product_name: '', category: '', product_url: '', product_image_url: '', notes: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding want:', error);
    } finally {
      setAddLoading(false);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Modern Header */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-3xl blur-lg opacity-30 transform scale-110"></div>
            <div className="relative inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white px-12 py-8 rounded-3xl shadow-2xl">
              <Heart className="w-10 h-10" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                Your Wishlist
              </h1>
              <Sparkles className="w-10 h-10" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-xl leading-relaxed">
            Organize your desires by category and think before you buy! 🛍️✨
          </p>
        </div>

        {/* Enhanced Search and Add Section */}
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Modern Search Bar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 z-10" />
              <input
                type="text"
                placeholder="Search across all your wishlist items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-20 pr-8 py-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-purple-100 dark:border-purple-900/50 rounded-3xl focus:ring-4 focus:ring-purple-500/25 focus:border-purple-400 shadow-xl transition-all duration-300 text-lg placeholder-gray-400"
              />
            </div>
          </div>

          {/* Enhanced Add Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              disabled={addLoading}
              className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl transform transition-all duration-300 hover:scale-105 px-12 py-8 text-xl rounded-3xl border-0"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-semibold">Add to Wishlist</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Add Form with Animation */}
        {showAddForm && (
          <div className="animate-fade-in max-w-4xl mx-auto">
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

        {/* Enhanced Category Cards or Empty State */}
        {Object.keys(wantsByCategory).length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800 border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="text-center py-24">
                <div className="space-y-8">
                  <div className="text-8xl mb-8 animate-bounce">
                    {searchQuery ? '🔍' : '🎯'}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-bold text-gray-700 dark:text-gray-200">
                      {searchQuery ? 'No items found' : 'Your wishlist is empty'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed max-w-md mx-auto">
                      {searchQuery 
                        ? 'Try a different search term or add more items to your wishlist' 
                        : 'Start organizing your future purchases by category! Click the button above to add your first item ✨'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            <div className="flex items-center gap-4 justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
                <Grid3X3 className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Categories ({Object.keys(wantsByCategory).length})
                </h2>
              </div>
              <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
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
          <div className="max-w-6xl mx-auto pt-16">
            <Card className="bg-gradient-to-r from-purple-100/80 via-pink-100/80 to-purple-100/80 dark:from-gray-800/90 dark:via-purple-900/40 dark:to-gray-800/90 border-0 shadow-2xl rounded-3xl backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="flex items-center gap-4 justify-center mb-10">
                  <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    Wishlist Insights
                  </h3>
                  <div className="h-1 w-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                  <div className="bg-white/70 dark:bg-gray-700/60 rounded-3xl p-8 shadow-xl backdrop-blur-sm transform hover:scale-105 transition-transform">
                    <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                      {wants.length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">Total Items</div>
                  </div>
                  <div className="bg-white/70 dark:bg-gray-700/60 rounded-3xl p-8 shadow-xl backdrop-blur-sm transform hover:scale-105 transition-transform">
                    <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                      {Object.keys(wantsByCategory).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">Categories</div>
                  </div>
                  <div className="bg-white/70 dark:bg-gray-700/60 rounded-3xl p-8 shadow-xl backdrop-blur-sm transform hover:scale-105 transition-transform">
                    <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                      {wants.filter(want => want.product_url).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">With Links</div>
                  </div>
                  <div className="bg-white/70 dark:bg-gray-700/60 rounded-3xl p-8 shadow-xl backdrop-blur-sm transform hover:scale-105 transition-transform">
                    <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                      {wants.filter(want => want.product_image_url).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">With Images</div>
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
