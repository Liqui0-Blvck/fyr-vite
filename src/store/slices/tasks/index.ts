import { combineReducers } from '@reduxjs/toolkit';
import tasks, { TasksState } from './tasksSlice';

// Combinar reducers
const reducer = combineReducers({
  tasks: tasks
});

// Tipado del estado global relacionado con la autenticación
export type AuthStates = {
  prospect: TasksState; 
};

export default reducer;
