import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { SLICE_BASE_NAME } from './constants';
import { auth } from '../../../config/firebase.config';

export interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};


// AsyncThunk para iniciar sesión
export const login = createAsyncThunk(
  `${SLICE_BASE_NAME}/login`,
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
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

// AsyncThunk para escuchar cambios en el usuario autenticado
export const fetchUser = createAsyncThunk(`${SLICE_BASE_NAME}/fetchUser`, async (_, { rejectWithValue }) => {
  return new Promise<User | null>((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    }, (error) => reject(rejectWithValue(error.message)));
  });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
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

export default authSlice.reducer;
