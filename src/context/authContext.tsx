import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { authPages, appPages } from '../config/pages.config';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { TPerfil, TUsuario } from '../types/registros types/registros.types';
import { useAuthenticatedFetch } from '../hooks/useAxiosFunction';
import useDarkMode from '../hooks/useDarkMode';


interface IAuthTokens {
  access: string;
  refresh: string;
}

interface IAuthContext {
  authTokens: IAuthTokens | null;
  userID: TokenPayload | null
  perfilData: TPerfil
  personalizacionData: any
  login: (username: string, password: string) => Promise<void>
  refreshToken: () => Promise<string | false>
  validate: (token: IAuthTokens | null) => Promise<boolean>;
  // onLogin: (username: string, password: string) => Promise<void>;
  onLogout: () => void;
  obtener_perfil: () => Promise<void>
}

interface TokenPayload {
  user_id: number;
  // Otros campos según la estructura de tu token JWT
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
  const [perfilData, setPerfilData] = useState<TPerfil | null>(null)
  const [personalizacionData, setPersonalizacionData] = useState(null)
  const [refresh, setRefresh] = useState<boolean>(false)
  const [logeado, setLogeado] = useState<boolean>(false)
  const { setDarkModeStatus } = useDarkMode();

  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()
  const location = useLocation()


  // console.log("hola soy el perfil" ,  perfilData)
  // const [lastActivity, setLastActivity] = useState<number>(Date.now()); 

  // const resetTimer = () => {
  //   setLastActivity(Date.now());
  // };

  // const checkInactivity = () => {
  //   const thirtyMinutes = 1 * 60 * 1000; // 30 minutos en milisegundos
  //   const currentTime = Date.now();
  //   if (currentTime - lastActivity > thirtyMinutes) {
  //     onLogout(); // Si ha pasado más de 30 minutos, cierra la sesión automáticamente
  //   }
  // };

  // useEffect(() => {
  //   const interval = setInterval(checkInactivity, 2000); // Verifica la inactividad cada segundo

  //   return () => clearInterval(interval);
  // }, [lastActivity]);


  // const onLogin = async (username: string, password: string) => {
  //   const body = JSON.stringify({
  //     username: username,
  //     password: password
  //   });

  //   const res = await fetch(`${base_url}/api/token/`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: body
  //   });

  //   if (res.ok) {
  //     const data = await res.json();
  //     toast.success('Inicio de sesión exitoso!');// Convierte a TUsuario
  //     setRefresh(true)
  //     setAuthTokens(data)
  //     Cookies.set('token', JSON.stringify(data), { expires: 1 });
  //     Cookies.set('user', JSON.stringify(data.access), { expires: 1 })

  //     // resetTimer();

  //     // navigate(`../${appPages.mainAppPages.to}`, { replace: true });
  //     window.location.href = `${appPages.mainAppPages.to}`
  //   } else if (res.status === 401) {
  //     toast.error('Error al ingresar, volver a intentar');
  //   }
  // };

  const validate = async (token: IAuthTokens | null): Promise<boolean> => {
    const response = await fetch(`${base_url}/auth/jwt/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'token': token?.access })
    });

    return response.status === 200 ? true : response.status === 401 ? await updateToken() : false;
  }

  const updateToken = async () => {
    const response = await fetch(`${base_url}/auth/jwt/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'refresh': authTokens?.access })
    });


    if (response.status === 200) {
      const data = await response.json();
      setAuthTokens(data);
      Cookies.set('user', JSON.stringify(data));
      return true;
    } else {
      return false;
    }
  };

  // useEffect(() => {
  //   let isMounted = true;

  //   const fetchProfile = async () => {
  //     try {
  //       if (authTokens && userID && isMounted) {
  //         const res = await fetch(`${base_url}/api/registros/perfil/${userID.user_id}`, {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${authTokens.access}`
  //           }
  //         });

  //         if (res.ok) {
  //           const data = await res.json();
  //           if (isMounted) {
  //             setPerfilData(data);
  //           }
  //         } else {
  //           console.log("Tenemos un problema nuevo");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error al obtener el perfil:", error);
  //     }
  //   };

  //   if (refresh) {
  //     fetchProfile();
  //   }

  //   fetchProfile();

  //   return () => {
  //     isMounted = false;
  //     setRefresh(false);
  //   };
  // }, [authTokens, userID, refresh]);



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

    useEffect(() => {
        if (refresh){
          obtener_perfil()
        }
        
        obtener_perfil()
    }, [logeado, refresh])

    const obtener_perfil = async () => {
        const configMe = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authTokens?.access}`
            }
        }
        const responseMe = await fetch(`${process.env.VITE_BASE_URL_DEV}/auth/users/me`, configMe)
        if (responseMe.ok) {
            const dataMe = await responseMe.json()
            const configPerfil = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authTokens?.access}`
                }
            }
            const responsePersonalizacion = await fetch(`${process.env.VITE_BASE_URL_DEV}/api/registros/personalizacion-perfil/${dataMe.id}`, configPerfil)
            const responsePerfil = await fetch(`${process.env.VITE_BASE_URL_DEV}/api/registros/perfil/${dataMe.id}`, configPerfil)
            if (responsePerfil.ok && responsePersonalizacion.ok || responsePerfil.ok && !responsePersonalizacion.ok) {
                const dataPersonalizacion = await responsePersonalizacion.json()
                const dataPerfil = await responsePerfil.json()
                setPerfilData(dataPerfil)
                setPersonalizacionData(dataPersonalizacion)
                setDarkModeStatus(dataPersonalizacion.estilo)
            } else {
                toast.error('ERROR INESPERADO PERFIL')
            }
        } else {
            refreshToken()
        }
    }

    const onLogout = async () => {
        setAuthTokens(null);
        setPerfilData(null)
        Cookies.remove('token')
        Cookies.remove('user')

        navigate(`../${authPages.loginPage.to}`, { replace: true });
    };

    async function login(username:string, password: string) {
        const configLogin = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }

        const responseLogin = await fetch(`${process.env.VITE_BASE_URL_DEV}/auth/jwt/create/`, configLogin)
        if (responseLogin.ok) {
            const dataTokens = await responseLogin.json()
            setLogeado(true)
            setAuthTokens(dataTokens)
            Cookies.set('token', JSON.stringify(dataTokens), { expires: 1 });
            Cookies.set('user', JSON.stringify(dataTokens.access), { expires: 1 })
            // navigate(`../${appPages.mainAppPages.to}`, { replace: true });
            window.location.href = `${appPages.mainAppPages.to}`

        } else {
            toast.error('ERROR INESPERADO LOGIN')
        }
    }

    async function refreshToken() {
        const configRefresh = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh: authTokens?.refresh
            })
        }

        const responseRefresh = await fetch(`${process.env.VITE_BASE_URL_DEV}/auth/jwt/refresh/`, configRefresh)
        if (responseRefresh.ok) {
            const dataRefresh: IAuthTokens = await responseRefresh.json()
            setAuthTokens(dataRefresh)
            Cookies.set('token', JSON.stringify(dataRefresh), { expires: 1 });
            Cookies.set('user', JSON.stringify(dataRefresh.access), { expires: 1 })
            return dataRefresh.access
        } else {
            console.log('redirigiendo a login....')
            setAuthTokens(null)
            Cookies.remove('token')
            Cookies.remove('user')
            navigate(`../${authPages.loginPage.to}`, { replace: true });
            return false
        }
    }

    useEffect(() => {
        const verificar_login = async () => {
            const token_cookie = Cookies.get('token') ? JSON.parse(Cookies.get('token')!): ''
            // console.log('token_cookie', token_cookie)
            if (token_cookie == '' && location.pathname != '/login') {
                navigate(`../${authPages.loginPage.to}`, { replace: true });
            } else {
                const verificarToken = await fetch(`${process.env.VITE_BASE_URL_DEV}/auth/jwt/verify/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({token: token_cookie.access})})
                if (verificarToken.status == 401) {
                    const access = await refreshToken()
                    setLogeado(true)
                    // else {
                    //     console.log('redirigiendo a login....')
                    //     setAuthTokens(null)
                    //     Cookies.remove('token')
                    //     Cookies.remove('user')
                    //     navigate(`../${authPages.loginPage.to}`, { replace: true });
                    // }
                }
            }
        }
        verificar_login()
    })

    // useEffect(() => {
    //     console.log( 'authTokens',authTokens)
    // }, [authTokens])

  const value: IAuthContext = {
    authTokens,
    perfilData: perfilData!,
    userID,
    personalizacionData: personalizacionData,
    login,
    refreshToken,
    validate,
    // onLogin,
    onLogout,
    obtener_perfil,
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
