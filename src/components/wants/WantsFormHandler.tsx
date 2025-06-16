
import { useState } from 'react';
import { AddWantForm } from './AddWantForm';
import { extractImageFromUrl } from './utils';

interface NewWant {
  product_name: string;
  category: string;
  product_url: string;
  product_image_url: string;
  notes: string;
}

interface WantsFormHandlerProps {
  onSubmit: (newWant: NewWant) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
}

export const WantsFormHandler = ({ onSubmit, onCancel, isLoading }: WantsFormHandlerProps) => {
  const [newWant, setNewWant] = useState<NewWant>({
    product_name: '',
    category: '',
    product_url: '',
    product_image_url: '',
    notes: ''
  });

  const handleUrlChange = async (url: string) => {
    setNewWant(prev => ({ ...prev, product_url: url }));
    
    if (url) {
      try {
        const extractedImage = await extractImageFromUrl(url);
        if (extractedImage) {
          setNewWant(prev => ({ ...prev, product_image_url: extractedImage }));
        }
      } catch (error) {
        console.error('Error extracting image:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(newWant);
    if (success) {
      setNewWant({ product_name: '', category: '', product_url: '', product_image_url: '', notes: '' });
      onCancel();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <AddWantForm
          newWant={newWant}
          onNewWantChange={setNewWant}
          onUrlChange={handleUrlChange}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
