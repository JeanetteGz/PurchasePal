
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Purchase } from '@/pages/Index';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  // Calculate trigger statistics
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
      percentage: ((stats.count / purchases.length) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  // Store statistics
  const storeStats = purchases.reduce((acc, purchase) => {
    const store = purchase.store;
    if (!acc[store]) {
      acc[store] = { count: 0, total: 0 };
    }
    acc[store].count += 1;
    acc[store].total += purchase.amount;
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  const topStores = Object.entries(storeStats)
    .map(([store, stats]) => ({
      store,
      count: stats.count,
      amount: stats.total
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

  const pieData = triggerChartData.map((item, index) => ({
    name: item.trigger,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

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
    <div className="space-y-6">
      {/* Top Triggers */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧠 Your Top Spending Triggers
          </CardTitle>
          <p className="text-sm text-gray-600">Understanding what drives your impulsive purchases</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {triggerChartData.map((item, index) => (
                <div key={item.trigger} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <div className="font-medium text-gray-900">{item.trigger}</div>
                      <div className="text-sm text-gray-500">{item.count} purchases • {item.percentage}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${item.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">total spent</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spending by Trigger */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Spending by Trigger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={triggerChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="trigger" 
                  stroke="#6b7280"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Amount Spent']}
                  labelFormatter={(label) => `Trigger: ${label}`}
                />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Stores */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏪 Your Favorite Stores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topStores.map((store, index) => (
              <div key={store.store} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-purple-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{store.store}</div>
                    <div className="text-sm text-gray-500">{store.count} purchases</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${store.amount.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">total spent</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights Summary */}
      <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {triggerChartData.length > 0 && (
              <div className="p-4 bg-white/70 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">Your top trigger:</span> {triggerChartData[0].emoji} {triggerChartData[0].trigger} 
                  ({triggerChartData[0].count} purchases, ${triggerChartData[0].amount.toFixed(2)})
                </p>
              </div>
            )}
            {topStores.length > 0 && (
              <div className="p-4 bg-white/70 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">Your go-to store:</span> {topStores[0].store} 
                  (${topStores[0].amount.toFixed(2)} across {topStores[0].count} purchases)
                </p>
              </div>
            )}
            <div className="p-4 bg-white/70 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Total tracked purchases:</span> {purchases.length} items worth ${purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
