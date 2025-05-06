import React from 'react';
import { Rank, ranks } from '../utils/rankSystem';

interface Props {
  rank: Rank;
}

const RankBadge: React.FC<Props> = ({ rank }) => {
  return (
    <div className="relative group">
      <div className={`px-4 py-2 rounded-full ${rank.color.replace('text-', 'bg-').replace('600', '100')} ${rank.color} font-semibold text-sm`}>
        {rank.name}
      </div>
      
      <div className="absolute left-0 top-full mt-2 w-48 p-3 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
        <h4 className="font-semibold mb-2">Rank Levels</h4>
        <div className="space-y-1">
          {[...ranks].reverse().map((r) => (
            <div 
              key={r.name} 
              className={`text-sm ${r === rank ? 'font-bold ' + r.color : 'text-gray-600'}`}
            >
              {r.name} ({r.minScore}+)
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RankBadge;