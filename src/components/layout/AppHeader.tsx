
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
    <header className="space-y-4 mb-4">
      <div className="text-center pt-4">
        <Logo size="md" className="mx-auto" />
        <p className="text-base text-gray-600 dark:text-gray-300 mt-3 px-2">
          Welcome back, {userFirstName || 'there'}! 👋
        </p>
      </div>
      
      <nav className="grid grid-cols-3 gap-2">
        <Link 
          to="/profile" 
          className="rounded-xl bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm px-3 py-3 shadow-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 flex flex-col items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200 min-h-[70px] active:scale-95"
        >
          <span className="text-xl">👤</span>
          <span>Profile</span>
        </Link>
        
        <Link 
          to="/settings" 
          className="rounded-xl bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm px-3 py-3 shadow-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 flex flex-col items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200 min-h-[70px] active:scale-95"
        >
          <span className="text-xl">⚙️</span>
          <span>Settings</span>
        </Link>
        
        <Button 
          onClick={onSignOut}
          variant="outline" 
          className="rounded-xl bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm px-3 py-3 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 flex flex-col items-center gap-1 text-sm font-semibold border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 min-h-[70px] active:scale-95"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </Button>
      </nav>
    </header>
  );
};
