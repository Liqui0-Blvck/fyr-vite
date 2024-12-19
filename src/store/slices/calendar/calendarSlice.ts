// store/slices/calendarSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Event } from '../../../types/app/Events.type';
import { firestoreService } from '../../../config/firebase.config';

export interface CalendarsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: CalendarsState = {
  events: [],
  loading: false,
  error: null,
};

// ** Thunks (asynchronous actions) **

// 1. Obtener todos los eventos
export const fetchEvents = createAsyncThunk<Event[], void, { rejectValue: string }>(
  'calendar/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const eventsRef = collection(firestoreService, 'events');
      const querySnapshot = await getDocs(eventsRef);
      const events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return rejectWithValue('Error fetching events');
    }
  }
);

export const fetchEventsByUser = createAsyncThunk<Event[], { userId: string, inviteeEmail: string }, { rejectValue: string }>(
  'calendar/fetchEventsByUser',
  async ({ userId, inviteeEmail }, { rejectWithValue }) => {
    try {
      const eventsRef = collection(firestoreService, 'events');

      // Consulta que filtra por el organizador y por el correo electrónico de los invitados
      const q = query(
        eventsRef,
        where('organizer', '==', userId), // Filtra por el organizador
        where('invitees', 'array-contains', inviteeEmail) // Filtra por el correo electrónico del prospecto
      );


      // Obtener los documentos de la consulta
      const querySnapshot = await getDocs(q);

      console.log(querySnapshot.docs);

      // Mapear los documentos a un array de eventos
      const events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      console.log(events)

      // Retornar los eventos encontrados
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return rejectWithValue('Error fetching events');
    }
  }
);


// 2. Crear un evento
export const createEvent = createAsyncThunk<Event, Event, { rejectValue: string }>(
  'calendar/createEvent',
  async (newEvent, { rejectWithValue }) => {
    try {
      await addDoc(collection(firestoreService, 'events'), newEvent);
      // const event = { id: docRef.id, ...newEvent };
      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      return rejectWithValue('Error creating event');
    }
  }
);

// 3. Actualizar un evento
export const updateEvent = createAsyncThunk<Event, { id: string; eventData: Partial<Event> }, { rejectValue: string }>(
  'calendar/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const eventRef = doc(firestoreService, 'events', id);
      await updateDoc(eventRef, eventData);
      return eventData as Event;
    } catch (error) {
      console.error('Error updating event:', error);
      return rejectWithValue('Error updating event');
    }
  }
);

// 4. Eliminar un evento
export const deleteEvent = createAsyncThunk<string, string, { rejectValue: string }>(
  'calendar/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      const eventRef = doc(firestoreService, 'events', id);
      await deleteDoc(eventRef);
      return id;
    } catch (error) {
      console.error('Error deleting event:', error);
      return rejectWithValue('Error deleting event');
    }
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.events = action.payload;  // Reemplazar los eventos actuales por los nuevos
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEventsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsByUser.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.events = action.payload;  // Reemplazar los eventos con los eventos filtrados por userId y prospecto
        state.loading = false;
      })
      .addCase(fetchEventsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.push(action.payload); // Agregar nuevo evento
        state.loading = false;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.events.findIndex((event) => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.events = state.events.filter((event) => event.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default calendarSlice.reducer;

