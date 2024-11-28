import React, { FC, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";
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
  const { session } = useAppSelector((state: RootState) => state.auth);



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
