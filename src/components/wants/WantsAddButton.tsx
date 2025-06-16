
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
        className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl transform transition-all duration-300 hover:scale-105 px-12 py-8 text-xl rounded-3xl border-0"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-semibold">Add to Wishlist</span>
        </div>
      </Button>
    </div>
  );
};
