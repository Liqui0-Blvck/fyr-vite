// rootReducer.ts
import { combineReducers, Reducer, AnyAction } from 'redux';
import auth, { AuthStates } from './slices/auth';
import prospect, { ProspectsState } from './slices/prospect/prospectSlice';
import client, { ClientsState } from './slices/clients/clientSlice';
import calendar, { CalendarsState } from './slices/calendar/calendarSlice';

export type RootState = {
  auth: AuthStates,
  prospect: ProspectsState,
  client: ClientsState,
  calendar: CalendarsState
};

export interface AsyncReducers {
  [key: string]: Reducer<any, AnyAction>;
}

const staticReducers = {
  auth,
  prospect,
  client,
  calendar

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
