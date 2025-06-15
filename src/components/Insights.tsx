
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Purchase } from '@/pages/Index';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Download, TrendingUp, Calendar, Store, CreditCard } from 'lucide-react';
import { format, parseISO, getMonth, getYear, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface InsightsProps {
  purchases: Purchase[];
}

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

const getTriggerLabel = (trigger: string) => {
  const labelMap: { [key: string]: string } = {
    stress: 'Stress',
    boredom: 'Boredom',
    happiness: 'Happiness',
    sadness: 'Sadness',
    anxiety: 'Anxiety',
    excitement: 'Excitement',
    peer_pressure: 'Peer Pressure',
    sale: 'Sale/Deal',
    other: 'Other'
  };
  return labelMap[trigger] || 'Other';
};

export const Insights = ({ purchases }: InsightsProps) => {
  // Enhanced analytics calculations
  const triggerStats = purchases.reduce((acc, purchase) => {
    const trigger = purchase.trigger;
    if (!acc[trigger]) {
      acc[trigger] = { count: 0, total: 0 };
    }
    acc[trigger].count += 1;
    acc[trigger].total += purchase.amount;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  const triggerChartData = Object.entries(triggerStats)
    .map(([trigger, stats]) => ({
      trigger: getTriggerLabel(trigger),
      emoji: getTriggerEmoji(trigger),
      count: stats.count,
      amount: stats.total,
      avgAmount: stats.total / stats.count,
      percentage: ((stats.count / purchases.length) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  // Store statistics with enhanced data
  const storeStats = purchases.reduce((acc, purchase) => {
    const store = purchase.store;
    if (!acc[store]) {
      acc[store] = { count: 0, total: 0, items: [] };
    }
    acc[store].count += 1;
    acc[store].total += purchase.amount;
    acc[store].items.push(purchase.item);
    return acc;
  }, {} as Record<string, { count: number; total: number; items: string[] }>);

  const topStores = Object.entries(storeStats)
    .map(([store, stats]) => ({
      store,
      count: stats.count,
      amount: stats.total,
      avgAmount: stats.total / stats.count,
      items: stats.items
    }))
    .sort((a, b) => b.amount - a.amount);

  // Monthly spending trend
  const now = new Date();
  const last6Months = eachMonthOfInterval({
    start: subMonths(now, 5),
    end: now
  });

  const monthlyData = last6Months.map(month => {
    const monthSpending = purchases
      .filter(p => {
        const purchaseDate = parseISO(p.date);
        return getMonth(purchaseDate) === getMonth(month) && 
               getYear(purchaseDate) === getYear(month);
      })
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      month: format(month, 'MMM yyyy'),
      amount: monthSpending,
      count: purchases.filter(p => {
        const purchaseDate = parseISO(p.date);
        return getMonth(purchaseDate) === getMonth(month) && 
               getYear(purchaseDate) === getYear(month);
      }).length
    };
  });

  // Time-based analysis
  const hourlySpending = purchases.reduce((acc, purchase) => {
    const hour = new Date(purchase.date).getHours();
    const timeSlot = hour < 6 ? 'Late Night (12-6 AM)' :
                   hour < 12 ? 'Morning (6 AM-12 PM)' :
                   hour < 18 ? 'Afternoon (12-6 PM)' :
                   'Evening (6 PM-12 AM)';
    
    if (!acc[timeSlot]) acc[timeSlot] = 0;
    acc[timeSlot] += purchase.amount;
    return acc;
  }, {} as Record<string, number>);

  const timeChartData = Object.entries(hourlySpending).map(([time, amount]) => ({
    time,
    amount
  }));

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

  const pieData = triggerChartData.map((item, index) => ({
    name: item.trigger,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  // Comprehensive PDF download
  const downloadComprehensivePDF = async () => {
    try {
      const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
      const avgPurchase = totalSpent / purchases.length;
      
      const comprehensiveData = [
        `COMPREHENSIVE SPENDING INSIGHTS REPORT`,
        `Generated: ${new Date().toLocaleDateString()}`,
        `Report Period: ${purchases.length > 0 ? `${purchases[purchases.length - 1].date} to ${purchases[0].date}` : 'No data'}`,
        `${'='.repeat(80)}`,
        ``,
        `SUMMARY STATISTICS:`,
        `Total Purchases: ${purchases.length}`,
        `Total Amount Spent: $${totalSpent.toFixed(2)}`,
        `Average Purchase: $${avgPurchase.toFixed(2)}`,
        ``,
        `TOP SPENDING TRIGGERS:`,
        ...triggerChartData.slice(0, 5).map((item, i) => 
          `${i + 1}. ${item.emoji} ${item.trigger}: $${item.amount.toFixed(2)} (${item.count} purchases, avg: $${item.avgAmount.toFixed(2)})`
        ),
        ``,
        `TOP STORES:`,
        ...topStores.slice(0, 10).map((store, i) => 
          `${i + 1}. ${store.store}: $${store.amount.toFixed(2)} (${store.count} purchases, avg: $${store.avgAmount.toFixed(2)})`
        ),
        ``,
        `MONTHLY SPENDING TREND:`,
        ...monthlyData.map(month => 
          `${month.month}: $${month.amount.toFixed(2)} (${month.count} purchases)`
        ),
        ``,
        `TIME-BASED SPENDING:`,
        ...Object.entries(hourlySpending).map(([time, amount]) => 
          `${time}: $${amount.toFixed(2)}`
        ),
        ``,
        `DETAILED PURCHASE HISTORY:`,
        `${'='.repeat(80)}`,
        `DATE | ITEM | STORE | AMOUNT | TRIGGER | NOTES`,
        `${'='.repeat(80)}`,
        ...purchases.map(p => 
          `${p.date} | ${p.item} | ${p.store} | $${p.amount.toFixed(2)} | ${p.trigger} | ${p.notes || 'N/A'}`
        )
      ];
      
      const blob = new Blob([comprehensiveData.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprehensive-spending-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
    }
  };

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No insights yet</h3>
        <p className="text-gray-500">Add some purchases to see your spending patterns and triggers!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Download */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">📊 Comprehensive Insights</h2>
          <p className="text-gray-600 dark:text-gray-400">Deep dive into your spending patterns and behaviors</p>
        </div>
        <Button
          onClick={downloadComprehensivePDF}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Full Report
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Purchases</span>
            </div>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{purchases.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Total Spent</span>
            </div>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              ${purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Unique Stores</span>
            </div>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {Object.keys(storeStats).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg per Purchase</span>
            </div>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              ${(purchases.reduce((sum, p) => sum + p.amount, 0) / purchases.length).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Spending Trend */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 6-Month Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value, name) => name === 'amount' ? [`$${value}`, 'Amount Spent'] : [value, 'Purchases']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  name="Amount Spent"
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Number of Purchases"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Trigger Analysis */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧠 Advanced Spending Trigger Analysis
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">Deep insights into what drives your purchases</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg mb-4">Detailed Breakdown</h4>
              {triggerChartData.map((item, index) => (
                <div key={item.trigger} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-purple-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{item.trigger}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.count} purchases • {item.percentage}% of total
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-gray-100">${item.amount.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        avg: ${item.avgAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.amount / triggerChartData[0].amount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-80">
              <h4 className="font-semibold text-lg mb-4">Visual Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} purchases`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Store Analysis */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏪 Complete Store Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Top 10 Stores</h4>
              {topStores.slice(0, 10).map((store, index) => (
                <div key={store.store} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-green-900/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-purple-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{store.store}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {store.count} purchases • avg: ${store.avgAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-gray-100">${store.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">total spent</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-96">
              <h4 className="font-semibold text-lg mb-4">Store Spending Comparison</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topStores.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="store" 
                    stroke="#6b7280"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value, name) => name === 'amount' ? [`$${value}`, 'Total Spent'] : [value, 'Purchases']}
                    labelFormatter={(label) => `Store: ${label}`}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} name="amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time-based Spending Analysis */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⏰ Time-based Spending Patterns
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">When do you spend the most?</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount Spent']} />
                <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Insights Summary */}
      <Card className="bg-gradient-to-r from-purple-100 via-blue-50 to-green-50 dark:from-gray-800 dark:via-purple-900/20 dark:to-blue-900/20 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Personalized Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Key Findings</h4>
              {triggerChartData.length > 0 && (
                <div className="p-4 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Your dominant spending trigger:</span> {triggerChartData[0].emoji} {triggerChartData[0].trigger} 
                    ({triggerChartData[0].count} purchases, ${triggerChartData[0].amount.toFixed(2)})
                  </p>
                </div>
              )}
              {topStores.length > 0 && (
                <div className="p-4 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Your favorite store:</span> {topStores[0].store} 
                    (${topStores[0].amount.toFixed(2)} across {topStores[0].count} purchases)
                  </p>
                </div>
              )}
              <div className="p-4 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">Spending frequency:</span> {purchases.length} purchases worth ${purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} total
                </p>
              </div>
              {timeChartData.length > 0 && (
                <div className="p-4 bg-white/70 dark:bg-gray-700/70 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Peak spending time:</span> {
                      timeChartData.sort((a, b) => b.amount - a.amount)[0]?.time
                    } (${timeChartData.sort((a, b) => b.amount - a.amount)[0]?.amount.toFixed(2)})
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Recommendations</h4>
              <div className="space-y-3">
                {triggerChartData[0]?.trigger === 'stress' && (
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      💡 Try stress-relief activities like meditation or exercise before shopping
                    </p>
                  </div>
                )}
                {topStores[0]?.count > 5 && (
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      💡 Consider setting a monthly limit for {topStores[0].store}
                    </p>
                  </div>
                )}
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    💡 Review your purchases weekly to identify patterns
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    💡 Use the 24-hour rule for purchases over your average amount
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
