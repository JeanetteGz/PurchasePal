
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AddWantForm } from './wants/AddWantForm';
import { CategoryDetailModal } from './wants/CategoryDetailModal';
import { WantsHeader } from './wants/WantsHeader';
import { WantsSearchBar } from './wants/WantsSearchBar';
import { WantsAddButton } from './wants/WantsAddButton';
import { WantsEmptyState } from './wants/WantsEmptyState';
import { WantsStatsSection } from './wants/WantsStatsSection';
import { WantsCategoriesGrid } from './wants/WantsCategoriesGrid';
import { extractImageFromUrl } from './wants/utils';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
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
      toast({
        title: "Error",
        description: "Failed to load your wishlist items",
        variant: "destructive",
      });
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
    if (!newWant.product_name || !newWant.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in the product name and category",
        variant: "destructive",
      });
      return;
    }

    setAddLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!userData.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add items to your wishlist",
          variant: "destructive",
        });
        return;
      }

      const extractedImage = newWant.product_url ? await extractImageFromUrl(newWant.product_url) : '';
      
      const { data, error } = await supabase
        .from('user_wants')
        .insert({
          product_name: newWant.product_name,
          category: newWant.category,
          product_url: newWant.product_url || '',
          product_image_url: extractedImage || newWant.product_image_url || null,
          notes: newWant.notes || null,
          user_id: userData.user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setWants(prev => [data, ...prev]);
      setNewWant({ product_name: '', category: '', product_url: '', product_image_url: '', notes: '' });
      setShowAddForm(false);
      
      toast({
        title: "Success!",
        description: `${data.product_name} has been added to your wishlist`,
      });
      
    } catch (error) {
      console.error('Error adding want:', error);
      toast({
        title: "Error",
        description: "Failed to add item to your wishlist. Please try again.",
        variant: "destructive",
      });
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
      
      toast({
        title: "Removed",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      console.error('Error deleting want:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from your wishlist",
        variant: "destructive",
      });
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/20 border-t-purple-500 mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <WantsHeader />

        <div className="max-w-4xl mx-auto space-y-6">
          <WantsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <WantsAddButton onAddClick={() => setShowAddForm(!showAddForm)} isLoading={addLoading} />
        </div>

        {showAddForm && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <AddWantForm
              newWant={newWant}
              onNewWantChange={setNewWant}
              onUrlChange={handleUrlChange}
              onSubmit={addWant}
              onCancel={() => setShowAddForm(false)}
              isLoading={addLoading}
            />
          </div>
        )}

        <CategoryDetailModal
          category={selectedCategory}
          items={selectedCategory ? wantsByCategory[selectedCategory] || [] : []}
          categoryEmoji={selectedCategory ? require('./wants/utils').getCategoryEmoji(selectedCategory) : ''}
          onClose={() => setSelectedCategory(null)}
          onDeleteWant={deleteWant}
        />

        {Object.keys(wantsByCategory).length === 0 ? (
          <WantsEmptyState searchQuery={searchQuery} />
        ) : (
          <WantsCategoriesGrid 
            wantsByCategory={wantsByCategory} 
            onCategoryClick={setSelectedCategory} 
          />
        )}

        <WantsStatsSection wants={wants} wantsByCategory={wantsByCategory} />
      </div>
    </div>
  );
};
