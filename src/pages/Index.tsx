import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { AddPurchase } from '@/components/AddPurchase';
import { Insights } from '@/components/Insights';
import { Wants } from '@/components/Wants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from "react-router-dom";
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
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

const mindfulTips = [
  "💡 Wait 24 hours before making any non-essential purchase",
  "🛒 Make a shopping list and stick to it - avoid browsing",
  "💳 Leave your credit cards at home when going out for fun",
  "🤔 Ask yourself: 'Do I need this or do I just want it?'",
  "💰 Set a monthly spending limit for non-essentials",
  "📱 Delete shopping apps from your phone",
  "🧘‍♀️ Practice mindfulness - notice your emotions before buying",
  "👥 Shop with a budget-conscious friend who can keep you accountable",
  "🎯 Focus on experiences rather than material things",
  "📊 Review your purchases weekly to identify patterns",
  "⏰ Use the 30-day rule for expensive items",
  "🎨 Find free or low-cost hobbies to reduce retail therapy",
  "💝 Consider borrowing or buying second-hand first",
  "🧮 Calculate how many hours you need to work to afford something",
  "🏦 Pay with cash instead of cards to feel the transaction"
];

const Index = () => {
  const { profile, signOut } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTips, setCurrentTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
    getRandomTips();
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
    setActiveTab("dashboard");
  };

  const getRandomTips = () => {
    const shuffled = [...mindfulTips].sort(() => 0.5 - Math.random());
    setCurrentTips(shuffled.slice(0, 3));
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
  }

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
              <Link to="/profile" className="rounded-full bg-white/70 dark:bg-gray-800/70 px-4 py-2 shadow hover:bg-blue-50 dark:hover:bg-gray-700 transition flex items-center gap-2 text-sm font-semibold">
                <span role="img" aria-label="profile">👤</span> Profile
              </Link>
              <Link to="/settings" className="rounded-full bg-white/70 dark:bg-gray-800/70 px-4 py-2 shadow hover:bg-blue-50 dark:hover:bg-gray-700 transition flex items-center gap-2 text-sm font-semibold">
                <span role="img" aria-label="settings">⚙️</span> Settings
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                className="rounded-full bg-white/70 dark:bg-gray-800/70 px-4 py-2 shadow hover:bg-red-50 dark:hover:bg-red-900/30 transition flex items-center gap-2 text-sm font-semibold border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </nav>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl">
              <TabsTrigger value="dashboard" className="text-xs md:text-sm font-medium rounded-xl">
                📊 Dashboard
              </TabsTrigger>
              <TabsTrigger value="add" className="text-xs md:text-sm font-medium rounded-xl">
                ➕ Add Purchase
              </TabsTrigger>
              <TabsTrigger value="wants" className="text-xs md:text-sm font-medium rounded-xl">
                💜 Wishlist
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs md:text-sm font-medium rounded-xl">
                🧠 Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard purchases={purchases} onDeletePurchase={deletePurchase} />
            </TabsContent>

            <TabsContent value="add">
              <AddPurchase onAddPurchase={addPurchase} onSuccess={handlePurchaseSuccess} />
            </TabsContent>

            <TabsContent value="wants">
              <Wants />
            </TabsContent>

            <TabsContent value="insights">
              <Insights purchases={purchases} />
            </TabsContent>
          </Tabs>

          {/* Mindful Tips Card - Now showing 3 tips */}
          <Card className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 border-0 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="text-yellow-300" size={24} />
                <h3 className="text-xl font-bold">💜 Mindful Tips</h3>
              </div>
              <div className="space-y-3 mb-4">
                {currentTips.map((tip, index) => (
                  <p key={index} className="text-purple-100 leading-relaxed p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    {tip}
                  </p>
                ))}
              </div>
              <button
                onClick={getRandomTips}
                className="bg-white/20 hover:bg-white/30 transition-colors rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm"
              >
                ✨ Get New Tips
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
