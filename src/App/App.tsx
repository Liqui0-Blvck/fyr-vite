import React, { useEffect } from "react";
import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import AsideRouter from "../components/router/AsideRouter";
import Wrapper from "../components/layouts/Wrapper/Wrapper";
import HeaderRouter from "../components/router/HeaderRouter";
import ContentRouter from "../components/router/ContentRouter";
import FooterRouter from "../components/router/FooterRouter";
import useFontSize from "../hooks/useFontSize";
import getOS from "../utils/getOS.util";
import Toast, { Toaster } from "react-hot-toast";
import { useAppSelector } from "../store";
import { RootState } from "../store/rootReducer";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { authPages } from "../config/pages.config";
import useAuthStateSync from "../hooks/useAuthState";
import SnakeToBrain from "../components/SnakeToBrain";
import Loading from "../components/Loading";

const App = () => {
  getOS();

  const { fontSize } = useFontSize();
  dayjs.extend(localizedFormat);

  // Obtener el estado de carga desde el hook de sincronización de autenticación
  const { isLoading } = useAuthStateSync();
	const navigate = useNavigate();

  // Obtener el estado de autenticación
  const { isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth.session
  );
  const { pathname } = useLocation();

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated && pathname !== authPages.loginPage.to){
				// Si no está autenticado y no está en la página de login, redirigir al login
				navigate(authPages.loginPage.to);
			}
		}
	}, [isLoading, isAuthenticated, pathname]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loading />
			</div>
		);
	}


  return (
    <>
      <style>{`:root {font-size: ${fontSize}px}`}</style>
      <div data-component-name="App" className="flex grow flex-col">
        {isAuthenticated && <AsideRouter />}
        <Wrapper>
          <Toaster />
          {isAuthenticated && <HeaderRouter />}
          {isAuthenticated && <ContentRouter />}
          {isAuthenticated && <FooterRouter />}
        </Wrapper>
      </div>
    </>
  );
};

export default App;
