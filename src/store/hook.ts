// hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import type { RootState } from './store'; // Asegúrate de importar los tipos desde 'store.ts'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AppThunkDispatch = ThunkDispatch<RootState, any, any>;
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
