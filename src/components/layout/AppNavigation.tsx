
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
    <div className="px-3 sm:px-6 lg:px-8 mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            variant={activeView === item.id ? "default" : "outline"}
            className={`p-4 h-auto flex flex-col items-center gap-2 bg-white/90 dark:bg-gray-800/90 ${item.hoverColor} text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm text-center min-h-[80px] rounded-xl shadow-lg transition-all duration-200 active:scale-95 ${
              activeView === item.id ? 'ring-2 ring-primary/20 bg-primary/10' : ''
            }`}
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="font-medium text-xs leading-tight">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
