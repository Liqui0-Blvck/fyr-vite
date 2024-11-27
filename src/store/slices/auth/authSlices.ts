import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {  signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { SLICE_BASE_NAME } from './constants';
import { auth, firestoreService } from '../../../config/firebase.config';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  name?: string;
  role?: string;
  createdAt?: string;
  notificationToken?: string;
  address?: string;
}

export interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isAuthenticated?: boolean;
}

const initialState: AuthState = {
  user: null,
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

          return completeUser;
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
export const logout = createAsyncThunk(`${SLICE_BASE_NAME}/logout`, async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
    return null;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});


// AsyncThunk para obtener el usuario
export const fetchUser = createAsyncThunk(`${SLICE_BASE_NAME}/fetchUser`, async (uid: string | null, { rejectWithValue, dispatch }) => {
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate: (state) => {
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
      })
      .addCase(logout.rejected, (state, action: PayloadAction<any>) => {
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
      });
  },
});

export const { authenticate, clearUser } = authSlice.actions;

export default authSlice.reducer;
