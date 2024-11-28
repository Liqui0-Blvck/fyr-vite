// rootReducer.ts
import { combineReducers, Reducer, AnyAction } from 'redux';
import auth, { AuthStates } from './slices/auth';
import user, { UserState } from './slices/auth/userSlice';

export type RootState = {
  auth: AuthStates,
};

export interface AsyncReducers {
  [key: string]: Reducer<any, AnyAction>;
}

const staticReducers = {
  auth
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
