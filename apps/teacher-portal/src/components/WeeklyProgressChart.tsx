import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import type { Child } from '../stores/parentStore';

interface WeeklyProgressChartProps {
  children: Child[];
}

interface ProgressData {
  day: string;
  [key: string]: number | string;
}

// Mock API function
const fetchWeeklyProgress = async (childIds: string[]): Promise<ProgressData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
      const data: ProgressData[] = days.map((day) => {
        const entry: ProgressData = { day };
        
        // Mock progress data for each child
        childIds.forEach((childId, index) => {
          const baseProgress = 60 + (index * 10);
          const randomVariation = Math.random() * 20 - 10;
          entry[`Child${index + 1}`] = Math.max(0, Math.min(100, baseProgress + randomVariation));
        });
        
        return entry;
      });
      
      resolve(data);
    }, 300);
  });
};

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ children }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weekly-progress', children.map(c => c.id)],
    queryFn: () => fetchWeeklyProgress(children.map(c => c.id)),
    enabled: children.length > 0,
  });

  if (isLoading) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading progress data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-red-600">Error loading progress data</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">No progress data available</div>
      </div>
    );
  }

  // Transform data to use child names instead of generic keys
  const transformedData = data.map(entry => {
    const newEntry: ProgressData = { day: entry.day };
    children.forEach((child, index) => {
      newEntry[child.firstName] = entry[`Child${index + 1}`] || 0;
    });
    return newEntry;
  });

  const colors = ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Weekly Progress
        </h3>
        <p className="text-sm text-gray-600">
          Daily learning progress for all children this week
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
          />
          <Legend />
          
          {children.map((child, index) => (
            <Line
              key={child.id}
              type="monotone"
              dataKey={child.firstName}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ 
                fill: colors[index % colors.length], 
                r: 4,
                strokeWidth: 0
              }}
              activeDot={{ 
                r: 6, 
                stroke: colors[index % colors.length],
                strokeWidth: 2,
                fill: '#ffffff'
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Custom tooltip component
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.dataKey}: ${Math.round(entry.value)}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};