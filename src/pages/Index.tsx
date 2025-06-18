
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

  console.log('Index: Component rendering, loading state:', loading);
  console.log('Index: Profile:', profile);
  console.log('Index: Purchases count:', purchases.length);

  const handlePurchaseSuccess = () => {
    setActiveView("dashboard");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    console.log('Index: Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">If this takes too long, please refresh the page</p>
        </div>
      </div>
    );
  }

  console.log('Index: Rendering main dashboard');

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 safe-area-top safe-area-bottom">
        <div className="container mx-auto max-w-md min-h-screen">
          <div className="px-4 py-6 space-y-4">
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
      </div>
    </ThemeProvider>
  );
};

export default Index;
