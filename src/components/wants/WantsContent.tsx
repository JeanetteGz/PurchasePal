
import { useState, useMemo, memo } from 'react';
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

export const WantsContent = memo(({ wants, onAddWant, onDeleteWant }: WantsContentProps) => {
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

  // Memoize filtered wants for better performance
  const filteredWants = useMemo(() => {
    return wants.filter(want =>
      want.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      want.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      want.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [wants, searchQuery]);

  // Memoize grouped wants by category
  const wantsByCategory = useMemo(() => {
    return filteredWants.reduce((acc, want) => {
      const category = want.category.toLowerCase();
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(want);
      return acc;
    }, {} as Record<string, WantItem[]>);
  }, [filteredWants]);

  return (
    <div className="w-full mx-auto py-4 min-h-screen lg:px-8">
      <WantsHeader />

      <div className="space-y-4">
        <div className="space-y-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/30 rounded-2xl p-4 shadow-lg">
          <WantsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
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
});

WantsContent.displayName = 'WantsContent';
