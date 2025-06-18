
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
    <header className="flex flex-col space-y-4 mb-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <Logo size="lg" />
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto sm:mx-0 mt-2 px-2 sm:px-0">
            Welcome back, {userFirstName || 'there'}! 👋 Ready for some mindful spending?
          </p>
        </div>
        
        <nav className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3">
          <Link to="/profile" className="rounded-full bg-white/70 dark:bg-gray-700/70 px-3 py-2 shadow hover:bg-blue-50 dark:hover:bg-gray-600 transition flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">
            <span role="img" aria-label="profile">👤</span> 
            <span className="hidden xs:inline">Profile</span>
          </Link>
          <Link to="/settings" className="rounded-full bg-white/70 dark:bg-gray-700/70 px-3 py-2 shadow hover:bg-blue-50 dark:hover:bg-gray-600 transition flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">
            <span role="img" aria-label="settings">⚙️</span> 
            <span className="hidden xs:inline">Settings</span>
          </Link>
          <Button 
            onClick={onSignOut}
            variant="outline" 
            className="rounded-full bg-white/70 dark:bg-gray-700/70 px-3 py-2 shadow hover:bg-red-50 dark:hover:bg-red-900/30 transition flex items-center gap-2 text-xs sm:text-sm font-semibold border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
          >
            <LogOut size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Sign Out</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};
