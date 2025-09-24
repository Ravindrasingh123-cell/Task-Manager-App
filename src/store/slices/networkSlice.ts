import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface NetworkState {
  isConnected: boolean;
  connectionType: string | null;
}

const initialState: NetworkState = {
  isConnected: true,
  connectionType: null,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setConnectionType: (state, action: PayloadAction<string | null>) => {
      state.connectionType = action.payload;
    },
  },
});

export const {setNetworkStatus, setConnectionType} = networkSlice.actions;
export default networkSlice.reducer;
