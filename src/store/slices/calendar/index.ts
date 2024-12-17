import { combineReducers } from '@reduxjs/toolkit';
import calendar, { CalendarsState } from './calendarSlice';

// Combinar reducers
const reducer = combineReducers({
  calendar: calendar
});

// Tipado del estado global relacionado con la autenticación
export type CalendarState = {
  prospect: CalendarsState; 
};

export default reducer;
