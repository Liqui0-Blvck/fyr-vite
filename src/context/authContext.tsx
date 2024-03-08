import React, { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCookieStorage from '../hooks/useLocalStorage';
import { authPages, appPages } from '../config/pages.config';
import { message } from 'antd';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface IAuthTokens {
  access: string;
  refresh: string
}


interface IUser {

}


export interface IAuthContextProps {
  authTokens: IAuthTokens | null
  validate: (token: IAuthTokens | null) => Promise<boolean>;
  onLogin: (username: string, password: string) => Promise<void>;
  onLogout: () => void;
}

const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const authTokenLocalStorage = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
  const refreshTokenStorage = Cookies.get('refresh') ? JSON.parse(Cookies.get('refresh')!) : null;
  const [authTokens, setAuthTokens] = useState<IAuthTokens | null>(() => authTokenLocalStorage);
  const [refreshToken, setRefreshToken] = useState<IAuthTokens | null>(() => refreshTokenStorage);

  const base_url = process.env.VITE_BASE_URL_DEV

  useEffect(() => {
    const authTokenLocalStorage = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    const refreshTokenStorage = Cookies.get('refresh') ? JSON.parse(Cookies.get('refresh')!) : null;
    setAuthTokens(authTokenLocalStorage);
    setRefreshToken(refreshTokenStorage)

  }, [])


  const navigate = useNavigate();

  // Función para iniciar sesión
  const onLogin = async (username: string, password: string) => {
    const body = JSON.stringify({
      username: username,
      password: password
    });

    const res = await fetch(`${base_url}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })

    if (res.ok) {
      const data = await res.json()
      Cookies.set('user', JSON.stringify(data))
      Cookies.set('refresh', JSON.stringify(data.refresh))
      toast.success('Inicio de sesión exitoso!')
      navigate(`../${appPages.mainAppPages.to}`, { replace: true })

    } else if (res.status === 401) {
      toast.error('Error al ingresar, volver a intentar')
    }
  }


  const validate = async (token: IAuthTokens | null): Promise<boolean> => {
    console.log(token)
    const response = await fetch(`${base_url}/api/token/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'token': token?.access })
    });

    return response.status === 200 ? true : response.status === 401 ? await updateToken() : false;
  }

  const updateToken = async () => {
    const response = await fetch(`${base_url}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'refresh': refreshToken })
    });


    if (response.status === 200) {
      const data = await response.json();
      console.log(data)
      setAuthTokens(data);
      Cookies.set('user', JSON.stringify(data));
      return true;
    } else {
      return false;
    }
  };


  useEffect(() => {
    let isMounted = true

    const fourMinutes = 1000 * 60 * 4
    const interval = setInterval(async () => {
      try {
        if (authTokens && isMounted) {
          const isTokenValid = await validate(authTokens);
          if (!isTokenValid) {
            await updateToken();
          }
        }
      } catch (error) {
        console.error("Error al verificar o actualizar el token:", error);
      }
    }, fourMinutes);

    return () => {
      clearInterval(interval)
      isMounted = false
    };
  }, [authTokens, validate, updateToken]);


  // Función para cerrar sesión
  const onLogout = async () => {
    setAuthTokens(null);
    Cookies.remove('user')
    navigate(`../${authPages.loginPage.to}`, { replace: true });
  };

  const value: IAuthContextProps = useMemo(
    () => ({
      authTokens,
      validate,
      onLogin,
      onLogout,
    }),
    [authTokens]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

