import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {  EmailAuthProvider, getAuth, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { SLICE_BASE_NAME } from './constants';
import { auth, firestoreService } from '../../../config/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { clearUser, setUser, User } from './userSlice';



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
  async (passwords: ChangePasswordPayload, { rejectWithValue, getState }) => {
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
