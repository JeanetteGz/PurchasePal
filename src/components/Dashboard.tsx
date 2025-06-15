
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Purchase } from '@/pages/Index';
import { SpendingChart } from './SpendingChart';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { useState } from "react";

interface DashboardProps {
  purchases: Purchase[];
  onDeletePurchase?: (id: string) => void; // optional for backward compatibility
}

export const Dashboard = ({ purchases, onDeletePurchase }: DashboardProps) => {
  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const thisMonthSpent = purchases
    .filter(p => new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((sum, purchase) => sum + purchase.amount, 0);

  const avgPurchase = purchases.length > 0 ? totalSpent / purchases.length : 0;
  const recentPurchases = purchases.slice(0, 3);

  // State for tracking which purchase is being confirmed for deletion
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">💰 Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">All time spending</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">📅 This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">${thisMonthSpent.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Current month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">📈 Average Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${avgPurchase.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Per purchase</p>
          </CardContent>
        </Card>
      </div>

      {/* Spending Chart */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Spending Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SpendingChart purchases={purchases} />
        </CardContent>
      </Card>

      {/* Recent Purchases */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛍️ Recent Purchases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPurchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{purchase.item}</div>
                  <div className="text-sm text-gray-500">{purchase.store} • {format(new Date(purchase.date), 'MMM d, yyyy')}</div>
                  <div className="text-xs text-purple-600 mt-1">Trigger: {getTriggerEmoji(purchase.trigger)} {purchase.trigger}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-gray-900">${purchase.amount}</div>
                  {onDeletePurchase && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label="Delete Purchase" onClick={() => setDeleteId(purchase.id)}>
                          <Delete className="w-5 h-5 text-red-500 hover:text-red-700" />
                        </Button>
                      </AlertDialogTrigger>
                      {deleteId === purchase.id && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete purchase?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <span className="font-medium">{purchase.item}</span> from <span className="font-medium">{purchase.store}</span>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                onDeletePurchase(purchase.id);
                                setDeleteId(null);
                              }}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      )}
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
            {purchases.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎯</div>
                <p>No purchases yet. Start tracking your spending!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
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
    other: '🤔'
  };
  return emojiMap[trigger] || '🤔';
};
