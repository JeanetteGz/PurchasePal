
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, ExternalLink, Plus, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Want {
  id: string;
  product_name: string;
  product_url: string;
  product_image_url?: string;
  category: string;
  notes?: string;
  created_at: string;
}

const CATEGORIES = [
  '💇‍♀️ Hair Care',
  '🪑 Furniture',
  '📱 Electronics',
  '👗 Clothing',
  '📚 Books',
  '🏡 Home & Garden',
  '🏃‍♂️ Sports & Fitness',
  '💄 Beauty & Skincare',
  '🍽️ Kitchen & Dining',
  '✈️ Travel',
  '🔮 Other'
];

export const Wants = () => {
  const [wants, setWants] = useState<Want[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    product_url: '',
    category: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWants();
  }, []);

  const fetchWants = async () => {
    try {
      const { data, error } = await supabase
        .from('user_wants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWants(data || []);
    } catch (error) {
      console.error('Error fetching wants:', error);
      toast({
        title: "Error",
        description: "Failed to load your wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const extractImageFromUrl = async (url: string) => {
    try {
      // Simple image extraction - try to get og:image from meta tags
      // This is a basic implementation - in a real app you might use a service
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      return data?.data?.image?.url || null;
    } catch (error) {
      console.log('Could not extract image from URL:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name || !formData.product_url || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Extract image from URL
      const imageUrl = await extractImageFromUrl(formData.product_url);

      const { data, error } = await supabase
        .from('user_wants')
        .insert({
          product_name: formData.product_name,
          product_url: formData.product_url,
          product_image_url: imageUrl,
          category: formData.category,
          notes: formData.notes || null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setWants(prev => [data, ...prev]);
      setFormData({ product_name: '', product_url: '', category: '', notes: '' });
      setShowAddForm(false);
      
      toast({
        title: "Added to wishlist! 🌟",
        description: "Your future purchase has been saved",
      });
    } catch (error) {
      console.error('Error adding want:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteWant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_wants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setWants(prev => prev.filter(want => want.id !== id));
      toast({
        title: "Removed from wishlist",
        description: "Item has been deleted",
      });
    } catch (error) {
      console.error('Error deleting want:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  if (loading && wants.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-purple-700 text-lg md:text-xl">
          <Heart className="text-pink-500" size={24} />
          💜 My Wishlist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 md:p-6 pt-0">
        {!showAddForm ? (
          <Button 
            onClick={() => setShowAddForm(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm md:text-base"
          >
            <Plus size={20} />
            Add Future Purchase
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-3 md:p-4 bg-purple-50 rounded-lg">
            <div>
              <Label htmlFor="product_name" className="text-sm">Product Name *</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                placeholder="What do you want to buy?"
                className="rounded-xl text-sm"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="product_url" className="text-sm">Product Link *</Label>
              <Input
                id="product_url"
                type="url"
                value={formData.product_url}
                onChange={(e) => setFormData(prev => ({ ...prev, product_url: e.target.value }))}
                placeholder="https://example.com/product"
                className="rounded-xl text-sm"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-sm">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="rounded-xl text-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category} className="text-sm">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes" className="text-sm">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Why do you want this? When might you buy it?"
                className="rounded-xl text-sm"
                rows={3}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" disabled={loading} className="flex-1 rounded-xl text-sm">
                {loading ? "Adding..." : "💜 Add to Wishlist"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="rounded-xl text-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {wants.length === 0 && !showAddForm ? (
          <div className="text-center py-6 md:py-8 text-gray-500">
            <Heart size={40} className="mx-auto mb-4 text-gray-300 md:w-12 md:h-12" />
            <p className="text-sm md:text-base">Your wishlist is empty</p>
            <p className="text-xs md:text-sm">Add your future purchases to keep track of what you want! 💜</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {wants.map((want) => (
              <div key={want.id} className="border rounded-xl p-3 md:p-4 bg-white shadow-sm">
                <div className="flex gap-3 md:gap-4">
                  {want.product_image_url ? (
                    <img 
                      src={want.product_image_url} 
                      alt={want.product_name}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="text-purple-400" size={20} />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{want.product_name}</h3>
                    <p className="text-xs md:text-sm text-purple-600 font-medium">{want.category}</p>
                    {want.notes && (
                      <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">{want.notes}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(want.product_url, '_blank')}
                        className="rounded-full text-xs h-7"
                      >
                        <ExternalLink size={12} />
                        <span className="hidden sm:inline ml-1">View Product</span>
                        <span className="sm:hidden ml-1">View</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteWant(want.id)}
                        className="rounded-full text-xs text-red-600 hover:text-red-700 h-7"
                      >
                        <Trash2 size={12} />
                        <span className="hidden sm:inline ml-1">Remove</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
