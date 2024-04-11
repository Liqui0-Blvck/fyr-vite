import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authPages, componentsPages } from '../config/pages.config';
import { useAuth } from '../context/authContext';

interface IToken {
  access: string;
  refresh: string;
}

interface IUseAuthenticatedFetchResult<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useAuthenticatedFetch = <T>(token: (IToken | null), validate: (token: IToken | null) => Promise<boolean>, url: string): IUseAuthenticatedFetchResult<T> => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const navigate = useNavigate();
  const base_url = process.env.VITE_BASE_URL_DEV;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        if (!isMounted) return;

        const isValid = await validate(token);

        if (!isValid) {
          navigate(`../${authPages.loginPage.to}`, { replace: true });
        } else {
          const response = await fetch(base_url + url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${token?.access}`
            }
          });

          if (response.ok) {
            const fetchedData: T = await response.json();
            setData(fetchedData);
          } else if (response.status === 401) {
            navigate(`not_found/`, { replace: true });
            setError('No estás autorizado para hacer esta petición');
          } else if (response.status === 404) {
            setError('La URL que ingresaste no tiene ninguna información');
          } else {
            setError('Cualquier otro error');
          }
        }
      } catch (error) {
        console.error(error);
        navigate(`not_found/`, { replace: true });


      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500)
      }
    };

    fetchData();

    if (refresh) {
      fetchData();
    }

    return () => {
      isMounted = false;
      setRefresh(false);
    };
  }, [url, refresh, token, validate, navigate, base_url]);

  return {
    loading,
    data,
    error,
    setData,
    setRefresh
  };
};

// export interface tipo_config {
//     method?: string
//     headers?: {},
//     body?: any
// }

// export const authenticatedFetch_ = async (url: string, method: string, data: any) => {
//     const {refreshToken, authTokens} = useAuth()

//     const token = authTokens?.access
//     const config: tipo_config = {}
//     if (method == 'PUT' || method == 'PATCH' || method == 'POST') {
//         config.method = method
//         config.body = data
//         config.headers = {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//     } else {
//         config.method = method
//         config.headers = {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//     }
//     const response = await fetch(`${process.env.VITE_BASE_URL_DEV}${url}`, config)
//     if (response.status == 401) {
//         const access = await refreshToken()
//         if (access) {
//             config.headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access}` }
//             const response_token_valido = await fetch(`${process.env.VITE_BASE_URL_DEV}${url}`, config)
//             if (response_token_valido) {
//                 const data_token_valido: [] = await response_token_valido.json()
//                 return data_token_valido
//             }
//         }
//     } else if (response.ok) {
//         const data: [] = await response.json()
//         return data
//     } else {
//         console.log('Authenticated fetch fallo...', response.status)
//         return false
//     }
// }


