import React, { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useCookieStorage from '../hooks/useLocalStorage';
import { authPages } from '../config/pages.config';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../store';
import { login } from '../store/slices/auth/authSlices';
import Cookies from 'js-cookie';

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

	const onLogin = async (email: string, password: string) => {
		try {
			await dispatch(login({ email, password })).unwrap()
			.then((res) => {
				toast.success('Inicio de sesión exitoso');
				const data = JSON.stringify(res);
				if (typeof setUserName === "function") {
					setUserName(data)
				}
				navigate(`../${authPages.profilePage.to}`, { replace: true });
			})
			.catch((err) => {
				toast.error('Error al iniciar sesión');
				console.error('Error al iniciar sesión:', err);
			})
	
		} catch (err) {
			console.error("Error al iniciar sesión:", err);
		}
	};
	

	// call this function to sign out logged-in user
	const onLogout = async () => {
		if (typeof setUserName === 'function') await setUserName(null);
		Cookies.remove('user');
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
