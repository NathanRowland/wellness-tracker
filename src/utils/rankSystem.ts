export interface Rank {
  name: string;
  minScore: number;
  color: string;
}

export const ranks: Rank[] = [
  { name: 'Beginner', minScore: 0, color: 'text-gray-600' },
  { name: 'Novice', minScore: 3, color: 'text-green-600' },
  { name: 'Intermediate', minScore: 5, color: 'text-blue-600' },
  { name: 'Advanced', minScore: 7, color: 'text-purple-600' },
  { name: 'Master', minScore: 8.5, color: 'text-amber-600' },
  { name: 'Elite', minScore: 9.5, color: 'text-red-600' }
];

export function getRank(score: number): Rank {
  return ranks.reduce((prev, current) => {
    return score >= current.minScore ? current : prev;
  }, ranks[0]);
}