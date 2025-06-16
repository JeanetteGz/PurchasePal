
import { Card, CardContent } from '@/components/ui/card';

interface WantsEmptyStateProps {
  searchQuery: string;
}

export const WantsEmptyState = ({ searchQuery }: WantsEmptyStateProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800 border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="text-center py-24">
          <div className="space-y-8">
            <div className="text-8xl mb-8 animate-bounce">
              {searchQuery ? '🔍' : '🎯'}
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-bold text-gray-700 dark:text-gray-200">
                {searchQuery ? 'No items found' : 'Your wishlist is empty'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed max-w-md mx-auto">
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
