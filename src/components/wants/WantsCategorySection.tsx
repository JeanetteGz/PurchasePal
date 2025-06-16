
import { WantCard } from './WantCard';

interface WantItem {
  id: string;
  product_name: string;
  category: string;
  product_url: string;
  product_image_url?: string;
  notes?: string;
  created_at: string;
}

interface WantsCategorySectionProps {
  category: string;
  items: WantItem[];
  categoryEmoji: string;
  onViewWant: (want: WantItem) => void;
  onDeleteWant: (id: string) => void;
}

export const WantsCategorySection = ({ 
  category, 
  items, 
  categoryEmoji, 
  onViewWant, 
  onDeleteWant 
}: WantsCategorySectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{categoryEmoji}</span>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize">
          {category}
        </h3>
        <div className="bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((want) => (
          <WantCard
            key={want.id}
            want={want}
            categoryEmoji={categoryEmoji}
            onView={onViewWant}
            onDelete={onDeleteWant}
          />
        ))}
      </div>
    </div>
  );
};
