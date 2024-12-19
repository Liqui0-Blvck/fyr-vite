import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {  EmailAuthProvider, getAuth, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { SLICE_BASE_NAME } from './constants';
import { auth, firestoreService } from '../../../config/firebase.config';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { clearUser, setUser, User } from './userSlice';
import { UAParser } from 'ua-parser-js';



export interface AuthState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isAuthenticated?: boolean;
}

const initialState: AuthState = {
  status: 'idle',
  error: null,
  isAuthenticated: false,
};


// AsyncThunk para iniciar sesión
export const login = createAsyncThunk(
  `${SLICE_BASE_NAME}/login`,
  async ({ email, password }: { email: string; password: string }, { rejectWithValue, dispatch }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userDocRef = doc(firestoreService, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
        if (userDoc.exists()) {
          const additionalData = userDoc.data();
          const completeUser = {
            ...additionalData,
          } as User;

          dispatch(authenticate());
          dispatch(setUser(completeUser));
          dispatch(logUserLogin({ userId: userCredential.user.uid, userAgent: navigator.userAgent }));
      } else {
        return userCredential.user;
      }
    }
      catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// AsyncThunk para cerrar sesión
export const logout = createAsyncThunk(`${SLICE_BASE_NAME}/logout`, async (_, { rejectWithValue, dispatch }) => {
  try {
    await signOut(auth);
    dispatch(clearUser())
    return null;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

interface ChangePasswordPayload {
  newPassword: string;
  oldPassword: string;
}

// Thunk para actualizar la contraseña
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwords: ChangePasswordPayload, { rejectWithValue }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return rejectWithValue('No user is authenticated');
    }

    try {
      // Verificamos si el usuario está autenticado correctamente antes de cambiar la contraseña
      const credential = EmailAuthProvider.credential(user.email!, passwords.oldPassword); // Usamos la contraseña actual para reautenticar al usuario

      console.log(credential)
      // Reautenticamos al usuario con las credenciales actuales
      await reauthenticateWithCredential(user, credential);

      // Cambiamos la contraseña después de la reautenticación
      await updatePassword(user, passwords.newPassword);

      return 'Password changed successfully'; // Retorna un mensaje de éxito
    } catch (error: any) {
      // Si hay un error, lo capturamos y lo retornamos
      return rejectWithValue(error.message);
    }
  }
);


const getIp = async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
};

// Función para limpiar los logs más antiguos a los últimos 7 días
const cleanOldLogs = async (userId: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Fecha de hace 7 días

  const logsSnapshot = await getDocs(
    query(collection(firestoreService, 'users', userId, 'logs'), where('timestamp', '<', sevenDaysAgo.toISOString()))
  );

  // Eliminar logs antiguos
  logsSnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
};


// `createAsyncThunk` para verificar la IP y el navegador y actualizar o crear el registro
export const logUserLogin = createAsyncThunk(
  'auth/logUserLogin',
  async ({ userId, userAgent }: { userId: string; userAgent: string }, { rejectWithValue }) => {
    try {
      const ip = await getIp(); // Obtiene la IP
      const timestamp = new Date().toISOString(); // Hora de inicio de sesión
      const parser = new UAParser();
      const deviceInfo = parser.setUA(userAgent).getResult(); // Analiza el userAgent

      const deviceData = {
        browser: deviceInfo.browser.name,
        os: deviceInfo.os.name,
        osVersion: deviceInfo.os.version,
        deviceType: deviceInfo.device.type || 'unknown',
        version: deviceInfo.browser.version,
      };

      // Consulta si ya existe un registro con la misma IP y navegador
      const logsQuery = query(
        collection(firestoreService, 'users', userId, 'logs'),
        where('ip', '==', ip),
        where('device.browser', '==', deviceData.browser),
        where('device.version', '==', deviceData.version) // Asegúrate de comparar la versión también
      );

      const querySnapshot = await getDocs(logsQuery);

      if (!querySnapshot.empty) {
        // Si ya existe un registro, actualizamos el `timestamp`
        const existingLogDoc = querySnapshot.docs[0]; // Tomamos el primer documento encontrado
        await updateDoc(existingLogDoc.ref, {
          timestamp, // Actualizamos solo la hora de inicio de sesión
        });

        return { id: existingLogDoc.id, timestamp }; // Devolvemos el ID y el nuevo timestamp
      } else {
        // Si no existe un registro con la misma IP y navegador, creamos uno nuevo
        const newLogData = {
          ip,
          device: deviceData,
          timestamp,
        };

        const logRef = await addDoc(collection(firestoreService, 'users', userId, 'logs'), newLogData);
        return { id: logRef.id, timestamp }; // Devolvemos el ID del nuevo log y el timestamp
      }
    } catch (error: any) {
      return rejectWithValue(error.message); // En caso de error, retornamos el error
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate: (state) => {
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(logout.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })

  },
});

export const { authenticate } = authSlice.actions;

export default authSlice.reducer;
