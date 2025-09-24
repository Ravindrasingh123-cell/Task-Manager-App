export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  synced: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'completed';
  sortBy: 'createdAt' | 'dueDate' | 'priority';
}

export interface NetworkState {
  isConnected: boolean;
  connectionType: string | null;
}

export interface SyncState {
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingSyncCount: number;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  tasks: TaskState;
  network: NetworkState;
  sync: SyncState;
}
