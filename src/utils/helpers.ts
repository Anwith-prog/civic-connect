import { ComplaintStage, Priority, ComplaintCategory } from '../types';

export function getStatusBadgeStyle(status: ComplaintStage) {
  switch (status) {
    case 'Submitted':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        pill: 'border border-amber-300 text-amber-700 bg-amber-50',
      };
    case 'Under Review':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
        pill: 'border border-blue-400 text-blue-700 bg-blue-50',
      };
    case 'Assigned':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800',
        pill: 'border border-indigo-400 text-indigo-700 bg-indigo-50',
      };
    case 'In Progress':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-600 dark:text-amber-300',
        border: 'border-amber-300 dark:border-amber-700',
        pill: 'border border-amber-400 text-amber-600 bg-amber-50/50',
      };
    case 'Resolved':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
        pill: 'bg-emerald-500 text-white font-medium',
      };
    case 'Cannot be solved':
      return {
        bg: 'bg-red-50 dark:bg-red-950/40',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-800',
        pill: 'border border-red-300 text-red-700 bg-red-50',
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        pill: 'border border-slate-300 text-slate-700',
      };
  }
}

export function getPriorityBadge(priority: Priority) {
  switch (priority) {
    case 'Emergency':
      return 'bg-red-600 text-white font-semibold animate-pulse';
    case 'High':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300';
    case 'Medium':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300';
    case 'Low':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300';
  }
}

export function getCategoryColor(category: ComplaintCategory) {
  switch (category) {
    case 'Road Damage':
      return '#2563eb';
    case 'Garbage':
      return '#10b981';
    case 'Streetlight':
      return '#f59e0b';
    case 'Drainage/Sewage':
      return '#06b6d4';
    case 'Water Supply':
    case 'Borewell & Watersupply':
      return '#0284c7';
    case 'Electricity':
      return '#8b5cf6';
    case 'Bus Stand Maintenance':
      return '#10b981';
    case 'Amenities Petitions':
      return '#3b82f6';
    case 'Canel Cleaning':
      return '#06b6d4';
    default:
      return '#64748b';
  }
}
