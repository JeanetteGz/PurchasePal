
import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { AddPurchase } from '@/components/AddPurchase';
import { Insights } from '@/components/Insights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from "react-router-dom";

export interface Purchase {
  id: string;
  item: string;
  store: string;
  amount: number;
  trigger: string;
  date: string;
  notes?: string;
}

const Index = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: '1',
      item: 'Designer sneakers',
      store: 'Nike',
      amount: 180,
      trigger: 'stress',
      date: '2024-06-10',
      notes: 'Had a tough day at work'
    },
    {
      id: '2',
      item: 'Coffee maker',
      store: 'Target',
      amount: 85,
      trigger: 'boredom',
      date: '2024-06-08',
      notes: 'Saw it on sale and thought why not'
    },
    {
      id: '3',
      item: 'Books',
      store: 'Amazon',
      amount: 45,
      trigger: 'happiness',
      date: '2024-06-05',
      notes: 'Celebrating a small win'
    }
  ]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now().toString(),
    };
    setPurchases(prev => [newPurchase, ...prev]);
  };

  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  const handlePurchaseSuccess = () => {
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              💸 Mindful Spending 🧘‍♀️
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto md:mx-0">
              Take control of your impulsive shopping habits and discover what triggers your spending
            </p>
          </div>
          <nav className="flex gap-3 mt-4 md:mt-0">
            <Link to="/profile" className="rounded-full bg-white/70 px-4 py-2 shadow hover:bg-blue-50 transition flex items-center gap-2 text-sm font-semibold">
              <span role="img" aria-label="profile">👤</span> Profile
            </Link>
            <Link to="/settings" className="rounded-full bg-white/70 px-4 py-2 shadow hover:bg-blue-50 transition flex items-center gap-2 text-sm font-semibold">
              <span role="img" aria-label="settings">⚙️</span> Settings
            </Link>
          </nav>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur-sm rounded-2xl">
            <TabsTrigger value="dashboard" className="text-sm font-medium rounded-xl">
              📊 Dashboard
            </TabsTrigger>
            <TabsTrigger value="add" className="text-sm font-medium rounded-xl">
              ➕ Add Purchase
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-sm font-medium rounded-xl">
              🧠 Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard purchases={purchases} onDeletePurchase={deletePurchase} />
          </TabsContent>

          <TabsContent value="add">
            <AddPurchase onAddPurchase={addPurchase} onSuccess={handlePurchaseSuccess} />
          </TabsContent>

          <TabsContent value="insights">
            <Insights purchases={purchases} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
