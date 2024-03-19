import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authPages, appPages } from '../config/pages.config';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { TUsuario } from '../types/registros types/registros.types';
import { useAuthenticatedFetch } from '../hooks/useAxiosFunction';


interface IAuthTokens {
  access: string;
  refresh: string;
}

interface IAuthContext {
  authTokens: IAuthTokens | null;
  userID: TokenPayload | null
  perfilData: TPerfil
  validate: (token: IAuthTokens | null) => Promise<boolean>;
  onLogin: (username: string, password: string) => Promise<void>;
  onLogout: () => void;
}

interface TokenPayload {
  user_id: number;
  // Otros campos según la estructura de tu token JWT
}

type TPerfil = {
  id: number,
  fecha_creacion: string,
  fecha_modificacion: string,
  sexo: string,
  direccion: string,
  comuna: string,
  celular: string,
  fnacimiento: string,
  valoracion: number,
  fotoperfil: string,
  area: string,
  user: {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    username: string
  }
}



const AuthContext = createContext<IAuthContext | null>(null);

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const authTokenLocalStorage = Cookies.get('token') ? JSON.parse(Cookies.get('token')!) : null;
  const userLocalStorage = Cookies.get('user') ? jwtDecode<TokenPayload>(Cookies.get('user')!) : null;

  const [authTokens, setAuthTokens] = useState<IAuthTokens | null>(authTokenLocalStorage);
  const [userID, setUserID] = useState<TokenPayload | null>(userLocalStorage)
  const [perfilData, setPerfilData] = useState<TPerfil | null>()
  const [refresh, setRefresh] = useState<boolean>(false)

  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()

  console.log(userID?.user_id)



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
    });

    if (res.ok) {
      const data = await res.json();
      toast.success('Inicio de sesión exitoso!');// Convierte a TUsuario
      setRefresh(true)
      setAuthTokens(data)
      Cookies.set('token', JSON.stringify(data), { expires: 2 });
      Cookies.set('user', JSON.stringify(data.access), { expires: 2 })

      navigate(`../${appPages.mainAppPages.to}`, { replace: true });
    } else if (res.status === 401) {
      toast.error('Error al ingresar, volver a intentar');
    }
  };



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



  console.log(userID?.user_id)

  console.log(refresh)

  // const getProfile = async (id: number) => {
  //   try {
  //     const res = await fetch(`${base_url}/api/registros/perfil/${id}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${authTokens?.access}`
  //       }
  //     });

  //     if (res.ok) {
  //       const data = await res.json();

  //       setPerfilData(data);
  //     } else {
  //       console.log("Tenemos un problema nuevo");
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener el perfil:", error);
  //   }
  // };

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        if (authTokens && userID && isMounted) {
          const res = await fetch(`${base_url}/api/registros/perfil/${userID.user_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authTokens.access}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setPerfilData(data);
            }
          } else {
            console.log("Tenemos un problema nuevo");
          }
        }
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

    if (refresh) {
      fetchProfile();
    }

    fetchProfile();

    return () => {
      isMounted = false;
      setRefresh(false);
    };
  }, [authTokens, userID, refresh]);



  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       if (authTokens) {
  //         const isTokenValid = await validate(authTokens);
  //         if (!isTokenValid) {
  //           await updateToken();
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error al verificar o actualizar el token:", error);

  //     }
  //   }, 1000 * 60 * 4);


  //   return () => clearInterval(interval);
  // }, [authTokens, validate, updateToken]);


  // Función para cerrar sesión
  const onLogout = async () => {
    setAuthTokens(null);
    setPerfilData(null)
    Cookies.remove('token')
    Cookies.remove('user')

    navigate(`../${authPages.loginPage.to}`, { replace: true });
  };

  const value: IAuthContext = {
    authTokens,
    perfilData,
    userID,
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
