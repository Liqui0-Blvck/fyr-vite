import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { firestoreService } from '../../../config/firebase.config';
import { RootState } from '../../store';
import { Prospect } from '../../../types/app/Prospect.type';
import { Event } from '../../../types/app/Events.type';
import { Interaction } from '../../../types/app/Interaction.type';
import { Notes } from '../../../types/app/Notes.type';
import { collection, doc, query, where, getDocs, deleteDoc, orderBy , addDoc, startAfter, limit, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { generateUID } from '../../../utils/generateUID';

export interface PaginationInfo {
  id?: string;
  fechaCreacion: Date;
  nombre: string;
}

export interface ProspectsState {
  prospects: Prospect[];
  prospect: Prospect | null;
  interactions: Interaction[];
  eventos: Event[];
  notes: Notes[];
  loading: boolean;
  error: string | null;
  errorProspects: { message: string; prospect: Prospect }[];
  successFullProspects: number;
  failedProspects: number;
  lastVisible: PaginationInfo | null;
  hasMore: boolean;
}

interface FetchProspectParams {
  search?: string;
  pageSize: number;
  pageIndex?: number;
  append?: boolean;
  filters?: Record<string, string>;
}

interface FetchProspectResult {
  prospects: Prospect[];
  lastVisible?: PaginationInfo | null;
}

const initialState: ProspectsState = {
  prospects: [],
  interactions: [],
  eventos: [],
  notes: [],
  prospect: null,
  loading: false,
  error: null,
  errorProspects: [],
  successFullProspects: 0,
  failedProspects: 0,
  lastVisible: null,
  hasMore: true,
};


export const transferProspectToClient = createAsyncThunk<
  void, 
  { prospectID: string; userID: string }, 
  { rejectValue: string }
>(
  'prospects/transferProspectToClient',
  async ({ prospectID, userID }, { rejectWithValue, dispatch }) => {
    try {
      // Reference to the 'prospects' collection
      const leadRef = collection(firestoreService, 'prospects');
      const q = query(leadRef, where('id', '==', prospectID));
      const querySnapshot = await getDocs(q);

      // Check if the prospect exists
      if (querySnapshot.empty) {
        console.log(`No se encontró ningún lead con leadId: ${prospectID}`);
        return rejectWithValue('El lead no existe.');
      }

      // Get the prospect data
      const prospectDoc = querySnapshot.docs[0];
      const prospectData = prospectDoc.data() as Prospect; // Retrieve the prospect data

      // Reference to the 'clients' collection
      const clientRef = doc(firestoreService, 'clients', prospectID);

      // Transfer prospect data to the 'clients' collection
      await setDoc(clientRef, {
        ...prospectData,
        updatedAt: new Date().toISOString(),
      });

      // Delete the prospect from the 'prospects' collection after transfer
      await deleteDoc(prospectDoc.ref);

      // Optionally, you can dispatch other actions or update your Redux state
      // dispatch(fetchClients()); // e.g., refresh the clients list

    } catch (error: any) {
      console.error('Error transferring prospect to client:', error);
      return rejectWithValue('Error transferring the prospect to client.');
    }
  }
);

export const getProspectByID = createAsyncThunk<Prospect, string | string[], { rejectValue: string }>(
  'prospects/getProspectByID',
  async (prospectID, { rejectWithValue }) => {
    try {
      const prospectRef = collection(firestoreService, 'prospects');
      const q = query(prospectRef, where('id', '==', prospectID));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`No se encontró ningún prospecto con id: ${prospectID}`);
        return rejectWithValue('El lead no existe.');
      }

      const lead = querySnapshot.docs[0].data() as Prospect;

      return lead
    } catch (error: any) {
      console.error(`Error al obtener el lead con id ${prospectID}:`, error);
      return rejectWithValue('Error al obtener el lead.');
    }
  }
);

export const updateProspect = createAsyncThunk<
  Prospect,
  { prospectID: string | string[]; updatedData: Partial<Prospect> },
  { rejectValue: string }
>(
  'prospects/updateLead',
  async ({ prospectID, updatedData }, { rejectWithValue, dispatch }) => {
    try {
      // Referencia a la colección de leads
      const leadRef = collection(firestoreService, 'prospects');

      // Consulta para encontrar el documento cuyo campo 'id' coincida con 'prospectID'
      const q = query(leadRef, where('id', '==', prospectID));
      const querySnapshot = await getDocs(q);

      // Verifica si el documento existe
      if (querySnapshot.empty) {
        console.log(`No se encontró ningún prospecto con id: ${prospectID}`);
        return rejectWithValue('El prospecto no existe.');
      }

      // Obtén el ID real del documento en Firestore
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(firestoreService, 'prospects', docId);

      // Actualiza solo los campos proporcionados en 'updatedData'
      await updateDoc(docRef, updatedData);

      // Retorna los datos actualizados incluyendo el ID del documento
      dispatch(getProspectByID(prospectID));
      dispatch(fetchProspects({ pageSize: 10, append: false }));
      return { ...updatedData, id: prospectID } as Prospect;
    } catch (error: any) {
      console.error(`Error al actualizar el prospecto con ID ${prospectID}:`, error);
      return rejectWithValue('Error al actualizar el prospect.');
    }
  }
);

export const fetchProspects = createAsyncThunk<FetchProspectResult, FetchProspectParams>(
  'prospects/fetchProspects',
  async ({ search, pageSize, filters }, { rejectWithValue }) => {
    try {
      const prospectRef = collection(firestoreService, 'prospects');
      let q = query(
        prospectRef,
        orderBy('name'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
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
          q = query(q, where('createdAt', '==', filters.fechaCreacion));
        }

        // Filtro por última interacción
        if (filters.fechaUltimaInteraccion) {
          q = query(q, where('updatedAt', '==', filters.fechaUltimaInteraccion));
        }
      }

      // Obtener los leads desde Firestore
      const snapshot = await getDocs(q);
      const prospects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Prospect[];

      // Retornar los leads obtenidos
      return { prospects };
    } catch (error: any) {
      console.error('Error al obtener prospectos:', error);
      return rejectWithValue('No se pudo obtener los prospectos');
    }
  }
);



// Agregar leads a Firestore
export const addProspectsToFirestore = createAsyncThunk<
  void,
  Prospect[],
  { state: RootState; rejectValue: { message: string; prospect: Prospect }[] }
>(
  'prospects/addProspectsToFirestore',
  async (prospects, { getState, rejectWithValue, dispatch }) => {
    const existingProspects = getState().prospect.prospects;
    const errors: { message: string; prospect: Prospect }[] = [];

    for (const prospect of prospects) {
      const prospectExists = existingProspects.some((existing) => existing.email === prospect.email);
      if (!prospectExists) {
        try {
          const leadData = { 
            ...prospect,
            id: generateUID(), 
            createdAt: new Date().toISOString(), 
            updatedAt: new Date().toISOString(),
            status: 'esperando'
          };
          await addDoc(collection(firestoreService, 'prospects'), leadData);
          dispatch(ADD_SUCCESSFUL_PROSPECTS());
          dispatch(fetchProspects({ pageSize: 1000, append: false }));
        } catch (error: any) {
          console.error('Error al agregar prospecto a Firestore:', error.message);
          errors.push({ message: error.message, prospect });
          dispatch(ADD_FAILED_PROSPECTS());
        }
      } else {
        console.warn(`El prospecto con el email ${prospect.email} ya existe en el sistema.`);
        dispatch(ADD_FAILED_PROSPECTS());
        errors.push({ message: `El prospecto con el email ${prospect.email} ya existe en el sistema.`, prospect });
      }
    }

    if (errors.length > 0) {
      return rejectWithValue(errors);
    }
  }
);

// Eliminar lead por ID
// export const deleteLead = createAsyncThunk<string, string, { rejectValue: string }>(
//   'prospects/deleteLeadByLeadId',
//   async (leadId, { rejectWithValue, dispatch }) => {
//     try {
//       dispatch(DELETE_PROSPECT(leadId));
//       const prospectsRef = collection(firestoreService, 'prospects');
//       const q = query(prospectsRef, where('id', '==', leadId));
//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//         console.warn(`No se encontró ningún lead con leadId: ${leadId}`);
//         return rejectWithValue('El lead no existe.');
//       }

//       const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
//         await deleteDoc(docSnapshot.ref);
//         return docSnapshot.id;
//       });

//       const deletedDocIds = await Promise.all(deletePromises);
//       return deletedDocIds[0];
//     } catch (error: any) {
//       console.error(`Error al eliminar el lead con leadId ${leadId}:`, error);
//       return rejectWithValue('Error al eliminar el lead.');
//     }
//   }
// );

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
    SET_PROSPECT: (state, action: PayloadAction<Prospect>) => {
      state.prospect = action.payload;
    },
    ADD_INTERACTIONS: (state, action: PayloadAction<Interaction[]>) => {
      state.interactions = action.payload;
    },
    // DELETE_PROSPECT: (state, action: PayloadAction<string>) => {
    //   state.leads = state.leads.filter((lead) => lead.id !== action.payload);
    // },
    ADD_SUCCESSFUL_PROSPECTS: (state) => {
      state.successFullProspects += 1;
    },
    ADD_FAILED_PROSPECTS: (state) => {
      state.failedProspects += 1;
    },
    RESET_PROSPECT_COUNT: (state) => {
      state.successFullProspects = 0;
      state.failedProspects = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProspects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProspects.fulfilled, (state, action) => {
        state.prospects = action.payload.prospects;
      })
      .addCase(fetchProspects.rejected, (state, action) => {
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
      .addCase(getProspectByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProspectByID.fulfilled, (state, action: PayloadAction<Prospect>) => {
        state.loading = false;
        state.prospect = action.payload;
      })
      .addCase(getProspectByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al obtener el lead.';
      })
      .addCase(updateProspect.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProspect.fulfilled, (state, action: PayloadAction<Prospect>) => {
        state.loading = false;
        if (state.prospect && state.prospect.id === action.payload.id) {
          state.prospect = { ...state.prospect, ...action.payload };
        }
      })
      .addCase(updateProspect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error al actualizar el lead.';
      })
  },
});

export const {
  SET_PROSPECT,
  // DELETE_PROSPECT,
  ADD_INTERACTIONS,
  ADD_SUCCESSFUL_PROSPECTS,
  ADD_FAILED_PROSPECTS,
  RESET_PROSPECT_COUNT,
} = prospectsSlice.actions;

export default prospectsSlice.reducer;
