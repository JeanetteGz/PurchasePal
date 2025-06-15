
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Purchase } from '@/pages/Index';
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns';

interface SpendingChartProps {
  purchases: Purchase[];
}

export const SpendingChart = ({ purchases }: SpendingChartProps) => {
  // Get data for the last 30 days
  const endDate = new Date();
  const startDate = subDays(endDate, 29);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const chartData = dateRange.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayPurchases = purchases.filter(p => p.date === dateStr);
    const dayTotal = dayPurchases.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      date: format(date, 'MMM d'),
      amount: dayTotal,
      fullDate: dateStr
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-purple-600">
            Spent: <span className="font-bold">${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#colorGradient)"
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
