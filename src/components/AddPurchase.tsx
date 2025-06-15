import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Purchase } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface AddPurchaseProps {
  onAddPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  onSuccess?: () => void;
}

const triggers = {
  // Practical Reasons
  groceries: { label: 'Groceries', emoji: '🛒', category: 'practical' },
  necessities: { label: 'Necessities', emoji: '🏠', category: 'practical' },
  replacement: { label: 'Replacement', emoji: '🔄', category: 'practical' },
  gift: { label: 'Gift for Someone', emoji: '🎁', category: 'practical' },
  planned: { label: 'Planned Purchase', emoji: '📋', category: 'practical' },
  emergency: { label: 'Emergency', emoji: '🚨', category: 'practical' },
  convenience: { label: 'Convenience', emoji: '⚡', category: 'practical' },
  
  // Emotional Triggers
  boredom: { label: 'Boredom', emoji: '😴', category: 'emotional' },
  stress: { label: 'Stress', emoji: '😰', category: 'emotional' },
  anxiety: { label: 'Anxiety', emoji: '😟', category: 'emotional' },
  depression: { label: 'Depression', emoji: '😢', category: 'emotional' },
  celebration: { label: 'Celebration', emoji: '🎉', category: 'emotional' },
  retail_therapy: { label: 'Retail Therapy', emoji: '🛍️', category: 'emotional' },
  
  // Influence-based
  sale: { label: 'Sale/Discount', emoji: '🏷️', category: 'external' },
  advertisement: { label: 'Saw an Ad', emoji: '📱', category: 'external' },
  influencer: { label: 'Influencer Rec', emoji: '⭐', category: 'external' },
  fomo: { label: 'FOMO', emoji: '😱', category: 'external' },
  peer_pressure: { label: 'Peer Pressure', emoji: '👥', category: 'external' },
  impulse: { label: 'Pure Impulse', emoji: '💭', category: 'external' },
  
  // Others
  treat_yourself: { label: 'Treat Yourself', emoji: '✨', category: 'other' },
  curiosity: { label: 'Curiosity', emoji: '🤔', category: 'other' },
  hobby: { label: 'Hobby/Collection', emoji: '🎨', category: 'other' },
  other: { label: 'Other', emoji: '📝', category: 'other' }
};

const triggerCategories = {
  practical: 'Practical Reasons',
  emotional: 'Emotional Triggers',
  external: 'External Influences',
  other: 'Other Reasons'
};

const stores = [
  { id: 'amazon', name: 'Amazon', emoji: '📦' },
  { id: 'target', name: 'Target', emoji: '🎯' },
  { id: 'walmart', name: 'Walmart', emoji: '🛒' },
  { id: 'tiktok_shop', name: 'TikTok Shop', emoji: '📱' },
  { id: 'nike', name: 'Nike', emoji: '👟' },
  { id: 'apple_store', name: 'Apple Store', emoji: '🍎' },
  { id: 'starbucks', name: 'Starbucks', emoji: '☕' },
  { id: 'sephora', name: 'Sephora', emoji: '💄' },
  { id: 'best_buy', name: 'Best Buy', emoji: '📺' },
  { id: 'home_depot', name: 'Home Depot', emoji: '🔨' },
  { id: 'costco', name: 'Costco', emoji: '🏪' },
  { id: 'zara', name: 'Zara', emoji: '👗' },
  { id: 'h&m', name: 'H&M', emoji: '👕' },
  { id: 'cvs', name: 'CVS', emoji: '💊' },
  { id: 'gas_station', name: 'Gas Station', emoji: '⛽' },
  { id: 'grocery_store', name: 'Grocery Store', emoji: '🥬' },
  { id: 'restaurant', name: 'Restaurant', emoji: '🍽️' },
  { id: 'online_store', name: 'Online Store', emoji: '💻' },
  { id: 'other', name: 'Other', emoji: '🏬' }
];

export const AddPurchase = ({ onAddPurchase, onSuccess }: AddPurchaseProps) => {
  const [formData, setFormData] = useState({
    item: '',
    store: '',
    amount: '',
    trigger: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item || !formData.store || !formData.amount || !formData.trigger) {
      toast({
        title: "Missing Information 📝",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onAddPurchase({
      item: formData.item,
      store: formData.store,
      amount: parseFloat(formData.amount),
      trigger: formData.trigger,
      date: formData.date,
      notes: formData.notes
    });

    setFormData({
      item: '',
      store: '',
      amount: '',
      trigger: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });

    toast({
      title: "Purchase Added! 🎉",
      description: "Your purchase has been tracked successfully.",
    });

    // Redirect to home screen after successful addition
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 1000); // Small delay to show the toast
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTriggersByCategory = (category: string) => {
    return Object.entries(triggers).filter(([_, trigger]) => trigger.category === category);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/60 dark:bg-card/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            🛒 Add New Purchase
          </CardTitle>
          <p className="text-muted-foreground">Track what you bought and why to understand your spending patterns</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item">What did you buy? *</Label>
                <Input
                  id="item"
                  placeholder="e.g., Designer sneakers"
                  value={formData.item}
                  onChange={(e) => handleInputChange('item', e.target.value)}
                  className="bg-white/50 dark:bg-input/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store">Where did you buy it? *</Label>
                <Select value={formData.store} onValueChange={(value) => handleInputChange('store', value)}>
                  <SelectTrigger className="bg-white/50 dark:bg-input/50 rounded-xl">
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-popover rounded-xl border shadow-lg max-h-60">
                    {stores.map((store) => (
                      <SelectItem 
                        key={store.id} 
                        value={store.name}
                        className="cursor-pointer hover:bg-purple-50 dark:hover:bg-accent rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span>{store.emoji}</span>
                          <span>{store.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">How much did you spend? *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="bg-white/50 dark:bg-input/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">When did you buy it?</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="bg-white/50 dark:bg-input/50 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>What triggered this purchase? *</Label>
              {Object.entries(triggerCategories).map(([categoryKey, categoryName]) => (
                <div key={categoryKey} className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {categoryName}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getTriggersByCategory(categoryKey).map(([triggerKey, trigger]) => (
                      <button
                        key={triggerKey}
                        type="button"
                        onClick={() => handleInputChange('trigger', triggerKey)}
                        className={`p-3 rounded-2xl border-2 transition-all text-left ${
                          formData.trigger === triggerKey
                            ? 'border-primary bg-primary/10 text-primary dark:border-primary dark:bg-primary/20'
                            : 'border-border bg-white/50 dark:bg-card/50 hover:border-primary/50 dark:hover:border-primary/50'
                        }`}
                      >
                        <div className="text-lg mb-1">{trigger.emoji}</div>
                        <div className="text-sm font-medium">{trigger.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="What were you feeling? What led to this purchase?"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="bg-white/50 dark:bg-input/50 min-h-20 rounded-xl"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium py-3 rounded-2xl"
            >
              💾 Save Purchase
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
