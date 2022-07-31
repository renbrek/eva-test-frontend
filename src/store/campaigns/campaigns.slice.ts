import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { privateInstance } from '../../api/axios';
import { ThunkInfo } from '../../types/types';
import { initialThunkInfoState } from '../../utils/thunks/thunks.utils';
import { Campaign } from './types';

interface CampaignsState {
  campaigns: Campaign[];
  thunks: {
    createCampaign: ThunkInfo;
    fetchCampaigns: ThunkInfo;
    deleteCampaignById: ThunkInfo;
  };
}

const initialState: CampaignsState = {
  campaigns: [],
  thunks: {
    createCampaign: initialThunkInfoState,
    fetchCampaigns: initialThunkInfoState,
    deleteCampaignById: initialThunkInfoState,
  },
};

export const thunkCreateCampaign = createAsyncThunk<void, string>(
  'campaigns/createCampaign',
  async (name, { rejectWithValue }) => {
    try {
      const response = await privateInstance.post('campaigns/create', {
        name,
      });
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const thunkFetchCampaigns = createAsyncThunk<Campaign[], void>(
  'campaigns/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await privateInstance.get('campaigns/all');

      const campaigns: Campaign[] = await response.data;

      return campaigns;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const thunkDeleteCampaignById = createAsyncThunk<void, string>(
  'campaigns/deleteCampaignById',
  async (campaignId, { rejectWithValue }) => {
    try {
      await privateInstance.delete('campaigns/deleteById', {
        data: {
          campaignId,
        },
      });
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    resetCampaigns: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    //thunkCreateCampaign
    builder.addCase(thunkCreateCampaign.pending, (state, action) => {
      state.thunks.createCampaign.status = 'pending';
      state.thunks.createCampaign.error = null;
    });
    builder.addCase(thunkCreateCampaign.fulfilled, (state, action) => {
      state.thunks.createCampaign.status = 'succeeded';
    });
    builder.addCase(thunkCreateCampaign.rejected, (state, action) => {
      state.thunks.createCampaign.status = 'failed';
      if (typeof action.payload === 'string') {
        state.thunks.createCampaign.error = action.payload;
      }
      if (typeof action.payload !== 'string') {
        state.thunks.createCampaign.error = action.error.message;
      }
    });
    //thunkFetchCampaigns
    builder.addCase(thunkFetchCampaigns.pending, (state, action) => {
      state.thunks.fetchCampaigns.status = 'pending';
      state.thunks.fetchCampaigns.error = null;
    });
    builder.addCase(thunkFetchCampaigns.fulfilled, (state, action) => {
      state.campaigns = action.payload;
      state.thunks.fetchCampaigns.status = 'succeeded';
    });
    builder.addCase(thunkFetchCampaigns.rejected, (state, action) => {
      state.thunks.fetchCampaigns.status = 'failed';
      if (typeof action.payload === 'string') {
        state.thunks.fetchCampaigns.error = action.payload;
      }
      if (typeof action.payload !== 'string') {
        state.thunks.fetchCampaigns.error = action.error.message;
      }
    });
    //thunkDeleteCampaignById
    builder.addCase(thunkDeleteCampaignById.pending, (state, action) => {
      state.thunks.deleteCampaignById.status = 'pending';
      state.thunks.deleteCampaignById.error = null;
    });
    builder.addCase(thunkDeleteCampaignById.fulfilled, (state, action) => {
      state.thunks.deleteCampaignById.status = 'succeeded';
    });
    builder.addCase(thunkDeleteCampaignById.rejected, (state, action) => {
      state.thunks.deleteCampaignById.status = 'failed';
      if (typeof action.payload === 'string') {
        state.thunks.deleteCampaignById.error = action.payload;
      }
      if (typeof action.payload !== 'string') {
        state.thunks.deleteCampaignById.error = action.error.message;
      }
    });
  },
});

export default campaignsSlice.reducer;
export const resetCampaigns = campaignsSlice.actions.resetCampaigns;
