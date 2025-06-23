export type ActivityType = 'register' | 'newPost' | 'purchase' | 'withdrawal' | 'report';

export interface Activity {
  id: number;
  type: ActivityType;
  title: string;
  subtitle?: string;
  timestamp: Date;
  amount?: number;
}