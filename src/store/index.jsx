import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import todoListReducer from './slices/todoListSlice';
import taskReducer from './slices/taskSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    todoLists: todoListReducer,
    task: taskReducer

  },
});

export default store;
