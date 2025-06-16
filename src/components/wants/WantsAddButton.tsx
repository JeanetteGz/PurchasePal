
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

interface WantsAddButtonProps {
  onAddClick: () => void;
  isLoading?: boolean;
}

export const WantsAddButton = ({ onAddClick, isLoading = false }: WantsAddButtonProps) => {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onAddClick}
        disabled={isLoading}
        className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl transform transition-all duration-300 hover:scale-105 px-8 py-4 text-lg rounded-2xl border-0"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
          </div>
          <span className="font-semibold">
            {isLoading ? 'Adding...' : 'Add to Wishlist'}
          </span>
        </div>
      </Button>
    </div>
  );
};
