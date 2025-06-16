
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface LandingHeaderProps {
  onGetStarted: () => void;
}

export const LandingHeader = ({ onGetStarted }: LandingHeaderProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/30 dark:border-gray-700/30 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo size="md" />
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-purple-600" />
            )}
          </Button>
          
          <Button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full px-6 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
