import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { privateInstance } from '../../api/axios';
import { ThunkInfo } from '../../types/types';
import { initialThunkInfoState } from '../../utils/thunks/thunks.utils';
import { User } from './types/user.types';

interface UserState {
  current: User | null;
  thunks: {
    fetchUser: ThunkInfo;
  };
}

const initialState: UserState = {
  current: null,
  thunks: {
    fetchUser: initialThunkInfoState,
  },
};

export const thunkFetchUser = createAsyncThunk<User, void>(
  'user/fetchUser',
  async () => {
    const response = await privateInstance.get('users/current');

    const user: User = await response.data;
    return user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(thunkFetchUser.pending, (state) => {
      state.thunks.fetchUser.status = 'pending';
      state.thunks.fetchUser.error = null;
    });
    builder.addCase(thunkFetchUser.fulfilled, (state, action) => {
      state.current = { id: action.payload.id, email: action.payload.email };
      state.thunks.fetchUser.status = 'succeeded';
    });
    builder.addCase(thunkFetchUser.rejected, (state, action) => {
      state.thunks.fetchUser.status = 'failed';
      if (typeof action.payload === 'string') {
        state.thunks.fetchUser.error = action.payload;
      }
      if (typeof action.payload !== 'string') {
        state.thunks.fetchUser.error = action.error.message;
      }
    });
  },
});

export default userSlice.reducer;
export const resetUser = userSlice.actions.resetUser;
