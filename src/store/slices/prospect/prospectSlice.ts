import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { firestoreService } from '../../../config/firebase.config';
import { RootState } from '../../store';
import { Lead } from '../../../types/app/Prospect.type';
import { Event } from '../../../types/app/Events.type';
import { Interaction } from '../../../types/app/Interaction.type';
import { Notes } from '../../../types/app/Notes.type';
import { collection, doc, query, where, getDocs, deleteDoc, orderBy , addDoc, startAfter, limit, updateDoc } from 'firebase/firestore';

export interface PaginationInfo {
  id?: string;
  fechaCreacion: Date;
  nombre: string;
}

export interface ProspectsState {
  leads: Lead[];
  lead: Lead | null;
  interactions: Interaction[];
  eventos: Event[];
  notes: Notes[];
  loading: boolean;
  error: string | null;
  errorLeads: { message: string; lead: Lead }[];
  successFullLeads: number;
  failedLeads: number;
  lastVisible: PaginationInfo | null;
  hasMore: boolean;
}

interface FetchLeadsParams {
  search?: string;
  pageSize: number;
  pageIndex?: number;
  append?: boolean;
  filters?: Record<string, string>;
}

interface FetchLeadsResult {
  leads: Lead[];
  lastVisible?: PaginationInfo | null;
}

const initialState: ProspectsState = {
  leads: [],
  interactions: [],
  eventos: [],
  notes: [],
  lead: null,
  loading: false,
  error: null,
  errorLeads: [],
  successFullLeads: 0,
  failedLeads: 0,
  lastVisible: null,
  hasMore: true,
};


export const getLead = createAsyncThunk<Lead, string | string[], { rejectValue: string }>(
  'prospects/getLeadByLeadId',
  async (leadID, { rejectWithValue }) => {
    try {
      const leadRef = collection(firestoreService, 'prospects');
      const q = query(leadRef, where('id', '==', leadID));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`No se encontró ningún lead con leadId: ${leadID}`);
        return rejectWithValue('El lead no existe.');
      }

      const lead = querySnapshot.docs[0].data() as Lead;

      return lead
    } catch (error: any) {
      console.error(`Error al obtener el lead con leadId ${leadID}:`, error);
      return rejectWithValue('Error al obtener el lead.');
    }
  }
);

export const updateLead = createAsyncThunk<
  Lead,
  { leadID: string | string[]; updatedData: Partial<Lead> },
  { rejectValue: string }
>(
  'prospects/updateLead',
  async ({ leadID, updatedData }, { rejectWithValue, dispatch }) => {
    try {
      // Referencia a la colección de leads
      const leadRef = collection(firestoreService, 'prospects');

      // Consulta para encontrar el documento cuyo campo 'id' coincida con 'leadID'
      const q = query(leadRef, where('id', '==', leadID));
      const querySnapshot = await getDocs(q);

      // Verifica si el documento existe
      if (querySnapshot.empty) {
        console.log(`No se encontró ningún lead con leadId: ${leadID}`);
        return rejectWithValue('El lead no existe.');
      }

      // Obtén el ID real del documento en Firestore
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(firestoreService, 'prospects', docId);

      // Actualiza solo los campos proporcionados en 'updatedData'
      await updateDoc(docRef, updatedData);

      // Retorna los datos actualizados incluyendo el ID del documento
      dispatch(getLead(leadID));
      dispatch(fetchLeads({ pageSize: 10, append: false }));
      return { ...updatedData, id: leadID } as Lead;
    } catch (error: any) {
      console.error(`Error al actualizar el lead con leadId ${leadID}:`, error);
      return rejectWithValue('Error al actualizar el lead.');
    }
  }
);

export const fetchLeads = createAsyncThunk<FetchLeadsResult, FetchLeadsParams>(
  'prospects/fetchLeads',
  async ({ search, pageSize, filters }, { rejectWithValue }) => {
    try {
      const leadsRef = collection(firestoreService, 'prospects');
      let q = query(
        leadsRef,
        orderBy('nombre'),
        orderBy('fechaCreacion', 'desc'),
        limit(pageSize)
      );

      // Filtro de búsqueda
      if (search) {
        q = query(q, where('nombre', '>=', search.toLowerCase()), where('nombre', '<=', search.toLowerCase() + '\uf8ff'));
      }

      if (filters) {
        // Filtro por estado
        if (filters.estado) {
          q = query(q, where('estado', '==', filters.estado));
        }

        // Filtro por fuente
        if (filters.fuente) {
          q = query(q, where('fuente', '==', filters.fuente));
        }

        // Filtro por fecha de creación
        if (filters.fechaCreacion) {
          q = query(q, where('fechaCreacion', '==', filters.fechaCreacion));
        }

        // Filtro por última interacción
        if (filters.fechaUltimaInteraccion) {
          q = query(q, where('fechaUltimaInteraccion', '==', filters.fechaUltimaInteraccion));
        }
      }

      // Obtener los leads desde Firestore
      const snapshot = await getDocs(q);
      const leads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Lead[];

      // Retornar los leads obtenidos
      return { leads };
    } catch (error: any) {
      console.error('Error al obtener leads:', error);
      return rejectWithValue('No se pudo obtener los leads');
    }
  }
);



// Agregar leads a Firestore
export const addLeadsToFirestore = createAsyncThunk<
  void,
  Lead[],
  { state: RootState; rejectValue: { message: string; lead: Lead }[] }
>(
  'prospects/addLeadsToFirestore',
  async (leads, { getState, rejectWithValue, dispatch }) => {
    const existingLeads = getState().prospect.leads;
    const errors: { message: string; lead: Lead }[] = [];

    for (const lead of leads) {
      const leadExists = existingLeads.some((existing) => existing.email === lead.email);
      if (!leadExists) {
        try {
          const leadData = { ...lead, nombre: lead.nombre.trim().toLowerCase() };
          await addDoc(collection(firestoreService, 'prospects'), leadData);
          dispatch(ADD_SUCCESSFUL_LEADS());
        } catch (error: any) {
          console.error('Error al agregar lead a Firestore:', error.message);
          errors.push({ message: error.message, lead });
          dispatch(ADD_FAILED_LEADS());
        }
      } else {
        console.warn(`El lead con el email ${lead.email} ya existe en el sistema.`);
        dispatch(ADD_FAILED_LEADS());
        errors.push({ message: `El lead con el email ${lead.email} ya existe en el sistema.`, lead });
      }
    }

    if (errors.length > 0) {
      return rejectWithValue(errors);
    }
  }
);

// Eliminar lead por ID
export const deleteLead = createAsyncThunk<string, string, { rejectValue: string }>(
  'prospects/deleteLeadByLeadId',
  async (leadId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(DELETE_PROSPECT(leadId));
      const prospectsRef = collection(firestoreService, 'prospects');
      const q = query(prospectsRef, where('id', '==', leadId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn(`No se encontró ningún lead con leadId: ${leadId}`);
        return rejectWithValue('El lead no existe.');
      }

      const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref);
        return docSnapshot.id;
      });

      const deletedDocIds = await Promise.all(deletePromises);
      return deletedDocIds[0];
    } catch (error: any) {
      console.error(`Error al eliminar el lead con leadId ${leadId}:`, error);
      return rejectWithValue('Error al eliminar el lead.');
    }
  }
);

// Agregar una nota a Firebase
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
      console.error('Error al agregar la nota:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Obtener las notas según el ID del lead
export const getNotesByLead = createAsyncThunk(
  'notes/getNotesByLead',
  async ({ leadID, userID }: { leadID: string | string[]; userID: string }, { rejectWithValue }) => {
    try {
      const notesSnapshot = await getDocs(
        query(
          collection(firestoreService, 'notes'),
          where('leadID', '==', leadID),
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
      console.error('Error al obtener las notas:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateNote = createAsyncThunk<Notes, Notes, { rejectValue: string }>(
  'notes/updateNote',
  async (note, { rejectWithValue }) => {
    try {
      const noteRef = collection(firestoreService, 'notes'); // Referencia a la colección 'notes'

      console.log(note.id)
      // Realiza la consulta para buscar la nota por ID
      const q = query(noteRef, where('id', '==', note.id));
      console.log(q)
      const querySnapshot = await getDocs(q);

      console.log(querySnapshot)

      // Si no se encuentra ningún documento, devolvemos un error
      if (querySnapshot.empty) {
        console.log(`No se encontró ninguna nota con ID: ${note.id}`);
        return rejectWithValue('La nota no existe.');
        
      }

      console.log(note)

      // Si encontramos el documento, obtenemos el ID del documento en Firestore
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(firestoreService, 'notes', docId); // Referencia al documento encontrado en 'notes'

      console.log(docRef)

      // Actualizamos los campos de la nota
      await updateDoc(docRef, {
        content: note.content,      // Actualizamos el contenido de la nota
        updatedAt: note.updatedAt,  // Actualizamos la fecha de la última modificación
      });

      // Retornamos la nota actualizada (esto es lo que se pasa en la acción fulfilled)
      return note;
    } catch (error: any) {
      console.error('Error al actualizar la nota:', error);
      return rejectWithValue(error.message); // Retorna el error si ocurre
    }
  }
);

export const deleteNote = createAsyncThunk<string, { leadID: string; userID: string, noteID: string }, { rejectValue: string }>(
  'notes/deleteNote',
  async ({ leadID, userID, noteID }, { rejectWithValue, dispatch }) => {
    try {
      // Referencia a la colección de notas
      const notesRef = collection(firestoreService, 'notes');
      
      // Consultamos las notas que coinciden con el leadID y el userID
      const q = query(
        notesRef,
        where('id', '==', noteID),
      );

      const querySnapshot = await getDocs(q);

      // Si no encontramos ninguna nota, lanzamos un error
      if (querySnapshot.empty) {
        console.warn(`No se encontró ninguna nota con leadID: ${leadID} y userID: ${userID}`);
        return rejectWithValue('La nota no existe o no pertenece a este usuario.');
      }

      // Creamos un array de promesas para eliminar las notas encontradas
      const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
        await deleteDoc(docSnapshot.ref); // Eliminamos el documento de Firestore
        return docSnapshot.id; // Devolvemos el ID del documento eliminado
      });

      // Esperamos que todas las promesas de eliminación se resuelvan
      const deletedDocIds = await Promise.all(deletePromises);
      
      dispatch(getNotesByLead({ leadID, userID })); // Actualizamos las notas en el estado de Redux
      return deletedDocIds[0]; // Devolvemos el ID del documento eliminado
    } catch (error: any) {
      console.error(`Error al eliminar la nota con leadID ${leadID} y userID ${userID}:`, error);
      return rejectWithValue(error.message); // Retorna el error si ocurre
    }
  }
);


// Thunk para agregar una interacción a Firebase
export const addInteraction = createAsyncThunk(
  'interactions/addInteraction',
  async (interaction: Interaction, { rejectWithValue }) => {
    try {
      const interactionRef = await addDoc(collection(firestoreService, 'interactions'), interaction);
      return { ...interaction, uid: interactionRef.id }; // Retornamos la interacción con el ID asignado
    } catch (error: any) {
      console.error('Error al agregar la interacción:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para obtener las interacciones según el ID del usuario y del lead
export const fetchInteractionsProspect = createAsyncThunk(
  'interactions/fetchInteractionsProspect',
  async ({ userID, leadID }: { userID: string; leadID: string | string[] }, { rejectWithValue, dispatch }) => {
    try {
      const interactionsQuery = query(
        collection(firestoreService, 'interactions'),
        where('userID', '==', userID),
        where('leadID', '==', leadID)
      );
      
      const interactionsSnapshot = await getDocs(interactionsQuery);
      const interactions = interactionsSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as Interaction[];

      dispatch(ADD_INTERACTIONS(interactions));
      return interactions;
    } catch (error: any) {
      console.error('Error al obtener las interacciones:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Slice de Redux
const prospectsSlice = createSlice({
  name: 'prospects',
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload;
    },
    appendLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads.push(...action.payload);
    },
    ADD_PROSPECT: (state, action: PayloadAction<Lead>) => {
      state.leads.push(action.payload);
    },
    DELETE_PROSPECT: (state, action: PayloadAction<string>) => {
      state.leads = state.leads.filter((lead) => lead.id !== action.payload);
    },
    ADD_INTERACTIONS: (state, action: PayloadAction<Interaction[]>) => {
      state.interactions = action.payload;
    },
    ADD_EVENT: (state, action: PayloadAction<Event>) => {
      state.eventos.push(action.payload);
    },
    ADD_NOTAS: (state, action: PayloadAction<Notes>) => {
      state.notes.push(action.payload);
    },
    ADD_SUCCESSFUL_LEADS: (state) => {
      state.successFullLeads += 1;
    },
    ADD_FAILED_LEADS: (state) => {
      state.failedLeads += 1;
    },
    RESET_LEADS_COUNT: (state) => {
      state.successFullLeads = 0;
      state.failedLeads = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.leads = action.payload.leads;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
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
      .addCase(getNotesByLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotesByLead.fulfilled, (state, action: PayloadAction<Notes[]>) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(getNotesByLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.loading = false;
        state.lead = action.payload;
      })
      .addCase(getLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al obtener el lead.';
      })
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.loading = false;
        if (state.lead && state.lead.id === action.payload.id) {
          state.lead = { ...state.lead, ...action.payload };
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al actualizar el lead.';
      })
  },
});

export const {
  setLeads,
  appendLeads,
  ADD_PROSPECT,
  DELETE_PROSPECT,
  ADD_INTERACTIONS,
  ADD_EVENT,
  ADD_NOTAS,
  ADD_SUCCESSFUL_LEADS,
  ADD_FAILED_LEADS,
  RESET_LEADS_COUNT,
} = prospectsSlice.actions;

export default prospectsSlice.reducer;
