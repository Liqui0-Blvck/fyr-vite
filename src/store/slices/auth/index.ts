import { combineReducers } from '@reduxjs/toolkit';
import session, { AuthState } from './authSlices';
import user, { UserState } from './userSlice';

// Combinar reducers
const reducer = combineReducers({
    session, // Aquí estás agregando el reducer de sesión
    user, // Aquí estás agregando el reducer de usuario
});

// Tipado del estado global relacionado con la autenticación
export type AuthStates = {
    session: AuthState; // Relaciona correctamente el estado del slice con su tipado
    user: UserState; // Relaciona correctamente el estado del slice con su tipado
};

export default reducer;
