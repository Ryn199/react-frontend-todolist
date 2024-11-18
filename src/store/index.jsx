import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectsReducer from './slices/projectsSlice';
import todoListReducer from './slices/todoListSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    todoLists: todoListReducer,

  },
});

export default store;
