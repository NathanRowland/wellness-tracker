import React from 'react';
import { WellnessMetric } from '../types';
import { Minus, Plus } from 'lucide-react';

interface Props {
  metric: WellnessMetric;
  onChange: (value: number) => void;
}

const MetricInput: React.FC<Props> = ({ metric, onChange }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <span className="flex-1 font-medium">{metric.name}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(1, metric.value - 1))}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Minus size={20} />
        </button>
        <span className="w-8 text-center font-semibold">{metric.value}</span>
        <button
          onClick={() => onChange(Math.min(10, metric.value + 1))}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default MetricInput;