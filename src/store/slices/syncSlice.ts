import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import {RootState} from '../index';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingSyncCount: number;
  error: string | null;
}

const initialState: SyncState = {
  isSyncing: false,
  lastSyncTime: null,
  pendingSyncCount: 0,
  error: null,
};

// Sync all data with Firebase
export const syncAllData = createAsyncThunk(
  'sync/syncAllData',
  async (_, {getState, dispatch}) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.uid;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    if (!state.network.isConnected) {
      throw new Error('No internet connection');
    }

    // Sync tasks
    const {syncTasksWithFirebase} = await import('./taskSlice');
    await dispatch(syncTasksWithFirebase());

    return new Date().toISOString();
  }
);

// Get pending sync count
export const getPendingSyncCount = createAsyncThunk(
  'sync/getPendingSyncCount',
  async (_, {getState}) => {
    const state = getState() as RootState;
    const userId = state.auth.user?.uid;
    
    if (!userId) {
      return 0;
    }

    // Count unsynced tasks
    const unsyncedTasks = state.tasks.tasks.filter(task => !task.synced);
    return unsyncedTasks.length;
  }
);

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
    clearSyncError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sync all data
      .addCase(syncAllData.pending, (state) => {
        state.isSyncing = true;
        state.error = null;
      })
      .addCase(syncAllData.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.lastSyncTime = action.payload;
        state.error = null;
      })
      .addCase(syncAllData.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.error.message || 'Sync failed';
      })
      // Get pending sync count
      .addCase(getPendingSyncCount.fulfilled, (state, action) => {
        state.pendingSyncCount = action.payload;
      });
  },
});

export const {setSyncing, clearSyncError} = syncSlice.actions;
export default syncSlice.reducer;
