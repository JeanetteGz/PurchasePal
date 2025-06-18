
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface AppHeaderProps {
  userFirstName?: string;
  onSignOut: () => void;
}

export const AppHeader = ({ userFirstName, onSignOut }: AppHeaderProps) => {
  return (
    <header className="flex flex-col space-y-3 mb-4 px-3 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-3">
        <div className="text-center">
          <Logo size="md" className="mx-auto" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 px-2">
            Welcome back, {userFirstName || 'there'}! 👋
          </p>
        </div>
        
        <nav className="flex justify-center gap-2">
          <Link 
            to="/profile" 
            className="flex-1 max-w-24 rounded-xl bg-white/80 dark:bg-gray-700/80 px-3 py-3 shadow-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 flex flex-col items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 min-h-[60px] active:scale-95"
          >
            <span className="text-lg">👤</span>
            <span>Profile</span>
          </Link>
          
          <Link 
            to="/settings" 
            className="flex-1 max-w-24 rounded-xl bg-white/80 dark:bg-gray-700/80 px-3 py-3 shadow-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 flex flex-col items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 min-h-[60px] active:scale-95"
          >
            <span className="text-lg">⚙️</span>
            <span>Settings</span>
          </Link>
          
          <Button 
            onClick={onSignOut}
            variant="outline" 
            className="flex-1 max-w-24 rounded-xl bg-white/80 dark:bg-gray-700/80 px-3 py-3 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 flex flex-col items-center gap-1 text-xs font-semibold border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 min-h-[60px] active:scale-95"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};
