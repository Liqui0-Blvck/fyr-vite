import React, { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useCookieStorage from '../hooks/useLocalStorage';
import { authPages } from '../config/pages.config';
import useUserAPI from '../mocks/hooks/useUserAPI';
import { TUser } from '../mocks/db/users.db';
import { useAxiosFunction } from '../hooks/useAxiosFunction';
import { message } from 'antd'
import toast from 'react-hot-toast';

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
	const { error ,axiosFetch } = useAxiosFunction()

	const navigate = useNavigate();

	// call this function when you want to authenticate the user
	const onLogin = async (username: string, password: string) => {
		const body = JSON.stringify({
			username: username,
			password: password
		})
		axiosFetch({
			method: 'POST',
			url: 'api/token/',
			requestData: body
		})

		error ? toast.error(error) : toast.success()
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
