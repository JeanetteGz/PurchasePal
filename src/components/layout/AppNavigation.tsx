
import { Button } from '@/components/ui/button';

interface AppNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  { id: "dashboard", emoji: "📊", label: "Dashboard", hoverColor: "hover:bg-blue-50 dark:hover:bg-gray-700/80" },
  { id: "add", emoji: "➕", label: "Add Purchase", hoverColor: "hover:bg-green-50 dark:hover:bg-gray-700/80" },
  { id: "purchases", emoji: "🛍️", label: "Purchases", hoverColor: "hover:bg-yellow-50 dark:hover:bg-gray-700/80" },
  { id: "wishlist", emoji: "💝", label: "Wishlist", hoverColor: "hover:bg-purple-50 dark:hover:bg-gray-700/80" },
  { id: "insights", emoji: "📈", label: "Insights", hoverColor: "hover:bg-orange-50 dark:hover:bg-gray-700/80" }
];

export const AppNavigation = ({ activeView, onViewChange }: AppNavigationProps) => {
  return (
    <div className="mb-4 lg:mb-6">
      {/* Mobile Layout: 2x2 grid + centered insights */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {navigationItems.slice(0, 4).map((item) => (
            <Button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              variant={activeView === item.id ? "default" : "outline"}
              className={`p-4 h-auto flex flex-col items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm ${item.hoverColor} text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 text-center min-h-[85px] rounded-xl shadow-lg transition-all duration-200 active:scale-95 ${
                activeView === item.id ? 'ring-2 ring-primary/20 bg-primary/10' : ''
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="font-medium text-xs leading-tight">{item.label}</span>
            </Button>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={() => onViewChange(navigationItems[4].id)}
            variant={activeView === navigationItems[4].id ? "default" : "outline"}
            className={`p-4 h-auto flex flex-col items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm ${navigationItems[4].hoverColor} text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 text-center min-h-[85px] rounded-xl shadow-lg transition-all duration-200 active:scale-95 w-full max-w-[180px] ${
              activeView === navigationItems[4].id ? 'ring-2 ring-primary/20 bg-primary/10' : ''
            }`}
          >
            <span className="text-2xl">{navigationItems[4].emoji}</span>
            <span className="font-medium text-xs leading-tight">{navigationItems[4].label}</span>
          </Button>
        </div>
      </div>

      {/* Desktop Layout: Single row */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-5 gap-4">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              variant={activeView === item.id ? "default" : "outline"}
              className={`p-6 h-auto flex flex-col items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm ${item.hoverColor} text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 text-center min-h-[120px] rounded-xl shadow-lg transition-all duration-200 active:scale-95 ${
                activeView === item.id ? 'ring-2 ring-primary/20 bg-primary/10' : ''
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="font-medium text-sm leading-tight">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
