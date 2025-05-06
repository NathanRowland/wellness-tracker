import React from 'react';
import { differenceInDays } from 'date-fns';

interface Props {
  lastEntryDate: string | null;
}

const DaysSinceLastEntry: React.FC<Props> = ({ lastEntryDate }) => {
  if (!lastEntryDate) return null;

  const daysSince = differenceInDays(new Date(), new Date(lastEntryDate));
  
  let colorClass = 'bg-green-100 text-green-800';
  if (daysSince >= 7) {
    colorClass = 'bg-red-100 text-red-800';
  } else if (daysSince >= 5) {
    colorClass = 'bg-amber-100 text-amber-800';
  }

  return (
    <div className={`px-4 py-2 rounded-full ${colorClass} font-semibold text-sm`}>
      {daysSince} days since last entry
    </div>
  );
};

export default DaysSinceLastEntry;