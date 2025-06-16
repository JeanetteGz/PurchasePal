
import { useWants } from '@/hooks/useWants';
import { WantsContent } from './wants/WantsContent';

export const Wants = () => {
  const { wants, loading, addWant, deleteWant } = useWants();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <WantsContent 
        wants={wants}
        onAddWant={addWant}
        onDeleteWant={deleteWant}
      />
    </div>
  );
};
