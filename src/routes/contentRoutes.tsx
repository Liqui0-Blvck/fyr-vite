import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import { appPages, authPages, examplePages } from '../config/pages.config';
import NotFoundPage from '../pages/NotFound.page';
import LoginPage from '../pages/auth/Login.page';
import FormularioRegistroProductores from '../pages/productores/Formulario Registro/FormularioRegistroProductores';
import ListaCamiones from '../pages/camiones/ListaCamiones';
import CCRendimiento from '../pages/ccvistobueno/PDF/PDFCCRendimiento.tsx';






// const ProjectDashboardPage = lazy(
// 	() => import('../pages/project/ProjectDashboardPage/ProjectDashboard.page'),
// );
// const ProjectBoardPage = lazy(() => import('../pages/project/ProjectBoardPage/ProjectBoard.page'));


const ProfilePage = lazy(() => import('../pages/Profile.page'));
const HomePage = lazy(() => import('../pages/main/Main.Page'))

//	PRODUCTORES
const Productores = lazy(() => import('../pages/productores/ListaProductores'))
const RegistroProductor = lazy(() => import('../pages/productores/Formulario Registro/FormularioRegistroProductores'))
const DetalleProductor = lazy(() => import('../pages/productores/Detalle/DetalleProductor'))


// 	CAMIONES
const Camiones = lazy(() => import('../pages/camiones/ListaCamiones'))




// CONDUCTORES 
const Conductores = lazy(() => import('../pages/choferes/ListaConductores'))



// Comercializadores
const Comercializadores = lazy(() => import('../pages/comercializador/ListaComercializadores'))



// OPERARIOS
const Operarios = lazy(() => import('../pages/operarios/ListaOperarios'))





// RECEPCION
const GuiaRecepcion = lazy(() => import('../pages/guia recepcion/ListaGuiaRecepcion'))
const Envases = lazy(() => import('../pages/envases/ListaEnvases'))
const RegistroGuiaRecepcion = lazy(() => import('../pages/guia recepcion/Formulario Registro/FormularioRegistroGuiaRecepcion.tsx'))
const EdicionGuiaRecepcion = lazy(() => import('../pages/guia recepcion/Formulario Edicion/Edicion Guia/FormularioEdicionGuiaRecepcion.tsx'))
const DetalleGuiaRecepcion = lazy(() => import('../pages/guia recepcion/Detalle/Detalle Guia/DetalleGuia.tsx'))
const PDFGuiaRecepcion =  lazy(() => import('../pages/guia recepcion/PDF/GuiaRecepcion.tsx'))


// CONTROL CALIDAD
const ControlCalidad = lazy(() => import('../pages/control calidad/ListaControlCalidad.tsx'))
const DetalleCC = lazy(() => import('../pages/control calidad/Detalle/DetalleCC.tsx'))
const GuiaRecepcionPDF = lazy(() => import('../pages/guia recepcion/PDF/GuiaRecepcion.jsx'))
const ControlRendimiento = lazy(() => import('../pages/ccvistobueno/ListaControlRendimiento.tsx'))
const DetallCCRendimiento = lazy(() => import('../pages/ccvistobueno/Detalle/DetalleCCRendimiento.tsx'))




// CC Rendimiento

const PDFCCRendimiento = lazy(() => import ('../pages/ccvistobueno/PDF/PDFCCRendimiento.tsx'))

/**
 * Other
 */
const UnderConstructionPage = lazy(() => import('../pages/UnderConstruction.page'));

const contentRoutes: RouteProps[] = [

	{
		element: <UnderConstructionPage />,
	},
	{ path: appPages.mainAppPages.to, element: <HomePage /> },

	// Productores
	{ path: appPages.registroAppPages.subPages.productores.to, element: <Productores /> },



	// Camiones
	{ path: appPages.registroAppPages.subPages.camiones.to, element: <Camiones /> },
	// { path: '/app/registro-productor', element: <RegistroProductor /> },
	// { path: '/app/productor/:id', element: <DetalleProductor /> },

	// Conductores
	{ path: appPages.registroAppPages.subPages.conductores.to, element: <Conductores /> },


	// Comercializadores

	{ path: appPages.registroAppPages.subPages.comercializadores.to, element: <Comercializadores /> },


	// OPERARIOS
	{ path: appPages.registroAppPages.subPages.operarios.to, element: <Operarios /> },


	// RECEPCION MP
	{ path: appPages.recepcionAppPages.subPages.recepcionMp.to, element: <GuiaRecepcion /> },
	{ path: appPages.recepcionAppPages.subPages.envases.to, element: <Envases /> },
	{ path: '/app/registro-guia-recepcion', element: <RegistroGuiaRecepcion /> },
	{ path: '/app/edicion-guia-recepcion/:id', element: <EdicionGuiaRecepcion /> },
	{ path: '/app/pdf-guia-recepcion/:id', element: <PDFGuiaRecepcion /> },
	{ path: '/app/recepciomp/:id', element: <DetalleGuiaRecepcion /> },



	// CONTROL CALIDAD
	{ path: '/app/control-calidad/', element: <ControlCalidad /> },
	{ path: '/app/control-calidad/:id', element: <DetalleCC /> },
	{ path: '/app/vb_control/', element:  <ControlRendimiento /> },
	{ path: '/app/vb_control/:id', element:  <DetallCCRendimiento /> },
	
	
	{ path: '/app/pdf-rendimiento/:id', element:  <PDFCCRendimiento /> },
	







	// { path: authPages.profilePage.to, element: <ProfilePage /> },
	{ path: authPages.loginPage.to, element: <LoginPage /> },
	{ path: authPages.profilePage.to, element: <ProfilePage /> },
	{ path: 'not_found', element: <NotFoundPage />},

	{ path: '*', element: <NotFoundPage /> },
];

export default contentRoutes;
