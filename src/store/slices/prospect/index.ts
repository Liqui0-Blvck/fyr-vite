import { combineReducers } from '@reduxjs/toolkit';
import prospect, { ProspectsState } from './prospectSlice';

// Combinar reducers
const reducer = combineReducers({
  prospect: prospect
});

// Tipado del estado global relacionado con la autenticación
export type AuthStates = {
  prospect: ProspectsState; 
};

export default reducer;
