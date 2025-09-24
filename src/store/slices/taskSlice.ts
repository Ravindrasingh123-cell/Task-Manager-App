import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import SQLite from 'react-native-sqlite-storage';
import {RootState} from '../index';

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

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'completed';
  sortBy: 'createdAt' | 'dueDate' | 'priority';
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: 'all',
  sortBy: 'createdAt',
};

// Initialize SQLite database
const initDatabase = () => {
  return SQLite.openDatabase({
    name: 'TaskManager.db',
    location: 'default',
  });
};

// Create tasks table if it doesn't exist
const createTasksTable = (db: SQLite.SQLiteDatabase) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          completed INTEGER NOT NULL DEFAULT 0,
          priority TEXT NOT NULL DEFAULT 'medium',
          dueDate TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          userId TEXT NOT NULL,
          synced INTEGER NOT NULL DEFAULT 0
        );`,
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

// Load tasks from local database
export const loadTasksFromLocal = createAsyncThunk(
  'tasks/loadFromLocal',
  async (userId: string) => {
    const db = await initDatabase();
    await createTasksTable(db);
    
    return new Promise<Task[]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC',
          [userId],
          (_, results) => {
            const tasks: Task[] = [];
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              tasks.push({
                id: row.id,
                title: row.title,
                description: row.description,
                completed: Boolean(row.completed),
                priority: row.priority,
                dueDate: row.dueDate,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                userId: row.userId,
                synced: Boolean(row.synced),
              });
            }
            resolve(tasks);
          },
          (_, error) => reject(error)
        );
      });
    });
  }
);

// Save task to local database
export const saveTaskToLocal = createAsyncThunk(
  'tasks/saveToLocal',
  async (task: Task) => {
    const db = await initDatabase();
    await createTasksTable(db);
    
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO tasks 
           (id, title, description, completed, priority, dueDate, createdAt, updatedAt, userId, synced)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            task.id,
            task.title,
            task.description,
            task.completed ? 1 : 0,
            task.priority,
            task.dueDate || null,
            task.createdAt,
            task.updatedAt,
            task.userId,
            task.synced ? 1 : 0,
          ],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }
);

// Add new task
export const addTask = createAsyncThunk(
  'tasks/add',
  async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'synced'>, {getState}) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.uid;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const task: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    // Save to local database
    await saveTaskToLocal(task);
    
    // Try to sync with Firebase if online
    if (state.network.isConnected) {
      try {
        await firestore().collection('tasks').doc(task.id).set({
          ...task,
          synced: true,
        });
        task.synced = true;
        await saveTaskToLocal(task);
      } catch (error) {
        console.log('Failed to sync with Firebase:', error);
      }
    }

    return task;
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/update',
  async (taskData: Partial<Task> & {id: string}, {getState}) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.uid;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const updatedTask: Task = {
      ...taskData,
      updatedAt: new Date().toISOString(),
      synced: false,
    } as Task;

    // Update local database
    await saveTaskToLocal(updatedTask);
    
    // Try to sync with Firebase if online
    if (state.network.isConnected) {
      try {
        await firestore().collection('tasks').doc(updatedTask.id).update({
          ...updatedTask,
          synced: true,
        });
        updatedTask.synced = true;
        await saveTaskToLocal(updatedTask);
      } catch (error) {
        console.log('Failed to sync with Firebase:', error);
      }
    }

    return updatedTask;
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId: string, {getState}) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.uid;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const db = await initDatabase();
    
    // Delete from local database
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM tasks WHERE id = ? AND userId = ?',
          [taskId, userId],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
    
    // Try to delete from Firebase if online
    if (state.network.isConnected) {
      try {
        await firestore().collection('tasks').doc(taskId).delete();
      } catch (error) {
        console.log('Failed to delete from Firebase:', error);
      }
    }

    return taskId;
  }
);

// Sync tasks with Firebase
export const syncTasksWithFirebase = createAsyncThunk(
  'tasks/syncWithFirebase',
  async (_, {getState}) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.uid;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Get unsynced tasks from local database
    const db = await initDatabase();
    const unsyncedTasks = await new Promise<Task[]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM tasks WHERE userId = ? AND synced = 0',
          [userId],
          (_, results) => {
            const tasks: Task[] = [];
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              tasks.push({
                id: row.id,
                title: row.title,
                description: row.description,
                completed: Boolean(row.completed),
                priority: row.priority,
                dueDate: row.dueDate,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                userId: row.userId,
                synced: Boolean(row.synced),
              });
            }
            resolve(tasks);
          },
          (_, error) => reject(error)
        );
      });
    });

    // Sync each unsynced task
    for (const task of unsyncedTasks) {
      try {
        await firestore().collection('tasks').doc(task.id).set({
          ...task,
          synced: true,
        });
        
        // Update local database to mark as synced
        task.synced = true;
        await saveTaskToLocal(task);
      } catch (error) {
        console.log(`Failed to sync task ${task.id}:`, error);
      }
    }

    return unsyncedTasks.length;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<'all' | 'pending' | 'completed'>) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'createdAt' | 'dueDate' | 'priority'>) => {
      state.sortBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load tasks from local
      .addCase(loadTasksFromLocal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadTasksFromLocal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(loadTasksFromLocal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load tasks';
      })
      // Add task
      .addCase(addTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
        state.error = null;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add task';
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export const {setFilter, setSortBy, clearError} = taskSlice.actions;
export default taskSlice.reducer;
