import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAuth, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc } from "firebase/firestore";
import { firestoreService } from "../../../config/firebase.config";
import { authenticate } from "./authSlices";

export interface User {
  uid?: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  first_name?: string | null;
  second_name?: string | null;
  last_name?: string | null;
  second_last_name?: string | null;
  birth?: string
  gender?: string
  role?: string;
  createdAt?: string;
  notificationToken?: string;
  address?: string;
  position: string;
}

export interface LogsUserSession {
  id?: string
  ip: string;
  device: {
    browser: string;
    os: string;
    osVersion: string;
    deviceType: string;
    version: string
  }
  timestamp: string;
}


export interface UserState {
  user: User | null;
  sessions: LogsUserSession[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  sessions: [],
  status: 'idle',
  error: null,
};

// AsyncThunk para obtener el usuario
export const fetchUser = createAsyncThunk(`user/fetchUser`, async (uid: string | null, { rejectWithValue, dispatch }) => {
  try {
    if (uid) {
      const userDocRef = doc(firestoreService, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const additionalData = userDoc.data();
        const completeUser = {
          ...additionalData,
        } as User;

        dispatch(authenticate());

        return completeUser;
      }
    }

    return null;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Thunk para actualizar el perfil en Firebase
export const updateProfileData = createAsyncThunk(
  'profile/updateProfileData',
  async (profileData: User, { rejectWithValue }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return rejectWithValue("No user is authenticated");
    }
    const userDocRef = doc(firestoreService, 'users', user.uid)

    try {
      await setDoc(userDocRef, {...profileData, uid: user.uid }, { merge: true }); // merge: true asegura que no sobreescriba otros campos

      return { ...profileData, uid: user.uid }; // Retornamos el perfil actualizado
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserLogs = createAsyncThunk(
  'auth/fetchUserLogs',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Realizamos la consulta para obtener todos los logs
      const logsQuery = collection(firestoreService, 'users', userId, 'logs');
      const querySnapshot = await getDocs(logsQuery);
      
      const logsArray: LogsUserSession[] = [];

      // Iteramos sobre los resultados de la consulta
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Validamos que los campos existan antes de agregarlos al array
        const log: LogsUserSession = {
          id: doc.id,
          ip: data.ip || 'N/A', // Si no hay IP, ponemos 'N/A'
          device: {
            browser: data.device?.browser || 'Unknown', // Asignar valores por defecto
            os: data.device?.os || 'Unknown',
            osVersion: data.device?.osVersion || 'Unknown',
            deviceType: data.device?.deviceType || 'Unknown',
            version: data.device?.version || 'Unknown',
          },
          timestamp: data.timestamp || new Date().toISOString(), // Si no hay timestamp, usamos la hora actual
        };

        logsArray.push(log);
      });

      return logsArray; // Retornamos los logs obtenidos
    } catch (error: any) {
      return rejectWithValue(error.message); // En caso de error, retornamos el error
    }
  }
);


const UserSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Cuando la actualización del perfil comienza
      .addCase(updateProfileData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // Cuando la actualización del perfil es exito
     .addCase(updateProfileData.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      // Cuando la actualización del perfil falla
      .addCase(updateProfileData.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch user
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchUserLogs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sessions = action.payload; // Guardamos los logs en el estado
      })
      .addCase(fetchUserLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string; // Guardamos el error si ocurre
      });
  },
});

// Acciones exportadas
export const { 
  setUser,
  clearUser


} = UserSlice.actions;


export default UserSlice.reducer;
