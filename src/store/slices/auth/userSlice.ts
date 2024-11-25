import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { TConfiguracion, TPerfil } from '../../../types/core/core.types'
import { TColors } from '../../../types/colors.type'

export type UserState = {
    perfil?: TPerfil | null
    configuracion?: TConfiguracion | null
    authority?: string[]
    colorApp?: string | TColors
}

const initialState: UserState = {
    perfil: null as TPerfil | null,
    configuracion: null as TConfiguracion | null,
    authority: [],
    colorApp: ''
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.perfil = action.payload?.perfil
            state.configuracion = action.payload?.configuracion
            state.authority = action.payload?.authority
        },
        setDataPerfil(state, action: PayloadAction<TPerfil>) {
            state.perfil = action.payload
        },
        setColorApp(state, action: PayloadAction<string | TColors>) {
            state.colorApp = action.payload
        },
        setConfiguracion(state, action: PayloadAction<TConfiguracion>) {
            state.configuracion = action.payload
        }
    },
})

export const { setUser, setDataPerfil, setColorApp, setConfiguracion } = userSlice.actions
export default userSlice.reducer