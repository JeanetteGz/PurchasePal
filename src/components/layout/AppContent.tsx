
import { lazy, Suspense } from 'react';
import { Purchase } from '@/pages/Index';
import { CuteLoading } from '../ui/cute-loading';

// Lazy load components for better performance
const Dashboard = lazy(() => import('@/components/Dashboard').then(module => ({ default: module.Dashboard })));
const AddPurchase = lazy(() => import('@/components/AddPurchase').then(module => ({ default: module.AddPurchase })));
const Wants = lazy(() => import('@/components/Wants').then(module => ({ default: module.Wants })));
const Insights = lazy(() => import('@/components/Insights').then(module => ({ default: module.Insights })));
const PurchaseView = lazy(() => import('@/components/PurchaseView').then(module => ({ default: module.PurchaseView })));

interface AppContentProps {
  activeView: string;
  purchases: Purchase[];
  onAddPurchase: (purchase: Omit<Purchase, 'id'>) => Promise<void>;
  onDeletePurchase: (id: string) => Promise<void>;
  onPurchaseSuccess: () => void;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <CuteLoading variant="shopping" size="md" />
  </div>
);

export const AppContent = ({ 
  activeView, 
  purchases, 
  onAddPurchase, 
  onDeletePurchase, 
  onPurchaseSuccess 
}: AppContentProps) => {
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard purchases={purchases} onDeletePurchase={onDeletePurchase} />
          </Suspense>
        );
      case "add":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AddPurchase onAddPurchase={onAddPurchase} onSuccess={onPurchaseSuccess} />
          </Suspense>
        );
      case "wishlist":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Wants />
          </Suspense>
        );
      case "insights":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Insights purchases={purchases} />
          </Suspense>
        );
      case "purchases":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PurchaseView purchases={purchases} onDeletePurchase={onDeletePurchase} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard purchases={purchases} onDeletePurchase={onDeletePurchase} />
          </Suspense>
        );
    }
  };

  return (
    <div className="mb-8 w-full">
      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
};
