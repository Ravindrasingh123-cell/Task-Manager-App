import {Task} from '../store/slices/taskSlice';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Tomorrow';
  } else if (diffInDays === -1) {
    return 'Yesterday';
  } else if (diffInDays > 1 && diffInDays <= 7) {
    return `In ${diffInDays} days`;
  } else if (diffInDays < -1 && diffInDays >= -7) {
    return `${Math.abs(diffInDays)} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'high':
      return '#FF6B6B';
    case 'medium':
      return '#FFA726';
    case 'low':
      return '#66BB6A';
    default:
      return '#9E9E9E';
  }
};

export const getPriorityLabel = (priority: Task['priority']): string => {
  switch (priority) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return 'Unknown';
  }
};

export const sortTasks = (tasks: Task[], sortBy: 'createdAt' | 'dueDate' | 'priority'): Task[] => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = {high: 3, medium: 2, low: 1};
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });
};

export const filterTasks = (tasks: Task[], filter: 'all' | 'pending' | 'completed'): Task[] => {
  switch (filter) {
    case 'pending':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
};

export const generateTaskId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
