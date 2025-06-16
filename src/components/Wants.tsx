
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Heart, Sparkles, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AddWantForm } from './wants/AddWantForm';
import { WantModal } from './wants/WantModal';
import { WantsCategorySection } from './wants/WantsCategorySection';
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
  const [selectedWant, setSelectedWant] = useState<WantItem | null>(null);
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
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-xl mb-6">
            <Heart className="w-7 h-7" />
            <h1 className="text-3xl font-bold">Your Wishlist</h1>
            <Sparkles className="w-7 h-7" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Keep track of items you want to buy. Take time to think before making impulse purchases! 🤔💭
          </p>
        </div>

        {/* Search and Add Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg transition-all duration-200 text-lg"
            />
          </div>

          {/* Add Item Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl transform transition-all hover:scale-105 px-8 py-4 text-lg rounded-2xl"
            >
              <Plus className="w-6 h-6 mr-2" />
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

        {/* Product Detail Modal */}
        <WantModal
          want={selectedWant}
          categoryEmoji={selectedWant ? getCategoryEmoji(selectedWant.category) : ''}
          onClose={() => setSelectedWant(null)}
          onDelete={deleteWant}
        />

        {/* Wishlist Items by Category */}
        {Object.keys(wantsByCategory).length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800 border-0 shadow-2xl">
              <CardContent className="text-center py-16">
                <div className="text-8xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
                  {searchQuery ? 'No items found' : 'Your wishlist is empty'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {searchQuery ? 'Try a different search term' : 'Start adding items you\'d like to buy in the future! ✨'}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            {Object.entries(wantsByCategory).map(([category, items]) => (
              <WantsCategorySection
                key={category}
                category={category}
                items={items}
                categoryEmoji={getCategoryEmoji(category)}
                onViewWant={setSelectedWant}
                onDeleteWant={deleteWant}
              />
            ))}
          </div>
        )}

        {/* Stats Section */}
        {wants.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-gray-800 dark:to-purple-900/30 border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {wants.length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium">Total Items</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {Object.keys(wantsByCategory).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium">Categories</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {wants.filter(want => want.product_url).length}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium">With Links</div>
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
