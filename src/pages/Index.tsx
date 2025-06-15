
import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { AddPurchase } from '@/components/AddPurchase';
import { Insights } from '@/components/Insights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from "react-router-dom";
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export interface Purchase {
  id: string;
  item: string;
  store: string;
  amount: number;
  trigger: string;
  date: string;
  notes?: string;
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
  "📊 Review your purchases weekly to identify patterns"
];

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
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

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

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * mindfulTips.length);
    setCurrentTipIndex(randomIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              ⏸️ PausePal 🧘‍♀️
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto md:mx-0">
              Your companion for mindful spending - pause before you purchase
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

        {/* Mindful Tips Card */}
        <Card className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 border-0 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-yellow-300" size={24} />
              <h3 className="text-xl font-bold">💜 Mindful Tips</h3>
            </div>
            <p className="text-purple-100 mb-4 leading-relaxed">
              {mindfulTips[currentTipIndex]}
            </p>
            <button
              onClick={getRandomTip}
              className="bg-white/20 hover:bg-white/30 transition-colors rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm"
            >
              ✨ Get Another Tip
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
