
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  userFirstName?: string;
  avatarUrl?: string;
  onSignOut: () => void;
}

export const AppHeader = ({ userFirstName, avatarUrl, onSignOut }: AppHeaderProps) => {
  return (
    <header className="space-y-4 mb-4">
      <div className="flex items-center justify-between px-4 pt-4">
        <Logo size="sm" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 rounded-xl bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm px-4 py-2 shadow-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all duration-200 border-0"
            >
              <div className="flex items-center gap-2">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    {userFirstName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {userFirstName || 'User'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-2 z-[100]"
          >
            <DropdownMenuItem asChild>
              <Link 
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link 
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-600" />
            
            <DropdownMenuItem 
              onClick={onSignOut}
              className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="text-center px-4">
        <p className="text-base text-gray-600 dark:text-gray-300">
          Welcome back, {userFirstName || 'there'}! 👋
        </p>
      </div>
    </header>
  );
};
