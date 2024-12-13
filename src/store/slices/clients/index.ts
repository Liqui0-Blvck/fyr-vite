import { combineReducers } from '@reduxjs/toolkit';
import client, { ClientsState } from './clientSlice';

// Combinar reducers
const reducer = combineReducers({
  client: client
});

// Tipado del estado global relacionado con la autenticación
export type ClientState = {
  prospect: ClientsState; 
};

export default reducer;
