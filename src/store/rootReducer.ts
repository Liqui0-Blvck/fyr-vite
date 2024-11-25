// rootReducer.ts
import { combineReducers, Reducer, AnyAction } from 'redux';
import auth, { AuthState } from './slices/auth';
import gimnasio, { GimnasioState } from './slices/gimnasio';
import sucursal, { SucursalState } from './slices/surcursal';
import miembro, { MiembroState } from './slices/miembros';

export type RootState = {
  auth: AuthState
  gimnasio: GimnasioState
  sucursal: SucursalState
  miembro: MiembroState
};

export interface AsyncReducers {
  [key: string]: Reducer<any, AnyAction>;
}

const staticReducers = {
  auth,
  gimnasio,
  sucursal,
  miembro
};

const rootReducer = (asyncReducers?: AsyncReducers) => (
  state: RootState | undefined,
  action: AnyAction
) => {
  const combinedReducer = combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
  return combinedReducer(state, action);
};

export default rootReducer;
