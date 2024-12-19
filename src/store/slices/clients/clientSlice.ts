import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { firestoreService } from '../../../config/firebase.config';
import { RootState } from '../../store';
import { Client } from '../../../types/app/Client.type'; // Cambié 'Lead' a 'Client'
import { Event } from '../../../types/app/Events.type';
import { Interaction } from '../../../types/app/Interaction.type';
import { Notes } from '../../../types/app/Notes.type';
import { collection, doc, query, where, getDocs, deleteDoc, orderBy , addDoc, startAfter, limit, updateDoc } from 'firebase/firestore';
import { Investment } from '../../../types/app/Investment.type';
import { investmentRecords } from '../../../mocks/Data';
import { Strategy } from '../../../types/app/Strategies.type';

export interface PaginationInfo {
  id?: string;
  fechaCreacion: Date;
  nombre: string;
}

export interface ClientsState {
  clients: Client[];              // Cambié 'leads' a 'clients'
  client: Client | null;          // Cambié 'lead' a 'client'
  interactions: Interaction[];
  eventos: Event[];
  notes: Notes[];
  investment: Investment[];
  strategies: Strategy[];
  loading: boolean;
  error: string | null;
  errorClients: { message: string; client: Client }[];  // Cambié 'lead' a 'client'
  successFullClients: number;    // Cambié 'leads' a 'clients'
  failedClients: number;         // Cambié 'leads' a 'clients'
  lastVisible: PaginationInfo | null;
  hasMore: boolean;
}

interface FetchClientsParams {
  search?: string;
  pageSize: number;
  pageIndex?: number;
  append?: boolean;
  filters?: Record<string, string>;
}

interface FetchClientsResult {
  clients: Client[];
  lastVisible?: PaginationInfo | null;
}

const initialState: ClientsState = {
  clients: [],
  interactions: [],
  eventos: [],
  notes: [],
  investment: investmentRecords,
  strategies: [],
  client: null,
  loading: false,
  error: null,
  errorClients: [],
  successFullClients: 0,
  failedClients: 0,
  lastVisible: null,
  hasMore: true,
};

// Cambié 'lead' a 'client' y 'prospects' a 'clients' en todas las funciones.

export const getClient = createAsyncThunk<Client, string | string[], { rejectValue: string }>(
  'clients/getClientByClientId',
  async (clientID, { rejectWithValue }) => {
    try {
      const clientRef = collection(firestoreService, 'clients');
      const q = query(clientRef, where('id', '==', clientID));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`No se encontró ningún cliente con clientId: ${clientID}`);
        return rejectWithValue('El cliente no existe.');
      }

      const client = querySnapshot.docs[0].data() as Client;

      return client;
    } catch (error: any) {
      console.error(`Error al obtener el cliente con clientId ${clientID}:`, error);
      return rejectWithValue('Error al obtener el cliente.');
    }
  }
);

export const updateClient = createAsyncThunk<
  Client,
  { clientID: string | string[]; updatedData: Partial<Client> },
  { rejectValue: string }
>(
  'clients/updateClient',
  async ({ clientID, updatedData }, { rejectWithValue, dispatch }) => {
    try {
      // Referencia a la colección de clients
      const clientRef = collection(firestoreService, 'clients');

      // Consulta para encontrar el documento cuyo campo 'id' coincida con 'clientID'
      const q = query(clientRef, where('id', '==', clientID));
      const querySnapshot = await getDocs(q);

      // Verifica si el documento existe
      if (querySnapshot.empty) {
        console.log(`No se encontró ningún cliente con clientId: ${clientID}`);
        return rejectWithValue('El cliente no existe.');
      }

      // Obtén el ID real del documento en Firestore
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(firestoreService, 'clients', docId);

      // Actualiza solo los campos proporcionados en 'updatedData'
      await updateDoc(docRef, updatedData);

      // Retorna los datos actualizados incluyendo el ID del documento
      dispatch(getClient(clientID));
      dispatch(fetchClients({ pageSize: 10, append: false }));
      return { ...updatedData, id: clientID } as Client;
    } catch (error: any) {
      console.error(`Error al actualizar el cliente con clientId ${clientID}:`, error);
      return rejectWithValue('Error al actualizar el cliente.');
    }
  }
);

export const fetchClients = createAsyncThunk<FetchClientsResult, FetchClientsParams>(
  'clients/fetchClients',
  async ({ search, filters }, { rejectWithValue }) => {
    try {
      const clientsRef = collection(firestoreService, 'clients');
      let q = query(
        clientsRef,
        orderBy('name'),
        orderBy('createdAt', 'desc'),
      );

      // Filtro de búsqueda
      if (search) {
        q = query(q, where('name', '>=', search.toLowerCase()), where('name', '<=', search.toLowerCase() + '\uf8ff'));
      }

      if (filters) {
        // Filtro por estado
        if (filters.estado) {
          q = query(q, where('status', '==', filters.estado));
        }

        // Filtro por fuente
        if (filters.fuente) {
          q = query(q, where('source', '==', filters.fuente));
        }

        // Filtro por fecha de creación
        if (filters.fechaCreacion) {
          q = query(q, where('creationDate', '==', filters.fechaCreacion));
        }

        // Filtro por última interacción
        if (filters.fechaUltimaInteraccion) {
          q = query(q, where('lastInteractionDate', '==', filters.fechaUltimaInteraccion));
        }
      }

      // Obtener los clientes desde Firestore
      const snapshot = await getDocs(q);
      const clients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Client[];

      // Retornar los clientes obtenidos
      return { clients };
    } catch (error: any) {
      console.error('Error al obtener clients:', error);
      return rejectWithValue('No se pudo obtener los clientes');
    }
  }
);

// Agregar cliente a Firestore
export const addClientsToFirestore = createAsyncThunk<
  void,
  Client[],
  { state: RootState; rejectValue: { message: string; client: Client }[] }
>(
  'clients/addClientsToFirestore',
  async (clients, { getState, rejectWithValue, dispatch }) => {
    const existingClients = getState().client.clients;
    const errors: { message: string; client: Client }[] = [];

    for (const client of clients) {
      const clientExists = existingClients.some((existing) => existing.email === client.email);
      if (!clientExists) {
        try {
          const clientData = { ...client, nombre: client.name.trim().toLowerCase() };
          await addDoc(collection(firestoreService, 'clients'), clientData);
          dispatch(ADD_SUCCESSFUL_CLIENTS());
        } catch (error: any) {
          console.error('Error al agregar cliente a Firestore:', error.message);
          errors.push({ message: error.message, client });
          dispatch(ADD_FAILED_CLIENTS());
        }
      } else {
        console.warn(`El cliente con el email ${client.email} ya existe en el sistema.`);
        dispatch(ADD_FAILED_CLIENTS());
        errors.push({ message: `El cliente con el email ${client.email} ya existe en el sistema.`, client });
      }
    }

    if (errors.length > 0) {
      return rejectWithValue(errors);
    }
  }
);

// Eliminar cliente por ID
export const deleteClient = createAsyncThunk<string, string, { rejectValue: string }>(
  'clients/deleteClientByClientId',
  async (clientId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(DELETE_CLIENT(clientId));
      const clientsRef = collection(firestoreService, 'clients');
      const q = query(clientsRef, where('id', '==', clientId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn(`No se encontró ningún cliente con clientId: ${clientId}`);
        return rejectWithValue('El cliente no existe.');
      }

      const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
        return docSnapshot.id;
      });

      const deletedDocIds = await Promise.all(deletePromises);
      return deletedDocIds[0];
    } catch (error: any) {
      console.error(`Error al eliminar el cliente con clientId ${clientId}:`, error);
      return rejectWithValue('Error al eliminar el cliente.');
    }
  }
);




// Add a note to Firebase
export const addNote = createAsyncThunk(
  'notes/addNote',
  async (note: Notes, { rejectWithValue }) => {
    try {
      const noteRef = await addDoc(collection(firestoreService, 'notes'), {
        ...note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { ...note, id: noteRef.id };
    } catch (error: any) {
      console.error('Error adding the note:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Get notes by client ID
export const getNotesByClient = createAsyncThunk(
  'notes/getNotesByClient',
  async ({ clientID, userID }: { clientID: string | string[]; userID: string }, { rejectWithValue }) => {
    try {
      const notesSnapshot = await getDocs(
        query(
          collection(firestoreService, 'notes'),
          where('clientID', '==', clientID),
          where('userID', '==', userID),
          orderBy('updatedAt', 'desc')
        )
      )

      const notes = notesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notes[];

      return notes;
    } catch (error: any) {
      console.error('Error fetching the notes:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Update a note in Firebase
export const updateNote = createAsyncThunk<Notes, Notes, { rejectValue: string }>(
  'notes/updateNote',
  async (note, { rejectWithValue }) => {
    try {
      const noteRef = collection(firestoreService, 'notes'); // Reference to the 'notes' collection

      // Query to find the note by ID
      const q = query(noteRef, where('id', '==', note.id));
      const querySnapshot = await getDocs(q);

      // If no document is found, return an error
      if (querySnapshot.empty) {
        console.log(`No note found with ID: ${note.id}`);
        return rejectWithValue('The note does not exist.');
      }

      // If the document is found, get the ID of the document in Firestore
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(firestoreService, 'notes', docId); // Reference to the found document in 'notes'

      // Update the note fields
      await updateDoc(docRef, {
        content: note.content,      // Update the note content
        updatedAt: note.updatedAt,  // Update the last modification date
      });

      // Return the updated note (this is what the fulfilled action will return)
      return note;
    } catch (error: any) {
      console.error('Error updating the note:', error);
      return rejectWithValue(error.message); // Return the error if it occurs
    }
  }
);

// Delete a note
export const deleteNote = createAsyncThunk<string, { clientID: string; userID: string; noteID: string }, { rejectValue: string }>(
  'notes/deleteNote',
  async ({ clientID, userID, noteID }, { rejectWithValue, dispatch }) => {
    try {
      // Reference to the 'notes' collection
      const notesRef = collection(firestoreService, 'notes');

      // Query the notes that match the clientID and userID
      const q = query(
        notesRef,
        where('id', '==', noteID),
      );

      const querySnapshot = await getDocs(q);

      // If no note is found, return an error
      if (querySnapshot.empty) {
        console.warn(`No note found with clientID: ${clientID} and userID: ${userID}`);
        return rejectWithValue('The note does not exist or does not belong to this user.');
      }

      // Create an array of promises to delete the found notes
      const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref); // Delete the document from Firestore
        return docSnapshot.id; // Return the deleted document ID
      });

      // Wait for all the delete promises to resolve
      const deletedDocIds = await Promise.all(deletePromises);

      dispatch(getNotesByClient({ clientID, userID })); // Update notes in Redux state
      return deletedDocIds[0]; // Return the deleted document ID
    } catch (error: any) {
      console.error(`Error deleting the note with clientID ${clientID} and userID ${userID}:`, error);
      return rejectWithValue(error.message); // Return the error if it occurs
    }
  }
);



export const addNewInvestment = createAsyncThunk(
  'clients/addNewInvestment',
  async (investment: Investment, { rejectWithValue }) => {
    try {
      const investmentRef = await addDoc(collection(firestoreService, 'investments'), {
        ...investment
      });
      return { ...investment, id: investmentRef.id };
    } catch (error: any) {
      console.error('Error adding the investment:', error);
      return rejectWithValue(error.message);
    }
  }
)



export const addNewStrategies = createAsyncThunk(
  'clients/addNewStrategies',
  async (strategies: Strategy, { rejectWithValue }) => {
    try {
      await addDoc(collection(firestoreService, 'strategies'), {
        ...strategies
      });


      return { ...strategies };
    } catch (error: any) {
      console.error('Error adding the strategies:', error);
      return rejectWithValue(error.message);
    }
  }
)


export const getStrategiesByUser = createAsyncThunk(
  'clients/getStrategies',
  async (userID: string, { rejectWithValue }) => {
    try {
      const strategiesSnapshot = await getDocs(
        query(
          collection(firestoreService, 'strategies'),
          where('userID', '==', userID),
          orderBy('createdAt', 'desc')
        )
      )

      const strategies = strategiesSnapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as Strategy[];

      return strategies;
    } catch (error: any) {
      console.error('Error fetching the strategies:', error);
      return rejectWithValue(error.message);
    }
  }
)

// Slice de Redux
const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    SET_CLIENT: (state, action: PayloadAction<Client>) => {
      state.client = action.payload;
    },
    ADD_INTERACTIONS: (state, action: PayloadAction<Interaction[]>) => {
      state.interactions = action.payload;
    },
    DELETE_CLIENT: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter((client) => client.id !== action.payload);
    },
    ADD_SUCCESSFUL_CLIENTS: (state) => {
      state.successFullClients += 1;
    },
    ADD_FAILED_CLIENTS: (state) => {
      state.failedClients += 1;
    },
    RESET_CLIENTS_COUNT: (state) => {
      state.successFullClients = 0;
      state.failedClients = 0;
    },
    SET_INVESTMENT: (state, action: PayloadAction<Investment>) => {
      state.investment.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.clients = action.payload.clients;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(addNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action: PayloadAction<Notes>) => {
        state.loading = false;
        state.notes.push(action.payload);
      })
      .addCase(addNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getNotesByClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotesByClient.fulfilled, (state, action: PayloadAction<Notes[]>) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(getNotesByClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        state.client = action.payload;
      })
      .addCase(getClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al obtener el cliente.';
      })
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
        state.loading = false;
        if (state.client && state.client.id === action.payload.id) {
          state.client = { ...state.client, ...action.payload };
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al actualizar el cliente.';
      })
      .addCase(addNewInvestment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewInvestment.fulfilled, (state, action: PayloadAction<Investment>) => {
        state.loading = false;
        state.investment.push(action.payload);
      })
      .addCase(addNewInvestment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addNewStrategies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewStrategies.fulfilled, (state, action: PayloadAction<Strategy>) => {
        state.loading = false;
        state.strategies.push(action.payload);
      })
      .addCase(addNewStrategies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getStrategiesByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStrategiesByUser.fulfilled, (state, action: PayloadAction<Strategy[]>) => {
        state.loading = false;
        state.strategies = action.payload;
      })
      .addCase(getStrategiesByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const {
  SET_CLIENT,
  DELETE_CLIENT,
  ADD_INTERACTIONS,
  ADD_SUCCESSFUL_CLIENTS,
  ADD_FAILED_CLIENTS,
  RESET_CLIENTS_COUNT,
  SET_INVESTMENT,
} = clientsSlice.actions;

export default clientsSlice.reducer;
