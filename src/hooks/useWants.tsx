
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    console.log('useWants: Checking auth state...');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.warn('useWants: User not authenticated. Skipping fetch.');
      setWants([]);
      return;
    }

    const userId = userData.user.id;

    console.log('useWants: Fetching wants from database for user:', userId);
    const { data, error } = await supabase
      .from('user_wants')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log('useWants: Wants fetched successfully:', data);
    setWants(data || []);
  } catch (error) {
    console.error('useWants: Error fetching wants:', error);
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
    console.log('useWants: addWant called with:', newWant);
    
    if (!newWant.product_name || !newWant.category) {
      console.log('useWants: Missing required fields');
      toast({
        title: "Missing Information",
        description: "Please fill in the product name and category",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('useWants: Getting user data...');
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('useWants: User auth error:', userError);
        throw userError;
      }

      if (!userData.user) {
        console.log('useWants: User not authenticated');
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add items to your wishlist",
          variant: "destructive",
        });
        return false;
      }

      console.log('useWants: User authenticated, user ID:', userData.user.id);
      
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
      
      console.log('useWants: Adding temp item to UI:', tempWant);
      setWants(prev => [tempWant, ...prev]);

      const insertData = {
        product_name: newWant.product_name,
        category: newWant.category,
        product_url: newWant.product_url || '',
        product_image_url: newWant.product_image_url || null,
        notes: newWant.notes || null,
        user_id: userData.user.id
      };

      console.log('useWants: Inserting data to database:', insertData);
      
      const { data, error } = await supabase
        .from('user_wants')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('useWants: Database insert error:', error);
        console.error('useWants: Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('useWants: Database insert successful:', data);
      
      // Replace temp item with real item
      setWants(prev => prev.map(want => want.id === tempId ? data : want));
      
      toast({
        title: "Success!",
        description: `${data.product_name} has been added to your wishlist`,
      });
      
      return true;
    } catch (error) {
      console.error('useWants: Error adding want:', error);
      console.error('useWants: Error stack:', error.stack);
      // Remove temp item on error
      setWants(prev => prev.filter(want => !want.id.startsWith('temp-')));
      
      let errorMessage = "Failed to add item to your wishlist. Please try again.";
      if (error.message) {
        errorMessage += ` Error: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
      console.error('useWants: Error deleting want:', error);
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
