import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Purchase } from '@/pages/Index';
import { format, subMonths, getMonth, getYear, parseISO, startOfWeek, endOfWeek, isWithinInterval, getHours, getDayOfWeek } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, Clock, Calendar, Target, Zap } from 'lucide-react';

interface InsightsProps {
  purchases: Purchase[];
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

export const Insights = ({ purchases }: InsightsProps) => {
  // Data processing and calculations
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);

  // Filter purchases within the last 6 months
  const recentPurchases = purchases.filter(p => {
    const purchaseDate = parseISO(p.date);
    return isWithinInterval(purchaseDate, { start: sixMonthsAgo, end: now });
  });

  const totalSpent = recentPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  const avgPurchase = recentPurchases.length > 0 ? totalSpent / recentPurchases.length : 0;

  // Monthly spending data
  const monthlyData = [];
  for (let i = 0; i < 6; i++) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfWeek(subMonths(now, i), { weekStartsOn: 1 });
    const monthEnd = endOfWeek(subMonths(now, i), { weekStartsOn: 1 });
    const monthPurchases = recentPurchases.filter(p => {
      const purchaseDate = parseISO(p.date);
      return isWithinInterval(purchaseDate, { start: subMonths(now, i), end: subMonths(now, i) });
    });
    const monthSpending = monthPurchases.reduce((sum, p) => sum + p.amount, 0);
    monthlyData.push({
      month: format(monthDate, 'MMM'),
      amount: monthSpending,
      count: monthPurchases.length
    });
  }
  monthlyData.reverse();

  // Spending by trigger
  const triggerSpending: { [key: string]: number } = {};
  recentPurchases.forEach(p => {
    triggerSpending[p.trigger] = (triggerSpending[p.trigger] || 0) + p.amount;
  });
  const triggerData = Object.entries(triggerSpending)
    .map(([trigger, amount]) => ({ name: trigger, value: amount }))
    .sort((a, b) => b.value - a.value);
  const topTrigger = triggerData[0]?.name || 'N/A';

  // Spending by store
  const storeSpending: { [key: string]: number } = {};
  const storeStats: { [key: string]: { count: number; total: number; avg: number } } = {};
  recentPurchases.forEach(p => {
    storeSpending[p.store] = (storeSpending[p.store] || 0) + p.amount;
    if (!storeStats[p.store]) {
      storeStats[p.store] = { count: 0, total: 0, avg: 0 };
    }
    storeStats[p.store].count++;
    storeStats[p.store].total += p.amount;
    storeStats[p.store].avg = storeStats[p.store].total / storeStats[p.store].count;
  });
  const storeData = Object.entries(storeSpending)
    .map(([store, amount]) => ({ name: store, value: amount }))
    .sort((a, b) => b.value - a.value);

  // Spending by day of week
  const daySpending: { [key: string]: number } = {};
  recentPurchases.forEach(p => {
    const day = format(parseISO(p.date), 'EEE');
    daySpending[day] = (daySpending[day] || 0) + p.amount;
  });
  const dayData = Object.entries(daySpending)
    .map(([day, amount]) => ({ name: day, value: amount }))
    .sort((a, b) => {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return daysOfWeek.indexOf(a.name) - daysOfWeek.indexOf(b.name);
    });

  // Spending by hour of day
  const hourSpending: { [key: string]: number } = {};
  recentPurchases.forEach(p => {
    const hour = getHours(parseISO(p.date));
    hourSpending[hour] = (hourSpending[hour] || 0) + p.amount;
  });
  const hourData = Object.entries(hourSpending)
    .map(([hour, amount]) => ({ name: hour, value: amount }))
    .sort((a, b) => Number(a.name) - Number(b.name));

  // Trigger analysis for radar chart
  const triggerRadarData = triggerData.map(t => ({
    trigger: t.name,
    amount: t.value
  }));

  // Recommendations (simplified for demonstration)
  const recommendations = [
    `Consider setting a monthly budget for ${topTrigger} purchases.`,
    `Try to reduce spending at ${storeData[0]?.name}, your top store.`,
    `Limit purchases during your peak spending hours (${hourData[0]?.name}:00).`
  ];

  // Download comprehensive report
  const downloadReport = async () => {
    try {
      const reportData = [
        `COMPREHENSIVE SPENDING REPORT`,
        `Generated: ${new Date().toLocaleDateString()}`,
        `Report Period: Last 6 Months`,
        `\n${'='.repeat(60)}`,
        `\nOVERVIEW`,
        `${'='.repeat(60)}`,
        `Total Purchases: ${recentPurchases.length}`,
        `Total Amount: $${totalSpent.toFixed(2)}`,
        `Average Purchase: $${avgPurchase.toFixed(2)}`,
        `\nMONTHLY BREAKDOWN`,
        `${'='.repeat(60)}`,
        ...monthlyData.map(m => `${m.month}: $${m.amount.toFixed(2)} (${m.count} purchases)`),
        `\nTOP SPENDING CATEGORIES`,
        `${'='.repeat(60)}`,
        ...triggerData.slice(0, 5).map((t, i) => `${i + 1}. ${t.name}: $${t.value.toFixed(2)}`),
        `\nTOP STORES`,
        `${'='.repeat(60)}`,
        ...storeData.slice(0, 5).map((s, i) => `${i + 1}. ${s.name}: $${s.value.toFixed(2)}`),
        `\nSPENDING PATTERNS`,
        `${'='.repeat(60)}`,
        `Most Active Day: ${dayData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}`,
        `Peak Spending Hour: ${hourData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}:00`,
        `\nRECOMMENDations`,
        `${'='.repeat(60)}`,
        ...recommendations,
        `\nDETAILED PURCHASE HISTORY`,
        `${'='.repeat(60)}`,
        `DATE | ITEM | STORE | AMOUNT | TRIGGER`,
        `${'='.repeat(60)}`,
        ...recentPurchases.map(p => `${p.date} | ${p.item} | ${p.store} | $${p.amount.toFixed(2)} | ${p.trigger}`)
      ].join('\n');
      
      const blob = new Blob([reportData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprehensive-spending-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">📊 Spending Insights</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Deep dive into your spending patterns and trends</p>
        </div>
        <Button
          onClick={downloadReport}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Full Report
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Avg Purchase</p>
                <p className="text-2xl font-bold">${avgPurchase.toFixed(2)}</p>
              </div>
              <Target className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">This Month</p>
                <p className="text-2xl font-bold">${monthlyData[monthlyData.length - 1].amount.toFixed(2)}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Top Trigger</p>
                <p className="text-lg font-bold capitalize">{topTrigger || 'N/A'}</p>
              </div>
              <Zap className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6-Month Spending Trend */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-gray-100">
            📈 6-Month Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => name === 'amount' ? [`$${value}`, 'Amount Spent'] : [value, 'Purchases']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  name="Amount Spent"
                  yAxisId="left"
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Number of Purchases"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">🎯 Spending by Trigger</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={triggerData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {triggerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Stores */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">🏪 Top Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={storeData.slice(0, 6)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12} 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                  />
                  <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Total Spent']} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Day of Week */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              📅 Spending by Day of Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={dayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Total Spent']} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Spending by Hour */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Clock className="w-5 h-5" />
              Spending by Hour of Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={hourData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} tickFormatter={(hour) => `${hour}:00`} />
                  <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Total Spent']}
                    labelFormatter={(hour) => `${hour}:00`}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trigger Analysis Over Time */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">🎭 Trigger Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <RadarChart data={triggerRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="trigger" fontSize={12} />
                  <PolarRadiusAxis 
                    fontSize={10} 
                    tickFormatter={(value) => `$${value}`}
                    domain={[0, 'dataMax']}
                  />
                  <Radar
                    name="Amount Spent"
                    dataKey="amount"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount Spent']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Store Performance */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">🏆 Store Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storeData.slice(0, 5).map((store, index) => (
                <div key={store.name} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium dark:text-gray-100">{store.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {storeStats[store.name]?.count || 0} purchases
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg dark:text-gray-100">${store.value.toFixed(2)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ${storeStats[store.name]?.avg.toFixed(2) || 0} avg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Recommendations */}
      <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Personalized Money-Saving Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((tip, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white/90 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
