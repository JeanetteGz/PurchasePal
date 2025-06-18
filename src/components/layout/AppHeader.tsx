
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
    <header className="space-y-4 mb-6">
      <div className="text-center">
        <Logo size="md" className="mx-auto" />
        <p className="text-base text-gray-600 dark:text-gray-300 mt-3 px-2">
          Welcome back, {userFirstName || 'there'}! 👋
        </p>
      </div>
      
      <nav className="grid grid-cols-3 gap-3">
        <Link 
          to="/profile" 
          className="rounded-2xl bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm px-4 py-4 shadow-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 flex flex-col items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 min-h-[80px] active:scale-95"
        >
          <span className="text-2xl">👤</span>
          <span>Profile</span>
        </Link>
        
        <Link 
          to="/settings" 
          className="rounded-2xl bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm px-4 py-4 shadow-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 flex flex-col items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 min-h-[80px] active:scale-95"
        >
          <span className="text-2xl">⚙️</span>
          <span>Settings</span>
        </Link>
        
        <Button 
          onClick={onSignOut}
          variant="outline" 
          className="rounded-2xl bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm px-4 py-4 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 flex flex-col items-center gap-2 text-sm font-semibold border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 min-h-[80px] active:scale-95"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </Button>
      </nav>
    </header>
  );
};
