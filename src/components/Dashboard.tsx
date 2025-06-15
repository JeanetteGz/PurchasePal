
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Purchase } from '@/pages/Index';
import { SpendingChart } from './SpendingChart';
import { format, subMonths, getMonth, getYear, parseISO, isSameMonth } from 'date-fns';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  purchases: Purchase[];
  onDeletePurchase?: (id: string) => void; // optional for backward compatibility
}

const PIE_COLORS = [
  "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#ec4899", "#6366f1", "#a21caf", "#f472b6", "#34d399"
];

export const Dashboard = ({ purchases, onDeletePurchase }: DashboardProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statsOpen, setStatsOpen] = useState(false);

  // Stats calculations
  const now = new Date();
  const thisMonth = getMonth(now);
  const thisYear = getYear(now);
  const prevMonthDate = subMonths(now, 1);
  const prevMonth = getMonth(prevMonthDate);
  const prevYear = getYear(prevMonthDate);

  const getMonthSpending = (month: number, year: number) =>
    purchases.filter(
      p => {
        const d = parseISO(p.date);
        return getMonth(d) === month && getYear(d) === year;
      }
    ).reduce((sum, p) => sum + p.amount, 0);

  const thisMonthSpent = getMonthSpending(thisMonth, thisYear);
  const prevMonthSpent = getMonthSpending(prevMonth, prevYear);

  const percentChange =
    prevMonthSpent === 0
      ? thisMonthSpent === 0
        ? 0
        : 100
      : ((thisMonthSpent - prevMonthSpent) / prevMonthSpent) * 100;

  // Biggest Trigger This Month
  const thisMonthPurchases = purchases.filter(
    p => {
      const d = parseISO(p.date);
      return getMonth(d) === thisMonth && getYear(d) === thisYear;
    }
  );
  const triggerMap: { [trigger: string]: number } = {};
  thisMonthPurchases.forEach(p => {
    if (!triggerMap[p.trigger]) triggerMap[p.trigger] = 0;
    triggerMap[p.trigger] += p.amount;
  });
  const biggestTriggerEntry = Object.entries(triggerMap)
    .sort((a, b) => b[1] - a[1])[0];

  // Pie chart by trigger (this month)
  const triggerPieData = Object.entries(triggerMap).map(([trigger, total], idx) => ({
    name: `${getTriggerEmoji(trigger)} ${trigger}`,
    value: total,
    trigger,
    color: PIE_COLORS[idx % PIE_COLORS.length]
  }));

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const avgPurchase = purchases.length > 0 ? totalSpent / purchases.length : 0;
  const recentPurchases = purchases.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Spent Card */}
        <AlertDialog open={statsOpen} onOpenChange={setStatsOpen}>
          <AlertDialogTrigger asChild>
            <Card
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg cursor-pointer hover:scale-105 hover:ring-2 hover:ring-purple-400 dark:hover:ring-blue-400 transition-all"
              onClick={() => setStatsOpen(true)}
              tabIndex={0}
              aria-label="Show spending stats"
              role="button"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">💰 Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 dark:text-blue-400">${totalSpent.toFixed(2)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All time spending</p>
              </CardContent>
            </Card>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-lg p-0 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 dark:text-gray-100">
                  <span className="text-2xl">💰</span>
                  Spending Breakdown
                </AlertDialogTitle>
                <AlertDialogDescription className="dark:text-gray-300">
                  <div className="text-base mt-3">
                    <span className="font-bold text-lg">This Month:</span>{" "}
                    <span className="text-blue-700 dark:text-blue-400 font-semibold">${thisMonthSpent.toFixed(2)}</span>
                  </div>
                  <div className="text-base">
                    <span className="font-bold">Last Month:</span>{" "}
                    <span className="text-slate-600 dark:text-gray-400">${prevMonthSpent.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 font-medium">
                    <span className="mr-2">Change:</span>
                    <span className={percentChange > 0 ? "text-red-600 dark:text-red-400" : percentChange < 0 ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}>
                      {percentChange > 0 ? "▲" : percentChange < 0 ? "▼" : "•"} {Math.abs(percentChange).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="font-bold text-md">Top Trigger:</span>{" "}
                    {biggestTriggerEntry ?
                      <span>
                        <span className="text-xl">{getTriggerEmoji(biggestTriggerEntry[0])}</span> <span className="capitalize">{biggestTriggerEntry[0]}</span> (${biggestTriggerEntry[1].toFixed(2)})
                      </span>
                      : <span className="text-gray-500 dark:text-gray-400">N/A</span>
                    }
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-6 bg-purple-50 dark:bg-gray-700 p-2 rounded-lg">
                <div className="font-bold text-center text-purple-600 dark:text-blue-400 mb-2">Your Spending by Trigger</div>
                {triggerPieData.length > 0 ? (
                  <div style={{ width: '100%', height: 230 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={triggerPieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {triggerPieData.map((entry, idx) => (
                            <Cell key={entry.trigger} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number, n: string) => [`$${v.toFixed(2)}`, n]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 text-sm my-8">No purchases this month yet.</div>
                )}
              </div>
            </div>
            <AlertDialogFooter className="p-4 flex justify-end">
              <AlertDialogAction
                className="px-4 py-2 rounded bg-purple-600 dark:bg-blue-600 text-white hover:bg-purple-700 dark:hover:bg-blue-700"
                onClick={() => setStatsOpen(false)}
              >
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* This Month */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">📅 This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">${thisMonthSpent.toFixed(2)}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">📈 Average Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">${avgPurchase.toFixed(2)}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per purchase</p>
          </CardContent>
        </Card>
      </div>

      {/* Spending Chart */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-gray-100">
            📊 Spending Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SpendingChart purchases={purchases} />
        </CardContent>
      </Card>

      {/* Recent Purchases */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-gray-100">
            🛍️ Recent Purchases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPurchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{purchase.item}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{purchase.store} • {format(new Date(purchase.date), 'MMM d, yyyy')}</div>
                  <div className="text-xs text-purple-600 dark:text-blue-400 mt-1">Trigger: {getTriggerEmoji(purchase.trigger)} {purchase.trigger}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">${purchase.amount}</div>
                  {onDeletePurchase && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label="Delete Purchase" onClick={() => setDeleteId(purchase.id)}>
                          <Delete className="w-5 h-5 text-red-500 hover:text-red-700" />
                        </Button>
                      </AlertDialogTrigger>
                      {deleteId === purchase.id && (
                        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="dark:text-gray-100">Delete purchase?</AlertDialogTitle>
                            <AlertDialogDescription className="dark:text-gray-300">
                              Are you sure you want to delete <span className="font-medium">{purchase.item}</span> from <span className="font-medium">{purchase.store}</span>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteId(null)} className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Cancel</AlertDialogCancel>
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
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
