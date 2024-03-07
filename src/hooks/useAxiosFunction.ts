import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

const BASE_URL = "http://127.0.0.1:8000/";

const axiosInstanceDefault = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

interface Config {
  axiosInstance?: typeof axiosInstanceDefault;
  method: Method;
  url: string;
  requestData?: any; // Datos para la solicitud (opcional)
  requestConfig?: AxiosRequestConfig; // Configuración adicional de la solicitud (opcional)
}

export const useAxiosFunction = () => {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const axiosFetch = ({
    axiosInstance = axiosInstanceDefault,
    method,
    url,
    requestData,
    requestConfig = {},
  }: Config) => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ctrl = new AbortController();
        setController(ctrl);

        const res = await axiosInstance.request({
          method,
          url,
          data: requestData,
          ...requestConfig,
          signal: ctrl.signal,
        });

        setResponse(res.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (refresh || requestData) {
      fetchData();
    }

    fetchData();
  }
  return { response, loading, error, setRefresh, axiosFetch }
};

