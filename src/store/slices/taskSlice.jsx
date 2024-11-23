// taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk untuk mengambil tasks berdasarkan projectId dan todoListId
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ projectId, todoListId, token }) => {
    const response = await fetch(
      `https://todolist-api.ridhoyudiana.my.id/api/projects/${projectId}/todoLists/${todoListId}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.tasks;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default taskSlice.reducer;
