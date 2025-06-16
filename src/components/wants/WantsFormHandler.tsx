
import { useState } from 'react';
import { AddWantForm } from './AddWantForm';
import { extractImageFromUrl, getCategoryPlaceholder } from './utils';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [newWant, setNewWant] = useState<NewWant>({
    product_name: '',
    category: '',
    product_url: '',
    product_image_url: '',
    notes: ''
  });
  const [isExtractingImage, setIsExtractingImage] = useState(false);

  const handleUrlChange = async (url: string) => {
    setNewWant(prev => ({ ...prev, product_url: url }));
    
    if (url && url.trim()) {
      setIsExtractingImage(true);
      try {
        console.log('Starting image extraction for URL:', url);
        const extractedImage = await extractImageFromUrl(url);
        
        if (extractedImage) {
          console.log('Image extracted successfully:', extractedImage);
          setNewWant(prev => ({ ...prev, product_image_url: extractedImage }));
          toast({
            title: "Image Found!",
            description: "Product image detected successfully",
          });
        } else {
          console.log('No image extracted, using category placeholder');
          // Use category placeholder if available
          if (newWant.category) {
            const placeholder = getCategoryPlaceholder(newWant.category);
            setNewWant(prev => ({ ...prev, product_image_url: placeholder }));
            toast({
              title: "Using Category Image",
              description: "Using category placeholder image",
            });
          }
        }
      } catch (error) {
        console.error('Error extracting image:', error);
        // Use category placeholder on error
        if (newWant.category) {
          const placeholder = getCategoryPlaceholder(newWant.category);
          setNewWant(prev => ({ ...prev, product_image_url: placeholder }));
        }
        toast({
          title: "Using Placeholder Image",
          description: "Using category placeholder instead",
        });
      } finally {
        setIsExtractingImage(false);
      }
    } else {
      // Clear image if URL is empty
      setNewWant(prev => ({ ...prev, product_image_url: '' }));
    }
  };

  const handleCategoryChange = (category: string) => {
    setNewWant(prev => ({ 
      ...prev, 
      category,
      // Set placeholder image if no image is currently set
      product_image_url: prev.product_image_url || getCategoryPlaceholder(category)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started with data:', newWant);
    
    // Ensure we have a placeholder image if none is set
    let finalWant = { ...newWant };
    if (!finalWant.product_image_url && finalWant.category) {
      finalWant.product_image_url = getCategoryPlaceholder(finalWant.category);
    }
    
    console.log('Final want data for submission:', finalWant);
    
    try {
      const success = await onSubmit(finalWant);
      if (success) {
        console.log('Item added successfully, resetting form');
        setNewWant({ product_name: '', category: '', product_url: '', product_image_url: '', notes: '' });
        onCancel();
      } else {
        console.log('Item submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <AddWantForm
          newWant={newWant}
          onNewWantChange={setNewWant}
          onUrlChange={handleUrlChange}
          onCategoryChange={handleCategoryChange}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
          isExtractingImage={isExtractingImage}
        />
      </div>
    </div>
  );
};
