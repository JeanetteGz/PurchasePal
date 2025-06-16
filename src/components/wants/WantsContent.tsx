
import { useState } from 'react';
import { CategoryDetailModal } from './CategoryDetailModal';
import { WantsHeader } from './WantsHeader';
import { WantsSearchBar } from './WantsSearchBar';
import { WantsAddButton } from './WantsAddButton';
import { WantsEmptyState } from './WantsEmptyState';
import { WantsStatsSection } from './WantsStatsSection';
import { WantsCategoriesGrid } from './WantsCategoriesGrid';
import { WantsFormHandler } from './WantsFormHandler';
import { getCategoryEmoji } from './utils';

interface WantItem {
  id: string;
  product_name: string;
  category: string;
  product_url: string;
  product_image_url?: string;
  notes?: string;
  created_at: string;
}

interface NewWant {
  product_name: string;
  category: string;
  product_url: string;
  product_image_url: string;
  notes: string;
}

interface WantsContentProps {
  wants: WantItem[];
  onAddWant: (newWant: NewWant) => Promise<boolean>;
  onDeleteWant: (id: string) => void;
}

export const WantsContent = ({ wants, onAddWant, onDeleteWant }: WantsContentProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const handleAddWant = async (newWant: NewWant) => {
    setAddLoading(true);
    try {
      const success = await onAddWant(newWant);
      return success;
    } finally {
      setAddLoading(false);
    }
  };

  // Filter wants based on search query
  const filteredWants = wants.filter(want =>
    want.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    want.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    want.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered wants by category
  const wantsByCategory = filteredWants.reduce((acc, want) => {
    const category = want.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(want);
    return acc;
  }, {} as Record<string, WantItem[]>);

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <WantsHeader />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex-1 w-full sm:max-w-md">
            <WantsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </div>
          <WantsAddButton onAddClick={() => setShowAddForm(!showAddForm)} isLoading={addLoading} />
        </div>

        {showAddForm && (
          <WantsFormHandler
            onSubmit={handleAddWant}
            onCancel={() => setShowAddForm(false)}
            isLoading={addLoading}
          />
        )}

        <CategoryDetailModal
          category={selectedCategory}
          items={selectedCategory ? wantsByCategory[selectedCategory] || [] : []}
          categoryEmoji={selectedCategory ? getCategoryEmoji(selectedCategory) : ''}
          onClose={() => setSelectedCategory(null)}
          onDeleteWant={onDeleteWant}
        />

        {Object.keys(wantsByCategory).length === 0 ? (
          <WantsEmptyState searchQuery={searchQuery} />
        ) : (
          <WantsCategoriesGrid 
            wantsByCategory={wantsByCategory} 
            onCategoryClick={setSelectedCategory} 
          />
        )}

        <WantsStatsSection wants={wants} wantsByCategory={wantsByCategory} />
      </div>
    </div>
  );
};
