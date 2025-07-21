import { useWants } from '@/hooks/useWants';
import { WantsContent } from './wants/WantsContent';
import { CuteLoading } from './ui/cute-loading';
export const Wants = () => {
  const {
    wants,
    loading,
    addWant,
    deleteWant
  } = useWants();
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <CuteLoading variant="wishlist" message="Loading your wishlist..." size="lg" />
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 bg-slate-50">
      <WantsContent wants={wants} onAddWant={addWant} onDeleteWant={deleteWant} />
    </div>;
};