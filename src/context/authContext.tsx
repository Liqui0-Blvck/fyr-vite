import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authPages, appPages } from '../config/pages.config';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface IAuthTokens {
  access: string;
  refresh: string;
}

interface IAuthContext {
  authTokens: IAuthTokens | null;
  setAuthTokens: (tokens: IAuthTokens | null) => void;
  validate: (token: IAuthTokens | null) => Promise<boolean>;
  onLogin: (username: string, password: string) => Promise<void>;
  onLogout: () => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const authTokenLocalStorage = Cookies.get('token') ? JSON.parse(Cookies.get('token')!) : null;
  const [authTokens, setAuthTokens] = useState<IAuthTokens | null>(() => authTokenLocalStorage);
  const navigate = useNavigate();
  const base_url = process.env.VITE_BASE_URL_DEV

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
      setAuthTokens(data)
      Cookies.set('token', JSON.stringify(data), { expires: 7 });
      toast.success('Inicio de sesión exitoso!')
      navigate(`../${appPages.mainAppPages.to}`, { replace: true })

    } else if (res.status === 401) {
      toast.error('Error al ingresar, volver a intentar')
    }
  }


  const validate = async (token: IAuthTokens | null): Promise<boolean> => {
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
      body: JSON.stringify({ 'refresh': authTokens?.access })
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

  const saveTokens = (tokens: IAuthTokens | null) => {
    setAuthTokens(tokens);
  };


  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (authTokens) {
          const isTokenValid = await validate(authTokens);
          if (!isTokenValid) {
            await updateToken();
          }
        }
      } catch (error) {
        console.error("Error al verificar o actualizar el token:", error);

      }
    }, 1000 * 60 * 4);


    return () => clearInterval(interval);
  }, [authTokens, validate, updateToken]);


  // Función para cerrar sesión
  const onLogout = async () => {
    setAuthTokens(null);
    Cookies.remove('user')
    navigate(`../${authPages.loginPage.to}`, { replace: true });
  };

  const value: IAuthContext = {
    authTokens,
    setAuthTokens: saveTokens,
    validate,
    onLogin,
    onLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
