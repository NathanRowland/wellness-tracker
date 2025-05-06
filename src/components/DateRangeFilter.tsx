import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const DateRangeFilter: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Time Range:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="30">Last 30 Days</option>
        <option value="90">Last 90 Days</option>
        <option value="365">Last Year</option>
        <option value="all">All Time</option>
      </select>
    </div>
  );
}

export default DateRangeFilter;