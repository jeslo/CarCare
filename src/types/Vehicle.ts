import { Comment } from './Comment';

export interface Vehicle {
  number: string;
  model: string;
  complaint: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  technicianComment: string;
  created: string;
  updated: string;
  comments: Comment[];
}
