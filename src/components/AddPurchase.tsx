
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Purchase } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface AddPurchaseProps {
  onAddPurchase: (purchase: Omit<Purchase, 'id'>) => void;
}

const triggers = [
  { id: 'stress', label: 'Stress', emoji: '😰' },
  { id: 'boredom', label: 'Boredom', emoji: '😴' },
  { id: 'happiness', label: 'Happiness', emoji: '😊' },
  { id: 'sadness', label: 'Sadness', emoji: '😢' },
  { id: 'anxiety', label: 'Anxiety', emoji: '😟' },
  { id: 'excitement', label: 'Excitement', emoji: '🤩' },
  { id: 'peer_pressure', label: 'Peer Pressure', emoji: '👥' },
  { id: 'sale', label: 'Sale/Deal', emoji: '🏷️' },
  { id: 'other', label: 'Other', emoji: '🤔' }
];

export const AddPurchase = ({ onAddPurchase }: AddPurchaseProps) => {
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
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            🛒 Add New Purchase
          </CardTitle>
          <p className="text-gray-600">Track what you bought and why to understand your spending patterns</p>
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
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store">Where did you buy it? *</Label>
                <Input
                  id="store"
                  placeholder="e.g., Nike Store"
                  value={formData.store}
                  onChange={(e) => handleInputChange('store', e.target.value)}
                  className="bg-white/50"
                />
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
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">When did you buy it?</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="bg-white/50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>What triggered this purchase? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {triggers.map((trigger) => (
                  <button
                    key={trigger.id}
                    type="button"
                    onClick={() => handleInputChange('trigger', trigger.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.trigger === trigger.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-white/50 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{trigger.emoji}</div>
                    <div className="text-sm font-medium">{trigger.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="What were you feeling? What led to this purchase?"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="bg-white/50 min-h-20"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3"
            >
              💾 Save Purchase
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
