import React, { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useCookieStorage from '../hooks/useLocalStorage';
import { authPages } from '../config/pages.config';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../store';
import { login } from '../store/slices/auth/authSlices';

export interface IAuthContextProps {
	usernameStorage: string | ((newValue: string | null) => void) | null;
	onLogin: (username: string, password: string) => Promise<void>;
	onLogout: () => void;
}


const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthProviderProps {
	children: ReactNode;
}
export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
	const [usernameStorage, setUserName] = useCookieStorage('user', null);
	const dispatch = useAppDispatch()

	const navigate = useNavigate();

	// call this function when you want to authenticate the user
	const onLogin = async (email: string, password: string) => {
		try {
			// Desencadenar la acción de login y esperar el resultado
			await dispatch(login({ email, password })).unwrap()
			.then((res) => {
				toast.success('Inicio de sesión exitoso');
				// Convertir los datos de respuesta en una cadena JSON
				const data = JSON.stringify(res);
		
				// Verificar que setUserName es una función antes de llamarla
				if (typeof setUserName === "function") {
					setUserName(data); // Llamar a setUserName con los datos
				}
				navigate(`../${authPages.profilePage.to}`, { replace: true });
			})
			.catch((err) => {
				toast.error('Error al iniciar sesión');
				console.error('Error al iniciar sesión:', err);
			})
	
		} catch (err) {
			// Manejo de errores
			console.error("Error al iniciar sesión:", err);
			// Aquí puedes manejar el error, mostrar una notificación, etc.
		}
	};
	

	// call this function to sign out logged-in user
	const onLogout = async () => {
		if (typeof setUserName === 'function') await setUserName(null);
		navigate(`../${authPages.loginPage.to}`, { replace: true });
	};

	const value: IAuthContextProps = useMemo(
		() => ({
			usernameStorage,
			onLogin,
			onLogout,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[usernameStorage],
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
