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

export const useAuthenticatedFetch = <T>(token: (IToken | null), validate: (token: IToken | null) => Promise<boolean> ,url: string): IUseAuthenticatedFetchResult<T> => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { refreshToken } = useAuth()
  const navigate = useNavigate();
  const base_url = process.env.VITE_BASE_URL_DEV;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        if (!isMounted) return
      
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
            refreshToken()
            setError('No estás autorizado para hacer esta petición');
          } else if (response.status === 404) {
            setError('La URL que ingresaste no tiene ninguna información');
          } else {
            setError('Cualquier otro error');
          }
        
      } catch (error) {
        console.error(error);
        setRefresh(true)

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

