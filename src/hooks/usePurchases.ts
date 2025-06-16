
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Purchase } from '@/pages/Index';

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedPurchases = data.map(purchase => ({
        id: purchase.id,
        item: purchase.item,
        store: purchase.store,
        amount: Number(purchase.amount),
        trigger: purchase.trigger,
        date: purchase.date,
        notes: purchase.notes || '',
        user_id: purchase.user_id
      }));
      
      setPurchases(transformedPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPurchase = async (purchase: Omit<Purchase, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .insert({
          item: purchase.item,
          store: purchase.store,
          amount: purchase.amount,
          trigger: purchase.trigger,
          date: purchase.date,
          notes: purchase.notes || null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      const newPurchase: Purchase = {
        id: data.id,
        item: data.item,
        store: data.store,
        amount: Number(data.amount),
        trigger: data.trigger,
        date: data.date,
        notes: data.notes || '',
        user_id: data.user_id
      };
      
      setPurchases(prev => [newPurchase, ...prev]);
    } catch (error) {
      console.error('Error adding purchase:', error);
    }
  };

  const deletePurchase = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_purchases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPurchases(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  return {
    purchases,
    loading,
    addPurchase,
    deletePurchase,
    fetchPurchases
  };
};
