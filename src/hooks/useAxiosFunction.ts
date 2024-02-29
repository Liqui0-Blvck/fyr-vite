import { FC, useEffect, useState } from 'react';
import axios, { AxiosHeaders, Method, RawAxiosRequestHeaders } from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/';

const axiosInstanceDefault = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
});


const useAxiosFunction = (configObj: {
	axiosInstance?: { baseURL: string; headers: RawAxiosRequestHeaders | AxiosHeaders };
	token?: string
	method: Method,
	url: string,
	requestConfig?: {}
}) => {
	const { axiosInstance = axiosInstanceDefault , method, url, requestConfig = {} } = configObj;
	const [response, setResponse] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [controller, setController] = useState();
	const [refresh, setRefresh] = useState(false)
	


	useEffect(() => {
		let isMounted = true

		try {
			setLoading(true);

			const crudOperator = async () => {
					const ctrl = new AbortController();
				// @ts-ignore
				setController(ctrl);
				// @ts-ignore
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
				const res = await axiosInstance[method.toLowerCase()](url, {
					...requestConfig,
					signal: ctrl.signal,	
				});
				// console.log(res);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
				setResponse(res.data);
			}

			if (refresh){
				crudOperator()
			}
			
		} catch (err) {
			// @ts-ignore
			// console.log(err.message);
			// @ts-ignore
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			setError(err.message);
		} finally {
			setLoading(false);
		}

		return () => {
			isMounted = false
		}
	}, [])
		

	useEffect(() => {
		// console.log(controller);

		// useEffect cleanup function
		// @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		return () => controller && controller.abort();
	}, [controller]);

	return { response, loading, error, refresh }
};

export default useAxiosFunction;
