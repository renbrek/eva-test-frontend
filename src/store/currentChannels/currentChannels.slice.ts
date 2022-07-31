import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { privateInstance } from '../../api/axios';
import { ThunkInfo } from '../../types/types';
import { initialThunkInfoState } from '../../utils/thunks/thunks.utils';
import { Channel } from './types';

interface CurrentChannelsState {
  channels: Channel[];
  thunks: {
    fetchAllByCampaignId: ThunkInfo;
  };
}

const initialState: CurrentChannelsState = {
  channels: [],
  thunks: {
    fetchAllByCampaignId: initialThunkInfoState,
  },
};

export const thunkFetchAllByCampaignId = createAsyncThunk<Channel[], string>(
  'currentChannels/fetchAllByCampaignId',
  async (campaignId, { rejectWithValue }) => {
    try {
      const response = await privateInstance.post(
        'channels/getAllByCampaignId',
        {
          campaignId,
        }
      );

      const channels: Channel[] = await response.data;
      return channels;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const currentChannelsSlice = createSlice({
  name: 'currentChannels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(thunkFetchAllByCampaignId.pending, (state, action) => {
      state.thunks.fetchAllByCampaignId.status = 'pending';
      state.thunks.fetchAllByCampaignId.error = null;
    });
    builder.addCase(thunkFetchAllByCampaignId.fulfilled, (state, action) => {
      state.channels = action.payload;
      state.thunks.fetchAllByCampaignId.status = 'succeeded';
    });
    builder.addCase(thunkFetchAllByCampaignId.rejected, (state, action) => {
      state.thunks.fetchAllByCampaignId.status = 'failed';
      if (typeof action.payload === 'string') {
        state.thunks.fetchAllByCampaignId.error = action.payload;
      }
      if (typeof action.payload !== 'string') {
        state.thunks.fetchAllByCampaignId.error = action.error.message;
      }
    });
  },
});

export default currentChannelsSlice.reducer;
