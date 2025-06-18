
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Sparkles } from 'lucide-react';

interface WantsAddButtonProps {
  onAddClick: () => void;
  isLoading?: boolean;
}

export const WantsAddButton = ({ onAddClick, isLoading = false }: WantsAddButtonProps) => {
  return (
    <div className="w-full flex justify-center">
      <Button
        onClick={onAddClick}
        disabled={isLoading}
        className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 px-8 py-4 text-base rounded-2xl border-0 font-medium min-h-[56px] w-full max-w-xs"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </div>
          <span className="font-semibold">
            {isLoading ? 'Adding...' : 'Add Item'}
          </span>
          <Sparkles className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>
      </Button>
    </div>
  );
};
