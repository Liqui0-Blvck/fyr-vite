import React, { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useCookieStorage from '../hooks/useLocalStorage';
import { authPages } from '../config/pages.config';
import useUserAPI from '../mocks/hooks/useUserAPI';
import { TUser } from '../mocks/db/users.db';
import useAxiosFunction from '../hooks/useAxiosFunction';
import axios from 'axios';

export interface IAuthContextProps {
	usernameStorage: string | ((newValue: string | null) => void) | null;
	onLogin: (username: string, password: string) => Promise<void>;
	onLogout: () => void;
	userData: TUser;
	isLoading: boolean;
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthProviderProps {
	children: ReactNode;
}
export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
	const [usernameStorage, setUserName] = useCookieStorage('user', null);
	const base_url = 'http://127.0.0.1:8000'

	const { response, isLoading, getCheckUser } = useUserAPI(usernameStorage as string);
	const userData = response as TUser;

	const navigate = useNavigate();

	// call this function when you want to authenticate the user
	const onLogin = async (username: string, password: string) => {
		try {
			const response = await axios.post(`${base_url}/auth/token/`, {
				username: username,
				password: password
			});

			if (response.status === 200) {
				if (typeof setUserName === 'function') {
					setUserName(response.data)
				}
				navigate('/')
			}
		} catch (error: any) {
			console.error('Error:', error);
			// Maneja el error de la solicitud aquí
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
			userData,
			isLoading,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[usernameStorage, userData],
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
