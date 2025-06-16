
import { ArrowLeft } from "lucide-react";

interface ProfileHeaderProps {
  onBackToDashboard: () => void;
}

export const ProfileHeader = ({ onBackToDashboard }: ProfileHeaderProps) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/30 dark:border-gray-700/30 shadow-sm">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center">
        <button 
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:bg-white/60 dark:hover:bg-gray-700/60 px-4 py-2 rounded-full"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
