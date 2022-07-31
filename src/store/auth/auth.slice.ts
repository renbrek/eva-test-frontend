import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { JwtTokens, ThunkInfo } from '../../types/types';
import { privateInstance, publicInstance } from '../../api/axios';

import { AccessTokenService } from '../../services/AccessTokenService';
import { RefreshTokenService } from '../../services/RefreshTokenService';
import { initialThunkInfoState } from '../../utils/thunks/thunks.utils';

interface AuthState {
  isAuthenticated: boolean;
  thunks: {
    register: ThunkInfo;
    login: ThunkInfo;
    logout: ThunkInfo;
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  thunks: {
    register: initialThunkInfoState,
    login: initialThunkInfoState,
    logout: initialThunkInfoState,
  },
};

export const thunkRegister = createAsyncThunk<
  JwtTokens,
  { email: string; password: string }
>(
  'auth/register',
  async (params: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await publicInstance.post('auth/local/signup', {
        email: params.email.toLowerCase().trim(),
        password: params.password.trim(),
      });

      const tokens: JwtTokens = await response.data;
      return tokens;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const thunkLogin = createAsyncThunk<
  JwtTokens,
  { email: string; password: string }
>('auth/login', async (params, { rejectWithValue }) => {
  try {
    const response = await publicInstance.post('auth/local/signin', {
      email: params.email.toLowerCase().trim(),
      password: params.password.trim(),
    });

    const tokens: JwtTokens = await response.data;
    return tokens;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const thunkLogout = createAsyncThunk<void, void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await privateInstance.post('auth/logout');
      return;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //thunkRegister
    builder.addCase(thunkRegister.pending, (state) => {
      state.thunks.register.status = 'pending';
      state.thunks.register.error = null;
    });
    builder.addCase(thunkRegister.fulfilled, (state, action) => {
      AccessTokenService.setToken(action.payload.access_token);
      RefreshTokenService.setToken(action.payload.refresh_token);
      state.thunks.register.status = 'succeeded';
      state.isAuthenticated = true;
    });
    builder.addCase(thunkRegister.rejected, (state, action) => {
      state.thunks.register.status = 'failed';
      if (typeof action.payload === 'string') {
        state.thunks.register.error = action.payload;
      }
      if (typeof action.payload !== 'string') {
        state.thunks.register.error = action.error.message;
      }
    });
    //thunkLogin
    builder.addCase(thunkLogin.pending, (state, action) => {
      state.thunks.login.status = 'pending';
      state.thunks.login.error = null;
    });
    builder.addCase(thunkLogin.fulfilled, (state, action) => {
      AccessTokenService.setToken(action.payload.access_token);
      RefreshTokenService.setToken(action.payload.refresh_token);
      state.thunks.login.status = 'succeeded';
      state.isAuthenticated = true;
    });
    builder.addCase(thunkLogin.rejected, (state, action) => {
      state.thunks.login.status = 'failed';
      if (typeof action.payload === 'string') {
        state.thunks.login.error = action.payload;
      }
      if (typeof action.payload !== 'string') {
        state.thunks.login.error = action.error.message;
      }
    });
    //thunkLogout
    builder.addCase(thunkLogout.pending, (state, action) => {
      state.thunks.logout.status = 'pending';
      state.thunks.logout.error = null;
    });
    builder.addCase(thunkLogout.fulfilled, (state, action) => {
      AccessTokenService.removeToken();
      RefreshTokenService.removeToken();
      state.thunks.logout.status = 'succeeded';
      state.isAuthenticated = false;
      state.thunks = initialState.thunks;
    });
    builder.addCase(thunkLogout.rejected, (state, action) => {
      state.thunks.logout.status = 'failed';
      if (typeof action.payload === 'string') {
        state.thunks.logout.error = action.payload;
      }
      if (typeof action.payload !== 'string') {
        state.thunks.logout.error = action.error.message;
      }
    });
  },
});

export default authSlice.reducer;
