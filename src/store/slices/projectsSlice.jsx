// slices/projectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (token) => {
    const response = await fetch('https://todolist-api.ridhoyudiana.my.id/api/projects', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch projects');
    return await response.json();
  }
);

export const addProject = createAsyncThunk(
  'projects/addProject',
  async ({ token, project }) => {
    const response = await fetch('https://todolist-api.ridhoyudiana.my.id/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to add project');
    return await response.json();
  }
);



const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload); // Tambahkan proyek baru ke state
      });
  },
});

export default projectsSlice.reducer;
