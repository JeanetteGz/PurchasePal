
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { extractImageFromUrl } from '@/components/wants/utils';

interface WantItem {
  id: string;
  product_name: string;
  category: string;
  product_url: string;
  product_image_url?: string;
  notes?: string;
  created_at: string;
}

interface NewWant {
  product_name: string;
  category: string;
  product_url: string;
  product_image_url: string;
  notes: string;
}

export const useWants = () => {
  const { toast } = useToast();
  const [wants, setWants] = useState<WantItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWants();
  }, []);

  const fetchWants = useCallback(async () => {
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
  }, [toast]);

  const addWant = useCallback(async (newWant: NewWant): Promise<boolean> => {
    if (!newWant.product_name || !newWant.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in the product name and category",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!userData.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add items to your wishlist",
          variant: "destructive",
        });
        return false;
      }

      // Extract image in parallel with insert to speed up the process
      const extractImagePromise = newWant.product_url ? extractImageFromUrl(newWant.product_url) : Promise.resolve('');
      
      // Optimistically update UI first
      const tempId = `temp-${Date.now()}`;
      const tempWant: WantItem = {
        id: tempId,
        product_name: newWant.product_name,
        category: newWant.category,
        product_url: newWant.product_url || '',
        product_image_url: newWant.product_image_url || null,
        notes: newWant.notes || null,
        created_at: new Date().toISOString()
      };
      
      setWants(prev => [tempWant, ...prev]);

      const extractedImage = await extractImagePromise;
      
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
      
      // Replace temp item with real item
      setWants(prev => prev.map(want => want.id === tempId ? data : want));
      
      toast({
        title: "Success!",
        description: `${data.product_name} has been added to your wishlist`,
      });
      
      return true;
    } catch (error) {
      console.error('Error adding want:', error);
      // Remove temp item on error
      setWants(prev => prev.filter(want => !want.id.startsWith('temp-')));
      toast({
        title: "Error",
        description: "Failed to add item to your wishlist. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const deleteWant = useCallback(async (id: string) => {
    // Optimistically remove from UI
    const itemToDelete = wants.find(want => want.id === id);
    setWants(prev => prev.filter(want => want.id !== id));

    try {
      const { error } = await supabase
        .from('user_wants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Removed",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      console.error('Error deleting want:', error);
      // Restore item on error
      if (itemToDelete) {
        setWants(prev => [itemToDelete, ...prev]);
      }
      toast({
        title: "Error",
        description: "Failed to remove item from your wishlist",
        variant: "destructive",
      });
    }
  }, [wants, toast]);

  return {
    wants,
    loading,
    addWant,
    deleteWant,
    fetchWants
  };
};
