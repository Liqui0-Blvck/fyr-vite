import { combineReducers } from '@reduxjs/toolkit';
import session, { AuthState } from './authSlices'; // Asegúrate de que 'authSlices' exporta 'AuthState' correctamente

// Combinar reducers
const reducer = combineReducers({
    session, // Aquí estás agregando el reducer de sesión
});

// Tipado del estado global relacionado con la autenticación
export type AuthStates = {
    session: AuthState; // Relaciona correctamente el estado del slice con su tipado
};

export default reducer;
