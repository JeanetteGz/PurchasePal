
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Heart, Sparkles } from 'lucide-react';
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
          Keep track of items you want to buy. Take time to think before making impulse purchases! 🤔💭
        </p>
      </div>

      {/* Add Item Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          ➕ Add to Wishlist
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <AddWantForm
          newWant={newWant}
          onNewWantChange={setNewWant}
          onUrlChange={handleUrlChange}
          onSubmit={addWant}
          onCancel={() => setShowAddForm(false)}
        />
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
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800 border-0 shadow-xl">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 dark:text-gray-400">Start adding items you'd like to buy in the future! ✨</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
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
    </div>
  );
};
