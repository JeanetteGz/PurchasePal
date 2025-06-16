
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppNavigation } from '@/components/layout/AppNavigation';
import { AppContent } from '@/components/layout/AppContent';
import { usePurchases } from '@/hooks/usePurchases';

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
  const { purchases, loading, addPurchase, deletePurchase } = usePurchases();
  const [activeView, setActiveView] = useState("dashboard");

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
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-8">
          <AppHeader 
            userFirstName={profile?.first_name}
            onSignOut={handleSignOut}
          />

          <AppNavigation 
            activeView={activeView}
            onViewChange={setActiveView}
          />

          <AppContent
            activeView={activeView}
            purchases={purchases}
            onAddPurchase={addPurchase}
            onDeletePurchase={deletePurchase}
            onPurchaseSuccess={handlePurchaseSuccess}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
