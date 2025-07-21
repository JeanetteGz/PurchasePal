
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
        className="group relative bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 dark:from-purple-600/20 dark:to-blue-600/20 dark:hover:from-purple-600/30 dark:hover:to-blue-600/30 backdrop-blur-md border border-purple-300/30 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 px-8 py-4 text-base rounded-2xl font-medium min-h-[56px] w-full max-w-xs"
      >
        <span className="font-semibold">
          {isLoading ? 'Adding...' : 'Add Item'}
        </span>
      </Button>
    </div>
  );
};
