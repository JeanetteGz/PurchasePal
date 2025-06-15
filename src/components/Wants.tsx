
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, ExternalLink, Plus, Heart, ArrowLeft } from 'lucide-react';
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

const getCategoryGradient = (category: string) => {
  const gradients = {
    '💇‍♀️ Hair Care': 'from-pink-400 via-pink-500 to-pink-600',
    '🪑 Furniture': 'from-amber-400 via-orange-500 to-red-500',
    '📱 Electronics': 'from-blue-400 via-blue-500 to-blue-600',
    '👗 Clothing': 'from-purple-400 via-purple-500 to-purple-600',
    '📚 Books': 'from-green-400 via-green-500 to-green-600',
    '🏡 Home & Garden': 'from-emerald-400 via-emerald-500 to-emerald-600',
    '🏃‍♂️ Sports & Fitness': 'from-red-400 via-red-500 to-red-600',
    '💄 Beauty & Skincare': 'from-pink-400 via-rose-500 to-rose-600',
    '🍽️ Kitchen & Dining': 'from-yellow-400 via-orange-500 to-orange-600',
    '✈️ Travel': 'from-cyan-400 via-sky-500 to-blue-600',
    '🔮 Other': 'from-indigo-400 via-purple-500 to-purple-600'
  };
  return gradients[category] || 'from-gray-400 via-gray-500 to-gray-600';
};

export const Wants = () => {
  const [wants, setWants] = useState<Want[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const groupedWants = wants.reduce((groups, want) => {
    const category = want.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(want);
    return groups;
  }, {} as Record<string, Want[]>);

  if (loading && wants.length === 0) {
    return (
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-blue-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Category view - show items in selected category
  if (selectedCategory) {
    const categoryItems = groupedWants[selectedCategory] || [];
    
    return (
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setSelectedCategory(null)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft size={20} />
            </Button>
            <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-lg md:text-xl">
              <Heart className="text-pink-500" size={24} />
              {selectedCategory}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 md:p-6 pt-0">
          {categoryItems.length === 0 ? (
            <div className="text-center py-6 md:py-8 text-gray-500 dark:text-gray-400">
              <Heart size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600 md:w-12 md:h-12" />
              <p className="text-sm md:text-base">No items in this category yet</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {categoryItems.map((want) => (
                <div key={want.id} className="border dark:border-gray-600/50 rounded-xl p-3 md:p-4 bg-white/70 dark:bg-gray-700/70 shadow-sm backdrop-blur-sm">
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
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart className="text-purple-400 dark:text-blue-400" size={20} />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base truncate">{want.product_name}</h3>
                      {want.notes && (
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{want.notes}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(want.product_url, '_blank')}
                          className="rounded-full text-xs h-7 bg-white/70 dark:bg-gray-600/70 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500/70"
                        >
                          <ExternalLink size={12} />
                          <span className="hidden sm:inline ml-1">View Product</span>
                          <span className="sm:hidden ml-1">View</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteWant(want.id)}
                          className="rounded-full text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 h-7 bg-white/70 dark:bg-gray-600/70 border-red-300 dark:border-red-500"
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
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100 text-lg md:text-xl">
          <Heart className="text-pink-500" size={24} />
          💜 My Wishlist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 md:p-6 pt-0">
        {!showAddForm ? (
          <Button 
            onClick={() => setShowAddForm(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-blue-600 dark:to-purple-600 hover:from-purple-600 hover:to-pink-600 dark:hover:from-blue-700 dark:hover:to-purple-700 text-sm md:text-base shadow-lg"
          >
            <Plus size={20} />
            Add Future Purchase
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-3 md:p-4 bg-purple-50/70 dark:bg-gray-700/70 rounded-lg backdrop-blur-sm">
            <div>
              <Label htmlFor="product_name" className="text-sm text-gray-700 dark:text-gray-200">Product Name *</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                placeholder="What do you want to buy?"
                className="rounded-xl text-sm bg-white/70 dark:bg-gray-600/70 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="product_url" className="text-sm text-gray-700 dark:text-gray-200">Product Link *</Label>
              <Input
                id="product_url"
                type="url"
                value={formData.product_url}
                onChange={(e) => setFormData(prev => ({ ...prev, product_url: e.target.value }))}
                placeholder="https://example.com/product"
                className="rounded-xl text-sm bg-white/70 dark:bg-gray-600/70 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-sm text-gray-700 dark:text-gray-200">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="rounded-xl text-sm bg-white/70 dark:bg-gray-600/70 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 z-50">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category} className="text-sm text-gray-900 dark:text-gray-200">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes" className="text-sm text-gray-700 dark:text-gray-200">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Why do you want this? When might you buy it?"
                className="rounded-xl text-sm bg-white/70 dark:bg-gray-600/70 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100"
                rows={3}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" disabled={loading} className="flex-1 rounded-xl text-sm bg-gradient-to-r from-purple-500 to-pink-500 dark:from-blue-600 dark:to-purple-600 hover:from-purple-600 hover:to-pink-600 dark:hover:from-blue-700 dark:hover:to-purple-700">
                {loading ? "Adding..." : "💜 Add to Wishlist"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="rounded-xl text-sm bg-white/70 dark:bg-gray-600/70 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500/70"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {Object.keys(groupedWants).length === 0 && !showAddForm ? (
          <div className="text-center py-6 md:py-8 text-gray-500 dark:text-gray-400">
            <Heart size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600 md:w-12 md:h-12" />
            <p className="text-sm md:text-base">Your wishlist is empty</p>
            <p className="text-xs md:text-sm">Add your future purchases to keep track of what you want! 💜</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {Object.entries(groupedWants).map(([category, items]) => (
              <div 
                key={category}
                className={`relative overflow-hidden rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br ${getCategoryGradient(category)} p-[1px]`}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{category.split(' ')[0]}</div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{category.split(' ').slice(1).join(' ')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-gray-400 dark:text-gray-500 text-xl">→</div>
                  </div>
                  
                  {/* Show preview of first few items */}
                  <div className="mt-3 flex gap-2 overflow-hidden">
                    {items.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="flex-shrink-0 w-8 h-8 bg-white/50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50">
                        {item.product_name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100/50 dark:bg-gray-600/50 rounded-lg flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200/50 dark:border-gray-600/50">
                        +{items.length - 3}
                      </div>
                    )}
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
