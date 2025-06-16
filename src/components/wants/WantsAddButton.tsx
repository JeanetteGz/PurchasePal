
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Sparkles } from 'lucide-react';

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
        className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105 px-6 py-3 text-base rounded-xl border-0 font-medium"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </div>
          <span>
            {isLoading ? 'Adding...' : 'Add Item'}
          </span>
          <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>
      </Button>
    </div>
  );
};
