import React, { FC, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store";
import { RootState } from "../../../store/rootReducer";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { appPages, authPages } from "../../../config/pages.config";

interface IPageWrapperProps {
  children: ReactNode;
  className?: string;	
  isProtectedRoute?: boolean;
  title?: string;
  name?: string;
}

type Page = {
  to?: string;
  subPages?: { [key: string]: Page };
};

// Extraer rutas dinámicamente desde una configuración
export const extractRoutes = (pages: { [key: string]: Page }): string[] => {
  let routes: string[] = [];
  const extract = (page: Page) => {
    if (page.to) routes.push(page.to);
    if (page.subPages) Object.values(page.subPages).forEach(extract);
  };
  Object.values(pages).forEach(extract);
  return routes;
};

// Verificar si la ruta coincide con las rutas autorizadas
const isRouteAuthorized = (pathname: string, routes: string[]): boolean => {
  return routes.some((route) => {
    const routePattern = route.replace(/:[^\s/]+/g, "([^/]+)");
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(pathname);
  });
};


const PageWrapper: FC<IPageWrapperProps> = ({
  children,
  className,
  isProtectedRoute = true,
  title,
  name,
  ...rest
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useDocumentTitle({ title, name });

  // Rutas autorizadas
  const appPagesRoutes = extractRoutes(appPages);
  const authPagesRoutes = extractRoutes(authPages);
  const isAuthorizedPage = appPagesRoutes.includes(pathname);
  const isAuthorizedAuthPage = authPagesRoutes.includes(pathname);

  // Estado de autenticación desde Redux
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth.session);

  // Estado para bloquear el renderizado hasta que la lógica esté completa
  const [isAuthorizationReady, setAuthorizationReady] = useState(false);

  useEffect(() => {
    // Manejo de autorización para rutas protegidas
    const checkAuthorization = () => {
      if (!isProtectedRoute) {
        if (!isAuthenticated) {
          // Redirigir al login si no está autenticado
          navigate(authPages.loginPage.to, { replace: true });
        } else if (!isAuthorizedPage && !isAuthorizedAuthPage) {
          // Redirigir a 404 si no tiene permiso
          navigate("/404", { replace: true });
        }
      } else if (isAuthenticated && isAuthorizedPage) {
        // Si está autenticado y en una página autorizada, redirigir al dashboard
        navigate(appPages.homePage.to, { replace: true });
      } else if (!isAuthorizedPage && !isAuthorizedAuthPage) {
        // Redirigir a la página actual si no está autorizado
        navigate(pathname, { replace: true });
      }
    };

    // Ejecutar la lógica de autorización y desbloquear el renderizado
    if (isAuthenticated !== undefined) {
      checkAuthorization();
      setAuthorizationReady(true); // Indica que la lógica está completa
    }
  }, [isAuthenticated, isProtectedRoute, isAuthorizedPage, isAuthorizedAuthPage, pathname, navigate]);

  // Bloquear el renderizado hasta que la autorización esté lista
  if (!isAuthorizationReady) {
    return <p>Cargando...</p>; // Componente de carga o vacío
  }

  return (
    <main
      data-component-name="PageWrapper"
      className={classNames("flex shrink-0 grow flex-col", className)}
      {...rest}
    >
      {children}
    </main>
  );
};

PageWrapper.defaultProps = {
  className: undefined,
  isProtectedRoute: true,
  title: undefined,
  name: undefined,
};

export default PageWrapper;
