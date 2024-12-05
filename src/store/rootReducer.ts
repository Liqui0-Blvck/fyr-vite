// rootReducer.ts
import { combineReducers, Reducer, AnyAction } from 'redux';
import auth, { AuthStates } from './slices/auth';
import prospect, { ProspectsState } from './slices/prospect/prospectSlice';

export type RootState = {
  auth: AuthStates,
  prospect: ProspectsState
};

export interface AsyncReducers {
  [key: string]: Reducer<any, AnyAction>;
}

const staticReducers = {
  auth,
  prospect
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
