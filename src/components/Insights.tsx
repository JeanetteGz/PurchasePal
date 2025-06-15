import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDay, format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, subMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
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

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Top Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Spending by Day of the Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dayOfWeekSpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Monthly Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Spending Triggers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {spendingTriggers.map(trigger => (
              <li key={trigger.trigger} className="py-2">
                {trigger.trigger} - {trigger.count} times
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

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
