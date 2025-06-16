
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
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {navigationItems.map((item) => (
        <Button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          variant={activeView === item.id ? "default" : "outline"}
          className={`p-6 h-auto flex flex-col items-center gap-2 bg-white/80 dark:bg-gray-800/80 ${item.hoverColor} text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm`}
        >
          <span className="text-2xl">{item.emoji}</span>
          <span className="font-medium">{item.label}</span>
        </Button>
      ))}
    </div>
  );
};
