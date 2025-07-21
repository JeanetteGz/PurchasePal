
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
        className="group relative bg-white/10 hover:bg-white/20 dark:bg-gray-800/10 dark:hover:bg-gray-800/20 backdrop-blur-md border border-white/20 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 px-8 py-4 text-base rounded-2xl font-medium min-h-[56px] w-full max-w-xs"
      >
        <span className="font-semibold">
          {isLoading ? 'Adding...' : 'Add Item'}
        </span>
      </Button>
    </div>
  );
};
