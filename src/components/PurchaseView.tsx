
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { Search, Filter, Trash2, Calendar, DollarSign, Store, Tag } from 'lucide-react';
import type { Purchase } from '@/pages/Index';

interface PurchaseViewProps {
  purchases: Purchase[];
  onDeletePurchase: (id: string) => void;
}

export const PurchaseView = ({ purchases, onDeletePurchase }: PurchaseViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState('all');
  const [filterTrigger, setFilterTrigger] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Get unique stores and triggers for filter options
  const uniqueStores = Array.from(new Set(purchases.map(p => p.store))).sort();
  const uniqueTriggers = Array.from(new Set(purchases.map(p => p.trigger))).sort();

  // Filter and sort purchases
  const filteredPurchases = purchases
    .filter(purchase => {
      const matchesSearch = purchase.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           purchase.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           purchase.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStore = filterStore === 'all' || purchase.store === filterStore;
      const matchesTrigger = filterTrigger === 'all' || purchase.trigger === filterTrigger;
      
      return matchesSearch && matchesStore && matchesTrigger;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'item':
          return a.item.localeCompare(b.item);
        case 'store':
          return a.store.localeCompare(b.store);
        default:
          return 0;
      }
    });

  const getTriggerColor = (trigger: string) => {
    const colors: { [key: string]: string } = {
      boredom: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      stress: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      sale: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      impulse: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      necessities: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      planned: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    };
    return colors[trigger] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  const getTriggerEmoji = (trigger: string) => {
    const emojiMap: { [key: string]: string } = {
      stress: '😰',
      boredom: '😴',
      happiness: '😊',
      sadness: '😢',
      anxiety: '😟',
      excitement: '🤩',
      peer_pressure: '👥',
      sale: '🏷️',
      impulse: '⚡',
      necessities: '🛒',
      planned: '📋',
      other: '🤔'
    };
    return emojiMap[trigger] || '🤔';
  };

  const getStoreEmoji = (store: string) => {
    const storeEmojis: { [key: string]: string } = {
      amazon: '📦',
      walmart: '🛒',
      target: '🎯',
      costco: '🏪',
      'best buy': '💻',
      starbucks: '☕',
      mcdonalds: '🍟',
      'home depot': '🔨',
      lowes: '🔧',
      kroger: '🥬',
      safeway: '🛍️',
      cvs: '💊',
      walgreens: '💉',
      'gas station': '⛽',
      restaurant: '🍽️',
      grocery: '🥕',
      mall: '🏬',
      online: '💻',
      pharmacy: '💊'
    };
    
    const lowerStore = store.toLowerCase();
    for (const [key, emoji] of Object.entries(storeEmojis)) {
      if (lowerStore.includes(key)) {
        return emoji;
      }
    }
    return '🏪';
  };

  const totalSpent = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);
  const averageSpent = filteredPurchases.length > 0 ? totalSpent / filteredPurchases.length : 0;

  return (
    <div className="space-y-6">
      {/* Header with stats and emojis */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            🛍️ Your Purchases
          </h2>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            📊 {filteredPurchases.length} purchases • 💰 Total: ${totalSpent.toFixed(2)} • 📈 Average: ${averageSpent.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            🔍 Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="🔍 Search purchases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-input/50"
              />
            </div>

            <Select value={filterStore} onValueChange={setFilterStore}>
              <SelectTrigger className="bg-white/50 dark:bg-input/50">
                <SelectValue placeholder="🏪 Filter by store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🏬 All Stores</SelectItem>
                {uniqueStores.map((store) => (
                  <SelectItem key={store} value={store}>
                    {getStoreEmoji(store)} {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTrigger} onValueChange={setFilterTrigger}>
              <SelectTrigger className="bg-white/50 dark:bg-input/50">
                <SelectValue placeholder="🎯 Filter by trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🎯 All Triggers</SelectItem>
                {uniqueTriggers.map((trigger) => (
                  <SelectItem key={trigger} value={trigger}>
                    {getTriggerEmoji(trigger)} {trigger}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/50 dark:bg-input/50">
                <SelectValue placeholder="📊 Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">📅 Date (Newest)</SelectItem>
                <SelectItem value="amount">💰 Amount (Highest)</SelectItem>
                <SelectItem value="item">🔤 Item (A-Z)</SelectItem>
                <SelectItem value="store">🏪 Store (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchase List */}
      <div className="grid gap-4">
        {filteredPurchases.length > 0 ? (
          filteredPurchases.map((purchase) => (
            <Card key={purchase.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        🛒 {purchase.item}
                      </h3>
                      <Badge className={getTriggerColor(purchase.trigger)}>
                        <Tag className="w-3 h-3 mr-1" />
                        {getTriggerEmoji(purchase.trigger)} {purchase.trigger}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>{getStoreEmoji(purchase.store)} {purchase.store}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>📅 {format(new Date(purchase.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                          💵 ${purchase.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {purchase.notes && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic flex items-start gap-2">
                          📝 "{purchase.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>🗑️ Delete Purchase</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{purchase.item}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeletePurchase(purchase.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No purchases found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterStore !== 'all' || filterTrigger !== 'all' 
                  ? 'Try adjusting your filters or search terms. 🔍'
                  : 'Start tracking your purchases to see them here! 📝'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
