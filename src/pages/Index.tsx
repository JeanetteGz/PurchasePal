import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { AddPurchase } from '@/components/AddPurchase';
import { Insights } from '@/components/Insights';
import { Wants } from '@/components/Wants';
import { PurchaseView } from '@/components/PurchaseView';
import { Link } from "react-router-dom";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ThemeProvider } from 'next-themes';

export interface Purchase {
  id: string;
  item: string;
  store: string;
  amount: number;
  trigger: string;
  date: string;
  notes?: string;
  user_id?: string;
}

const Index = () => {
  const { profile, signOut } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeView, setActiveView] = useState("dashboard");
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
      
      // Transform the data to match the Purchase interface
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

  const handlePurchaseSuccess = () => {
    setActiveView("dashboard");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard purchases={purchases} onDeletePurchase={deletePurchase} />;
      case "add":
        return <AddPurchase onAddPurchase={addPurchase} onSuccess={handlePurchaseSuccess} />;
      case "wishlist":
        return <Wants />;
      case "insights":
        return <Insights purchases={purchases} />;
      case "purchases":
        return <PurchaseView purchases={purchases} onDeletePurchase={deletePurchase} />;
      default:
        return <Dashboard purchases={purchases} onDeletePurchase={deletePurchase} />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-8">
          <header className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="text-center md:text-left">
              <Logo size="lg" />
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0 mt-4">
                Welcome back, {profile?.first_name || 'there'}! 👋 Ready for some mindful spending?
              </p>
            </div>
            <nav className="flex gap-3 mt-4 md:mt-0">
              <Link to="/profile" className="rounded-full bg-white/70 dark:bg-gray-700/70 px-4 py-2 shadow hover:bg-blue-50 dark:hover:bg-gray-600 transition flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <span role="img" aria-label="profile">👤</span> Profile
              </Link>
              <Link to="/settings" className="rounded-full bg-white/70 dark:bg-gray-700/70 px-4 py-2 shadow hover:bg-blue-50 dark:hover:bg-gray-600 transition flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <span role="img" aria-label="settings">⚙️</span> Settings
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                className="rounded-full bg-white/70 dark:bg-gray-700/70 px-4 py-2 shadow hover:bg-red-50 dark:hover:bg-red-900/30 transition flex items-center gap-2 text-sm font-semibold border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </nav>
          </header>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Button
              onClick={() => setActiveView("dashboard")}
              variant={activeView === "dashboard" ? "default" : "outline"}
              className="p-6 h-auto flex flex-col items-center gap-2 bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
            >
              <span className="text-2xl">📊</span>
              <span className="font-medium">Dashboard</span>
            </Button>
            
            <Button
              onClick={() => setActiveView("add")}
              variant={activeView === "add" ? "default" : "outline"}
              className="p-6 h-auto flex flex-col items-center gap-2 bg-white/80 dark:bg-gray-800/80 hover:bg-green-50 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
            >
              <span className="text-2xl">➕</span>
              <span className="font-medium">Add Purchase</span>
            </Button>
            
            <Button
              onClick={() => setActiveView("purchases")}
              variant={activeView === "purchases" ? "default" : "outline"}
              className="p-6 h-auto flex flex-col items-center gap-2 bg-white/80 dark:bg-gray-800/80 hover:bg-yellow-50 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
            >
              <span className="text-2xl">🛍️</span>
              <span className="font-medium">Purchases</span>
            </Button>
            
            <Button
              onClick={() => setActiveView("wishlist")}
              variant={activeView === "wishlist" ? "default" : "outline"}
              className="p-6 h-auto flex flex-col items-center gap-2 bg-white/80 dark:bg-gray-800/80 hover:bg-purple-50 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
            >
              <span className="text-2xl">💝</span>
              <span className="font-medium">Wishlist</span>
            </Button>
            
            <Button
              onClick={() => setActiveView("insights")}
              variant={activeView === "insights" ? "default" : "outline"}
              className="p-6 h-auto flex flex-col items-center gap-2 bg-white/80 dark:bg-gray-800/80 hover:bg-orange-50 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
            >
              <span className="text-2xl">📈</span>
              <span className="font-medium">Insights</span>
            </Button>
          </div>

          {/* Content Area */}
          <div className="mb-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
