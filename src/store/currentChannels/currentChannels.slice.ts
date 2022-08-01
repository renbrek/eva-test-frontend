import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { privateInstance } from '../../api/axios';
import { ThunkInfo } from '../../types/types';
import { initialThunkInfoState } from '../../utils/thunks/thunks.utils';
import { Channel } from './types';

interface CurrentChannelsState {
  channels: Channel[];
  thunks: {
    fetchAllByCampaignId: ThunkInfo;
    updateChannelById: ThunkInfo;
    deleteButtonById: ThunkInfo;
  };
}

const initialState: CurrentChannelsState = {
  channels: [],
  thunks: {
    fetchAllByCampaignId: initialThunkInfoState,
    updateChannelById: initialThunkInfoState,
    deleteButtonById: initialThunkInfoState,
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

export const thunkDeleteButtonById = createAsyncThunk<void, string>(
  'currentChannels/deleteButtonById',
  async (buttonId, { rejectWithValue }) => {
    try {
      await privateInstance.delete('channels/deleteButtonById', {
        data: {
          buttonId,
        },
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
      state.channels[action.payload.i].text = action.payload.text;
    },
    setActive: (state, action) => {
      state.channels[action.payload.i].isActive = action.payload.isActive;
    },
    setInline: (state, action) => {
      state.channels[action.payload.i].isInlineKeyboard =
        action.payload.isInline;
    },
    addButton: (state, action) => {
      state.channels[action.payload.i].buttons.push(action.payload.newButton);
    },
    deleteButtonById: (state, action) => {
      state.channels[action.payload.i].buttons = state.channels[
        action.payload.i
      ].buttons.filter((button) => button.id !== action.payload.buttonId);
    },
  },
  extraReducers: (builder) => {
    //thunkFetchAllByCampaignId
    builder.addCase(thunkFetchAllByCampaignId.pending, (state) => {
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
    //thunkUpdateChannelById
    builder.addCase(thunkUpdateChannelById.pending, (state) => {
      state.thunks.updateChannelById.status = 'pending';
      state.thunks.updateChannelById.error = null;
    });
    builder.addCase(thunkUpdateChannelById.fulfilled, (state) => {
      state.thunks.updateChannelById.status = 'succeeded';
    });
    builder.addCase(thunkUpdateChannelById.rejected, (state, action) => {
      state.thunks.updateChannelById.status = 'failed';
      if (typeof action.payload === 'string') {
        state.thunks.updateChannelById.error = action.payload;
      }
      if (typeof action.payload !== 'string') {
        state.thunks.updateChannelById.error = action.error.message;
      }
    });
    //thunkDeleteButtonById
    builder.addCase(thunkDeleteButtonById.pending, (state) => {
      state.thunks.deleteButtonById.status = 'pending';
      state.thunks.deleteButtonById.error = null;
    });
    builder.addCase(thunkDeleteButtonById.fulfilled, (state) => {
      state.thunks.deleteButtonById.status = 'succeeded';
    });
    builder.addCase(thunkDeleteButtonById.rejected, (state, action) => {
      state.thunks.deleteButtonById.status = 'failed';
      if (typeof action.payload === 'string') {
        state.thunks.deleteButtonById.error = action.payload;
      }
      if (typeof action.payload !== 'string') {
        state.thunks.deleteButtonById.error = action.error.message;
      }
    });
  },
});

const { actions, reducer } = currentChannelsSlice;
export const {
  resetCurrentChannels,
  setText,
  setActive,
  setInline,
  addButton,
  deleteButtonById,
} = actions;
export default reducer;
