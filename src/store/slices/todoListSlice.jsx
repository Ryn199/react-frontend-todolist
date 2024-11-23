import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk untuk mengambil data todo list
export const fetchTodoLists = createAsyncThunk(
  'todoLists/fetchTodoLists',
  async ({ projectId, token }) => {
    try {
      const response = await axios.get(
        `https://todolist-api.ridhoyudiana.my.id/api/projects/${projectId}/todolists`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan token ke headers
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

const todoListSlice = createSlice({
  name: 'todoLists',
  initialState: {
    todoLists: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {}, // Tidak ada aksi tambahan saat ini
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodoLists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodoLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todoLists = action.payload; // Ambil data todo lists dari API
      })
      .addCase(fetchTodoLists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default todoListSlice.reducer;
