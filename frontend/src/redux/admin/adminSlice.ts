import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AdminStateInterface } from '../../modle';

const initialState: AdminStateInterface = {
  email: '',
  isSuperAdmin: false,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<AdminStateInterface>) => {
      state.email = action.payload.email;
      state.isSuperAdmin = action.payload.isSuperAdmin;
    },
    clearAdmin: (state) => {
      state.email = '';
      state.isSuperAdmin = false;

      localStorage.setItem('canteenhubadmin', '');
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;

export default adminSlice.reducer;
