
import { useWants } from '@/hooks/useWants';
import { WantsContent } from './wants/WantsContent';

export const Wants = () => {
  const { wants, loading, addWant, deleteWant } = useWants();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 rounded-full bg-blue-100/20 animate-pulse"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base font-medium">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      <WantsContent 
        wants={wants}
        onAddWant={addWant}
        onDeleteWant={deleteWant}
      />
    </div>
  );
};
