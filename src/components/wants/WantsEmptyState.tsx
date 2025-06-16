
import { Card, CardContent } from '@/components/ui/card';

interface WantsEmptyStateProps {
  searchQuery: string;
}

export const WantsEmptyState = ({ searchQuery }: WantsEmptyStateProps) => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="text-center py-16">
          <div className="space-y-6">
            <div className="text-6xl mb-6 animate-bounce">
              {searchQuery ? '🔍' : '🎯'}
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                {searchQuery ? 'No items found' : 'Your wishlist is empty'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
                {searchQuery 
                  ? 'Try a different search term or add more items to your wishlist' 
                  : 'Start organizing your future purchases by category! Click the button above to add your first item ✨'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
