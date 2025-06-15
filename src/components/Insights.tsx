
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDay, format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, subMonths, startOfWeek, endOfWeek, differenceInDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Calendar, TrendingUp, ShoppingBag, Clock, Download, DollarSign, Target, AlertCircle, TrendingDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Purchase } from '@/pages/Index';

interface InsightsProps {
  purchases: Purchase[];
}

interface CategorySpending {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

interface MonthlySpending {
  month: string;
  amount: number;
  count: number;
}

interface DayOfWeekSpending {
  day: string;
  amount: number;
  count: number;
  avgAmount: number;
}

interface SpendingMetrics {
  totalSpent: number;
  avgDaily: number;
  avgPerTransaction: number;
  totalTransactions: number;
  topCategory: string;
  topCategoryAmount: number;
  mostExpensiveDay: string;
  impulsePurchases: number;
  monthlyTrend: 'up' | 'down' | 'stable';
  trendPercentage: number;
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
  const [spendingMetrics, setSpendingMetrics] = useState<SpendingMetrics>({
    totalSpent: 0,
    avgDaily: 0,
    avgPerTransaction: 0,
    totalTransactions: 0,
    topCategory: '',
    topCategoryAmount: 0,
    mostExpensiveDay: '',
    impulsePurchases: 0,
    monthlyTrend: 'stable',
    trendPercentage: 0
  });
  const [spendingTriggers, setSpendingTriggers] = useState<{ trigger: string; count: number; amount: number }[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: subMonths(new Date(), 3),
    end: new Date(),
  });

  useEffect(() => {
    calculateInsights();
  }, [purchases, dateRange]);

  const calculateInsights = () => {
    const filteredPurchases = purchases.filter(purchase =>
      isWithinInterval(new Date(purchase.date), { start: dateRange.start, end: dateRange.end })
    );

    // Calculate comprehensive metrics
    const metrics = calculateSpendingMetrics(filteredPurchases);
    setSpendingMetrics(metrics);

    // Calculate category spending with more details
    const categoryData = calculateDetailedCategorySpending(filteredPurchases);
    setCategorySpending(categoryData);

    // Calculate monthly spending with transaction counts
    const monthlyData = calculateDetailedMonthlySpending(filteredPurchases);
    setMonthlySpending(monthlyData);

    // Calculate day of week patterns
    const dayOfWeekData = calculateDayOfWeekSpending(filteredPurchases);
    setDayOfWeekSpending(dayOfWeekData);

    // Calculate spending triggers with amounts
    const triggers = calculateSpendingTriggers(filteredPurchases);
    setSpendingTriggers(triggers);
  };

  const calculateSpendingMetrics = (purchases: Purchase[]): SpendingMetrics => {
    const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
    const totalTransactions = purchases.length;
    const avgPerTransaction = totalTransactions > 0 ? totalSpent / totalTransactions : 0;
    
    const daysDiff = differenceInDays(dateRange.end, dateRange.start) || 1;
    const avgDaily = totalSpent / daysDiff;

    // Find top category
    const categoryTotals: { [key: string]: number } = {};
    purchases.forEach(p => {
      categoryTotals[p.item] = (categoryTotals[p.item] || 0) + p.amount;
    });
    const topCategoryEntry = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];
    const topCategory = topCategoryEntry ? topCategoryEntry[0] : '';
    const topCategoryAmount = topCategoryEntry ? topCategoryEntry[1] : 0;

    // Find most expensive day
    const dayTotals: { [key: string]: number } = {};
    purchases.forEach(p => {
      const day = format(new Date(p.date), 'EEEE');
      dayTotals[day] = (dayTotals[day] || 0) + p.amount;
    });
    const mostExpensiveDay = Object.entries(dayTotals).sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    // Count impulse purchases (trigger: boredom, stress, social media, etc.)
    const impulseTriggers = ['boredom', 'stress', 'social media', 'advertising', 'peer pressure'];
    const impulsePurchases = purchases.filter(p => 
      impulseTriggers.includes(p.trigger.toLowerCase())
    ).length;

    // Calculate monthly trend
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth - 1;
    const currentMonthSpending = purchases.filter(p => 
      new Date(p.date).getMonth() === currentMonth
    ).reduce((sum, p) => sum + p.amount, 0);
    const lastMonthSpending = purchases.filter(p => 
      new Date(p.date).getMonth() === lastMonth
    ).reduce((sum, p) => sum + p.amount, 0);

    let monthlyTrend: 'up' | 'down' | 'stable' = 'stable';
    let trendPercentage = 0;

    if (lastMonthSpending > 0) {
      trendPercentage = ((currentMonthSpending - lastMonthSpending) / lastMonthSpending) * 100;
      if (Math.abs(trendPercentage) > 5) {
        monthlyTrend = trendPercentage > 0 ? 'up' : 'down';
      }
    }

    return {
      totalSpent,
      avgDaily,
      avgPerTransaction,
      totalTransactions,
      topCategory,
      topCategoryAmount,
      mostExpensiveDay,
      impulsePurchases,
      monthlyTrend,
      trendPercentage: Math.abs(trendPercentage)
    };
  };

  const calculateDetailedCategorySpending = (purchases: Purchase[]): CategorySpending[] => {
    const categoryMap: { [key: string]: { amount: number; count: number } } = {};
    const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);

    purchases.forEach(purchase => {
      if (!categoryMap[purchase.item]) {
        categoryMap[purchase.item] = { amount: 0, count: 0 };
      }
      categoryMap[purchase.item].amount += purchase.amount;
      categoryMap[purchase.item].count += 1;
    });

    return Object.entries(categoryMap)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: totalSpent > 0 ? (data.amount / totalSpent) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
  };

  const calculateDetailedMonthlySpending = (purchases: Purchase[]): MonthlySpending[] => {
    const monthlyMap: { [key: string]: { amount: number; count: number } } = {};
    
    purchases.forEach(purchase => {
      const monthYear = format(new Date(purchase.date), 'MMM yyyy');
      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = { amount: 0, count: 0 };
      }
      monthlyMap[monthYear].amount += purchase.amount;
      monthlyMap[monthYear].count += 1;
    });

    return Object.entries(monthlyMap)
      .map(([month, data]) => ({
        month,
        amount: data.amount,
        count: data.count
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  const calculateDayOfWeekSpending = (purchases: Purchase[]): DayOfWeekSpending[] => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayData = Array(7).fill(0).map((_, i) => ({ 
      day: dayNames[i], 
      amount: 0, 
      count: 0,
      avgAmount: 0
    }));
    
    purchases.forEach(purchase => {
      const dayOfWeek = getDay(new Date(purchase.date));
      dayData[dayOfWeek].amount += purchase.amount;
      dayData[dayOfWeek].count += 1;
    });

    dayData.forEach(day => {
      day.avgAmount = day.count > 0 ? day.amount / day.count : 0;
    });
    
    return dayData;
  };

  const calculateSpendingTriggers = (purchases: Purchase[]) => {
    const triggerMap: { [key: string]: { count: number; amount: number } } = {};
    
    purchases.forEach(purchase => {
      if (!triggerMap[purchase.trigger]) {
        triggerMap[purchase.trigger] = { count: 0, amount: 0 };
      }
      triggerMap[purchase.trigger].count += 1;
      triggerMap[purchase.trigger].amount += purchase.amount;
    });

    return Object.entries(triggerMap)
      .map(([trigger, data]) => ({
        trigger,
        count: data.count,
        amount: data.amount
      }))
      .sort((a, b) => b.amount - a.amount);
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

  // Custom tooltip component for dark mode with proper type checking
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-gray-100 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Prepare data for radial chart
  const radialData = categorySpending.slice(0, 6).map((item, index) => ({
    ...item,
    fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_COLORS[index] : COLORS[index]
  }));

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Spending Insights</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive analysis of your spending patterns</p>
        </div>
        <Button
          onClick={downloadReceipts}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Data
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Spent</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">${spendingMetrics.totalSpent.toFixed(2)}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">{spendingMetrics.totalTransactions} transactions</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Daily Average</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">${spendingMetrics.avgDaily.toFixed(2)}</p>
                <p className="text-xs text-green-600 dark:text-green-400">per day</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg Transaction</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">${spendingMetrics.avgPerTransaction.toFixed(2)}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">per purchase</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${
          spendingMetrics.monthlyTrend === 'up' 
            ? 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700' 
            : spendingMetrics.monthlyTrend === 'down'
            ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700'
            : 'from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 border-gray-200 dark:border-gray-700'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  spendingMetrics.monthlyTrend === 'up' 
                    ? 'text-red-600 dark:text-red-400' 
                    : spendingMetrics.monthlyTrend === 'down'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>Monthly Trend</p>
                <p className={`text-2xl font-bold ${
                  spendingMetrics.monthlyTrend === 'up' 
                    ? 'text-red-900 dark:text-red-100' 
                    : spendingMetrics.monthlyTrend === 'down'
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {spendingMetrics.monthlyTrend === 'stable' ? 'Stable' : `${spendingMetrics.trendPercentage.toFixed(1)}%`}
                </p>
                <p className={`text-xs ${
                  spendingMetrics.monthlyTrend === 'up' 
                    ? 'text-red-600 dark:text-red-400' 
                    : spendingMetrics.monthlyTrend === 'down'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {spendingMetrics.monthlyTrend === 'up' ? 'increase' : spendingMetrics.monthlyTrend === 'down' ? 'decrease' : 'no change'}
                </p>
              </div>
              {spendingMetrics.monthlyTrend === 'up' ? (
                <TrendingUp className="w-8 h-8 text-red-500" />
              ) : spendingMetrics.monthlyTrend === 'down' ? (
                <TrendingDown className="w-8 h-8 text-green-500" />
              ) : (
                <Target className="w-8 h-8 text-gray-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <Zap className="w-5 h-5" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-amber-900 dark:text-amber-100">Top Category</p>
              <p className="text-amber-700 dark:text-amber-300">{spendingMetrics.topCategory || 'No data'}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">${spendingMetrics.topCategoryAmount.toFixed(2)} spent</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-amber-900 dark:text-amber-100">Most Expensive Day</p>
              <p className="text-amber-700 dark:text-amber-300">{spendingMetrics.mostExpensiveDay || 'No data'}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Highest spending day</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-amber-900 dark:text-amber-100">Impulse Purchases</p>
              <p className="text-amber-700 dark:text-amber-300">{spendingMetrics.impulsePurchases} purchases</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Emotional triggers</p>
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
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setDateRange({ start: subMonths(new Date(), 1), end: new Date() })} variant="outline" size="sm">Last Month</Button>
            <Button onClick={() => setDateRange({ start: subMonths(new Date(), 3), end: new Date() })} variant="outline" size="sm">Last 3 Months</Button>
            <Button onClick={() => setDateRange({ start: subMonths(new Date(), 6), end: new Date() })} variant="outline" size="sm">Last 6 Months</Button>
            <Button onClick={() => setDateRange({ start: subMonths(new Date(), 12), end: new Date() })} variant="outline" size="sm">Last Year</Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Categories - Enhanced Radial Bar Chart */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <ShoppingBag className="w-5 h-5" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categorySpending.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData}>
                  <RadialBar
                    dataKey="amount"
                    cornerRadius={10}
                    fill="#8884d8"
                    className="dark:opacity-90"
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {categorySpending.slice(0, 6).map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: (window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_COLORS : COLORS)[index % COLORS.length] }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{category.category}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} purchases</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">${category.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{category.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p>No category data available</p>
            </div>
          )}
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

      {/* Spending Triggers - Enhanced Pie Chart */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Target className="w-5 h-5" />
            Spending Triggers Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {spendingTriggers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={spendingTriggers.slice(0, 6).map((trigger, index) => ({
                      ...trigger,
                      fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    stroke="none"
                  >
                    {spendingTriggers.slice(0, 6).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const value = payload[0].value;
                        return (
                          <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                            <p className="text-gray-900 dark:text-gray-100 font-medium capitalize">{payload[0].payload.trigger}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Amount: ${typeof value === 'number' ? value.toFixed(2) : value}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Count: {payload[0].payload.count}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {spendingTriggers.slice(0, 6).map((trigger, index) => (
                  <div key={trigger.trigger} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: (window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_COLORS : COLORS)[index % COLORS.length] }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{trigger.trigger}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{trigger.count} times</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">${trigger.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🎯</div>
              <p>No spending triggers data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
