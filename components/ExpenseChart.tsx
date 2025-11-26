'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseChartProps {
  data: { category: string; total: number }[];
}

const COLORS = [
  '#0ea5e9',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#6366f1',
  '#f97316',
  '#06b6d4',
];

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Expenses by Category</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">No expenses to display</p>
      )}
    </div>
  );
}
