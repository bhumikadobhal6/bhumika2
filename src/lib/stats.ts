import { Assignment, DashboardStats } from '@/types/database.types';
import { isOverdue } from './utils';

export function calculateDashboardStats(assignments: Assignment[], now: number = 0): DashboardStats {
  const total = assignments.length;
  let pending = 0;
  let inProgress = 0;
  let completed = 0;
  let overdue = 0;
  let upcomingCount = 0;

  assignments.forEach((assignment) => {
    if (assignment.status === 'Completed') {
      completed++;
    } else {
      if (assignment.status === 'Pending') {
        pending++;
      } else if (assignment.status === 'In Progress') {
        inProgress++;
      }

      // Check overdue vs upcoming when current timestamp is available
      if (now > 0) {
        if (isOverdue(assignment.due_date, assignment.status, now)) {
          overdue++;
        } else {
          upcomingCount++;
        }
      } else {
        upcomingCount++;
      }
    }
  });

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    pending,
    inProgress,
    completed,
    overdue,
    upcomingCount,
    completionRate,
  };
}
