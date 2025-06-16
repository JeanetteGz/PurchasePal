
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
          <span className="text-4xl">{categoryEmoji}</span>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize">
            {category}
          </h2>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full shadow-lg">
          <span className="text-sm font-bold text-white">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
