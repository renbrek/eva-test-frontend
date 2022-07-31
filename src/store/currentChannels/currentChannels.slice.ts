import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { privateInstance } from '../../api/axios';
import { ThunkInfo } from '../../types/types';
import { initialThunkInfoState } from '../../utils/thunks/thunks.utils';
import campaignsSlice from '../campaigns/campaigns.slice';
import { Channel } from './types';

interface CurrentChannelsState {
  channels: Channel[];
  thunks: {
    fetchAllByCampaignId: ThunkInfo;
    updateChannelById: ThunkInfo;
  };
}

const initialState: CurrentChannelsState = {
  channels: [],
  thunks: {
    fetchAllByCampaignId: initialThunkInfoState,
    updateChannelById: initialThunkInfoState,
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

export const thunkUpdateChannelById = createAsyncThunk<void, Channel>(
  'currentChannels/updateChannelById',
  async (channel, { rejectWithValue }) => {
    try {
      await privateInstance.put('channels/updateById', {
        channelId: channel.id,
        isActive: channel.isActive,
        text: channel.text,
        isInlineKeyboard: channel.isInlineKeyboard,
        buttons: channel.buttons,
      });
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const currentChannelsSlice = createSlice({
  name: 'currentChannels',
  initialState,
  reducers: {
    resetCurrentChannels: () => {
      return initialState;
    },
    setText: (state, action) => {
      state.channels[action.payload.i].text === action.payload.text;
    },
  },
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

const { actions, reducer } = currentChannelsSlice;
export const { resetCurrentChannels, setText } = actions;
export default reducer;
