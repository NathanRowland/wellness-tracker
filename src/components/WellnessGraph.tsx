import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WellnessEntry } from '../types';
import { format, subDays, isAfter } from 'date-fns';
import DateRangeFilter from './DateRangeFilter';
import { getRank } from '../utils/rankSystem';

interface Props {
  entries: WellnessEntry[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const metrics = Object.entries(payload[0].payload)
    .filter(([key]) => key !== 'date' && key !== 'average')
    .sort(([, a]: any, [, b]: any) => b - a);

  const average = payload[0].payload.average;
  const rank = getRank(average);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="font-bold mb-2">{label}</p>
      <div className="space-y-2 mb-2">
        <p className="text-sm text-blue-600">
          Wellness Score: {average.toFixed(1)}
        </p>
        <p className={`text-sm font-medium ${rank.color}`}>
          Rank: {rank.name}
        </p>
      </div>
      <div className="space-y-1">
        {metrics.map(([name, value]: any) => (
          <div key={name} className="flex justify-between gap-4 text-sm">
            <span className="text-gray-600">{name}:</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WellnessGraph: React.FC<Props> = ({ entries }) => {
  const [dateRange, setDateRange] = useState('30');

  const filterEntries = (entries: WellnessEntry[]) => {
    if (dateRange === 'all') return entries;
    
    const cutoffDate = subDays(new Date(), parseInt(dateRange));
    return entries.filter(entry => isAfter(new Date(entry.timestamp), cutoffDate));
  };

  const data = filterEntries(entries).map(entry => {
    const processedMetrics = entry.metrics.map(metric => ({
      ...metric,
      calculationValue: metric.name === 'Stress Levels' ? 11 - metric.value : metric.value
    }));

    const average = processedMetrics.reduce((acc, metric) => acc + metric.calculationValue, 0) / entry.metrics.length;

    return {
      date: format(new Date(entry.timestamp), 'MM/dd'),
      average,
      ...entry.metrics.reduce((acc, metric) => ({
        ...acc,
        [metric.name]: metric.value
      }), {})
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="average" stroke="#8884d8" strokeWidth={2} name="Wellness Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WellnessGraph;