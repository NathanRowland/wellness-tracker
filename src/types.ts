export interface WellnessMetric {
  id: string;
  name: string;
  value: number;
}

export interface WellnessEntry {
  id: string;
  timestamp: string;
  metrics: WellnessMetric[];
}