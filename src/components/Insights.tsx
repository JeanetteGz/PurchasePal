import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDay, format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, subMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Calendar, TrendingUp, ShoppingBag, Clock, Download, DollarSign, Target, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Purchase } from '@/pages/Index';

interface InsightsProps {
  purchases: Purchase[];
}

interface CategorySpending {
  category: string;
  amount: number;
}

interface MonthlySpending {
  month: string;
  amount: number;
}

interface DayOfWeekSpending {
  day: string;
  amount: number;
  count: number;
}

const COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#6366f1', '#a21caf', '#f472b6', '#34d399'
];

const DARK_COLORS = [
  '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171',
  '#f472b6', '#818cf8', '#c084fc', '#fb7185', '#4ade80'
];

export const Insights = ({ purchases }: InsightsProps) => {
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([]);
  const [dayOfWeekSpending, setDayOfWeekSpending] = useState<DayOfWeekSpending[]>([]);
  const [totalSpending, setTotalSpending] = useState<number>(0);
  const [averageSpending, setAverageSpending] = useState<number>(0);
  const [highestSpending, setHighestSpending] = useState<{ item: string; amount: number }>({ item: '', amount: 0 });
  const [spendingTriggers, setSpendingTriggers] = useState<{ trigger: string; count: number }[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlySpending[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: subMonths(new Date(), 1),
    end: new Date(),
  });

  useEffect(() => {
    calculateInsights();
  }, [purchases, dateRange]);

  const calculateInsights = () => {
    const filteredPurchases = purchases.filter(purchase =>
      isWithinInterval(new Date(purchase.date), { start: dateRange.start, end: dateRange.end })
    );

    const categoryData = calculateCategorySpending(filteredPurchases);
    setCategorySpending(categoryData);

    const monthlyData = calculateMonthlySpending(filteredPurchases);
    setMonthlySpending(monthlyData);

    const dayOfWeekData = getDayOfWeekData();
    setDayOfWeekSpending(dayOfWeekData);

    const total = calculateTotalSpending(filteredPurchases);
    setTotalSpending(total);

    const average = calculateAverageSpending(filteredPurchases);
    setAverageSpending(average);

    const highest = findHighestSpending(filteredPurchases);
    setHighestSpending(highest);

    const triggers = identifySpendingTriggers(filteredPurchases);
    setSpendingTriggers(triggers);

    const trend = calculateMonthlyTrend(purchases);
    setMonthlyTrend(trend);

    const recent = getRecentPurchases(filteredPurchases);
    setRecentPurchases(recent);
  };

  const calculateCategorySpending = (purchases: Purchase[]) => {
    const categoryMap: { [key: string]: number } = {};
    purchases.forEach(purchase => {
      categoryMap[purchase.item] = (categoryMap[purchase.item] || 0) + purchase.amount;
    });

    return Object.entries(categoryMap)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const calculateMonthlySpending = (purchases: Purchase[]) => {
    const monthlyMap: { [key: string]: number } = {};
    purchases.forEach(purchase => {
      const month = format(new Date(purchase.date), 'MMM');
      monthlyMap[month] = (monthlyMap[month] || 0) + purchase.amount;
    });

    return Object.entries(monthlyMap)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  const calculateTotalSpending = (purchases: Purchase[]) => {
    return purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
  };

  const calculateAverageSpending = (purchases: Purchase[]) => {
    return purchases.length > 0 ? calculateTotalSpending(purchases) / purchases.length : 0;
  };

  const findHighestSpending = (purchases: Purchase[]) => {
    let highest = { item: '', amount: 0 };
    purchases.forEach(purchase => {
      if (purchase.amount > highest.amount) {
        highest = { item: purchase.item, amount: purchase.amount };
      }
    });
    return highest;
  };

  const identifySpendingTriggers = (purchases: Purchase[]) => {
    const triggerMap: { [key: string]: number } = {};
    purchases.forEach(purchase => {
      triggerMap[purchase.trigger] = (triggerMap[purchase.trigger] || 0) + 1;
    });

    return Object.entries(triggerMap)
      .map(([trigger, count]) => ({ trigger, count }))
      .sort((a, b) => b.count - a.count);
  };

  const calculateMonthlyTrend = (purchases: Purchase[]) => {
    const today = new Date();
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => subMonths(today, i));
    const monthlyData: { [key: string]: number } = {};

    lastSixMonths.forEach(date => {
      const monthYear = format(date, 'MMM yyyy');
      monthlyData[monthYear] = 0;
    });

    purchases.forEach(purchase => {
      const purchaseDate = new Date(purchase.date);
      if (isWithinInterval(purchaseDate, { start: subMonths(today, 5), end: today })) {
        const monthYear = format(purchaseDate, 'MMM yyyy');
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + purchase.amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  const getRecentPurchases = (purchases: Purchase[]) => {
    return purchases.slice(0, 5);
  };

  const getDayOfWeekData = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayData = Array(7).fill(0).map((_, i) => ({ day: dayNames[i], amount: 0, count: 0 }));
    
    purchases.forEach(purchase => {
      const dayOfWeek = getDay(new Date(purchase.date));
      dayData[dayOfWeek].amount += purchase.amount;
      dayData[dayOfWeek].count += 1;
    });
    
    return dayData;
  };

  const downloadReceipts = () => {
    const filteredPurchases = purchases.filter(purchase =>
      isWithinInterval(new Date(purchase.date), { start: dateRange.start, end: dateRange.end })
    );

    const csvContent = [
      ['Date', 'Item', 'Store', 'Amount', 'Trigger', 'Notes'],
      ...filteredPurchases.map(purchase => [
        purchase.date,
        purchase.item,
        purchase.store,
        purchase.amount.toString(),
        purchase.trigger,
        purchase.notes || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `purchases-${format(dateRange.start, 'yyyy-MM-dd')}-to-${format(dateRange.end, 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Custom tooltip component for dark mode
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-gray-100 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value?.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Prepare data for radial chart
  const radialData = categorySpending.slice(0, 5).map((item, index) => ({
    ...item,
    fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_COLORS[index] : COLORS[index]
  }));

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Spending Insights</h2>
          <p className="text-gray-600 dark:text-gray-400">Analyze your spending patterns and habits</p>
        </div>
        <Button
          onClick={downloadReceipts}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Receipts
        </Button>
      </div>

      {/* Spending Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Spending Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Total Spending</h3>
              <p className="text-2xl">${totalSpending.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Average Purchase</h3>
              <p className="text-2xl">${averageSpending.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Highest Spending Item</h3>
              <p className="text-xl">
                {highestSpending.item} - ${highestSpending.amount.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Range */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => setDateRange({ start: subMonths(new Date(), 1), end: new Date() })} variant="outline">Last Month</Button>
            <Button onClick={() => setDateRange({ start: subMonths(new Date(), 3), end: new Date() })} variant="outline">Last 3 Months</Button>
            <Button onClick={() => setDateRange({ start: subMonths(new Date(), 6), end: new Date() })} variant="outline">Last 6 Months</Button>
            <Button onClick={() => setDateRange({ start: subMonths(new Date(), 12), end: new Date() })} variant="outline">Last Year</Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Categories - Radial Bar Chart */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <ShoppingBag className="w-5 h-5" />
            Top Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
              <RadialBar
                dataKey="amount"
                cornerRadius={10}
                fill="#8884d8"
                className="dark:opacity-90"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                iconType="circle"
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: '20px' }}
                className="text-sm dark:text-gray-300"
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Spending by Day of the Week - Area Chart */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Clock className="w-5 h-5" />
            Spending by Day of the Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dayOfWeekSpending}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
              <XAxis 
                dataKey="day" 
                className="text-xs dark:text-gray-300"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs dark:text-gray-300"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#82ca9d" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Spending - Enhanced Line Chart */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <DollarSign className="w-5 h-5" />
            Monthly Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySpending}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs dark:text-gray-300"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs dark:text-gray-300"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Spending Triggers - Enhanced Pie Chart */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Target className="w-5 h-5" />
            Spending Triggers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {spendingTriggers.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={spendingTriggers.map((trigger, index) => ({
                    ...trigger,
                    fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ trigger, percent }) => `${trigger}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                  stroke="none"
                >
                  {spendingTriggers.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                          <p className="text-gray-900 dark:text-gray-100 font-medium capitalize">{payload[0].payload.trigger}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Count: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🎯</div>
              <p>No spending triggers data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Purchases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Recent Purchases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {recentPurchases.map(purchase => (
              <li key={purchase.id} className="py-2">
                {purchase.item} - ${purchase.amount.toFixed(2)} on {format(new Date(purchase.date), 'MMM dd, yyyy')}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
