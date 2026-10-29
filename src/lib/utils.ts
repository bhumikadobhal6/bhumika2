import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string (e.g. ISO) into a human readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format date for input datetime-local: YYYY-MM-DDTHH:mm
 */
export function formatDateTimeLocal(dateString?: string): string {
  const d = dateString ? new Date(dateString) : new Date();
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Calculate if an assignment is overdue:
 * An assignment is overdue if due_date is in the past AND status is NOT 'Completed'
 */
export function isOverdue(dueDate: string, status: string, now: number = 0): boolean {
  if (status === 'Completed') return false;
  if (now === 0) return false;
  const due = new Date(dueDate).getTime();
  return due < now;
}

/**
 * Get the number of calendar days between today and the due date.
 * 0 means "today", 1 means "tomorrow", -1 means "yesterday".
 * Using calendar days (instead of raw 24h periods) keeps labels such as
 * "Due today" accurate for deadlines later the same day.
 */
export function getDaysRemaining(dueDate: string, now: number = 0): number {
  if (now === 0) return 0;
  const due = new Date(dueDate);
  const current = new Date(now);
  if (isNaN(due.getTime())) return 0;

  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const currentDay = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate()
  ).getTime();
  const dayMs = 1000 * 60 * 60 * 24;

  return Math.round((dueDay - currentDay) / dayMs);
}

