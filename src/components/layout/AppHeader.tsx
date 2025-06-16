
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
    <header className="flex flex-col md:flex-row items-center justify-between mb-8">
      <div className="text-center md:text-left">
        <Logo size="lg" />
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto md:mx-0 mt-4">
          Welcome back, {userFirstName || 'there'}! 👋 Ready for some mindful spending?
        </p>
      </div>
      <nav className="flex gap-3 mt-4 md:mt-0">
        <Link to="/profile" className="rounded-full bg-white/70 dark:bg-gray-700/70 px-4 py-2 shadow hover:bg-blue-50 dark:hover:bg-gray-600 transition flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <span role="img" aria-label="profile">👤</span> Profile
        </Link>
        <Link to="/settings" className="rounded-full bg-white/70 dark:bg-gray-700/70 px-4 py-2 shadow hover:bg-blue-50 dark:hover:bg-gray-600 transition flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <span role="img" aria-label="settings">⚙️</span> Settings
        </Link>
        <Button 
          onClick={onSignOut}
          variant="outline" 
          className="rounded-full bg-white/70 dark:bg-gray-700/70 px-4 py-2 shadow hover:bg-red-50 dark:hover:bg-red-900/30 transition flex items-center gap-2 text-sm font-semibold border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </nav>
    </header>
  );
};
