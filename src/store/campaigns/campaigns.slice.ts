import { createSlice } from '@reduxjs/toolkit';
import { campaign } from './types';

interface campaignsState {
  campaigns: campaign[];
  thunks: {};
}

const initialState: campaignsState = {
  campaigns: [],
  thunks: {},
};

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    resetCampaigns: () => {
      return initialState;
    },
  },
});

export default campaignsSlice.reducer;
