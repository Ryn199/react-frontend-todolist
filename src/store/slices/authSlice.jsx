// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://todolist-api.ridhoyudiana.my.id';

// Async Thunk untuk login
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, credentials);
    return response.data; // Pastikan response.data mengandung username atau data lainnya
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});

// Async Thunk untuk register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register`, {
        name,
        email,
        password,
      });
      return response.data; // Data dari response API
    } catch (error) {
      // Tangkap error dari validasi atau lainnya
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // Untuk menyimpan data pengguna (username, token, dll)
    loading: false,
    error: null,
    status: 'idle', // Status untuk operasi async (idle, loading, succeeded, failed)
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Simpan data user dari response API
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Simpan data user dari response API
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload.message || 'Registration failed'; // Error dari API
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
