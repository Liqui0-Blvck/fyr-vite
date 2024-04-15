import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import { appPages, authPages, examplePages } from '../config/pages.config';
import NotFoundPage from '../pages/NotFound.page';
import LoginPage from '../pages/auth/Login.page';
import DashboardProduccion from '../pages/programas produccion/Detalle Produccion/DashboardProduccion.tsx';


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
const EdicionGuiaRecepcion = lazy(() => import('../pages/guia recepcion/Formulario Edicion/Edicion Guia Recepcion/FormularioEdicionGuiaRecepcion.tsx'))
const DetalleGuiaRecepcion = lazy(() => import('../pages/guia recepcion/Detalle/Detalle Guia/DetalleGuia.tsx'))
const PDFGuiaRecepcion =  lazy(() => import('../pages/guia recepcion/PDF/GuiaRecepcion.tsx'))


// CONTROL CALIDAD
const ControlCalidad = lazy(() => import('../pages/control calidad/ListaControlCalidad.tsx'))
const DetalleCC = lazy(() => import('../pages/control calidad/Detalle/DetalleCC.tsx'))
const DetalleCCPepa = lazy(() => import('../pages/control calidad/Detalle/DetalleCCPepa.tsx'))
const GuiaRecepcionPDF = lazy(() => import('../pages/guia recepcion/PDF/GuiaRecepcion.jsx'))
const ControlRendimiento = lazy(() => import('../pages/ccvistobueno/ListaControlRendimiento.tsx'))
const DetalleCCRendimiento = lazy(() => import('../pages/ccvistobueno/Detalle/DetalleCCRendimiento.tsx'))
const DetalleProyeccion = lazy(() => import ('../pages/proyeccion fruta recepcionada/Detalle Proyeccion/DetalleProyeccion.tsx'))




// CC Rendimiento

const PDFCCRendimiento = lazy(() => import ('../pages/ccvistobueno/PDF/PDFCCRendimiento.tsx'))


// PROGRAMAS DE PRODUCCION

const ListaProgramas = lazy(() => import ('../pages/programas produccion/ListaProgramas.tsx'))
const DetalleControlRendimiento = lazy(() => import ('../pages/programas produccion/Detalle Control Rendimiento/DetalleControlRendimiento.tsx'))
const DetallePrograma = lazy(() => import ('../pages/programas produccion/Detalle Produccion/DashboardProduccion.tsx'))
const FormularioRegistroPrograma = lazy(() => import ('../pages/programas produccion/Formularios Produccion/Formulario Registro Programa/FormularioRegistroPrograma.tsx'))


const PDFOperarioXKilo = lazy(() => import ('../pages/programas produccion/PDF Programa Produccion/PDFOperarioXKilo.tsx'))
const PDFResumidoOperario = lazy(() => import ('../pages/programas produccion/PDF Programa Produccion/PDFResumidoOperario.tsx'))
const PDFPreLimpia = lazy(() => import ('../pages/programas produccion/PDF Programa Produccion/PDFPreLimpia.tsx'))
const PDFDescascarado = lazy(() => import ('../pages/programas produccion/PDF Programa Produccion/PDFDescascarado.tsx'))
const PDFDocumentoEntrada = lazy(() => import ('../pages/programas produccion/PDF Programa Produccion/PDFDocumentoEntrada.tsx'))
const PDFDetalleEnvases = lazy(() => import ('../pages/programas produccion/PDF Programa Produccion/PDFDetalleEnvases.tsx'))





// PROGRAMAS DE REPROCESO DE PRODUCCION

const ListaProgramasReproceso = lazy(() => import ('../pages/programa reproceso/ListaProgramasReproceso.tsx'))
const DetalleProgramaReproceso = lazy(() => import ('../pages/programa reproceso/Detalle Produccion/DashboardProduccion.tsx'))
const FormularioRegistroProgramaReproceso = lazy(() => import ('../pages/programa reproceso/Formularios Produccion/Formulario Registro Programa/FormularioRegistroPrograma.tsx'))


const PDFOperarioXKiloReproceso = lazy(() => import ('../pages/programa reproceso/PDF Programa Produccion/PDFOperarioXKilo.tsx'))
const PDFResumidoOperarioReproceso = lazy(() => import ('../pages/programa reproceso/PDF Programa Produccion/PDFResumidoOperario.tsx'))
const PDFPreLimpiaReproceso = lazy(() => import ('../pages/programa reproceso/PDF Programa Produccion/PDFPreLimpia.tsx'))
const PDFDescascaradoReproceso = lazy(() => import ('../pages/programa reproceso/PDF Programa Produccion/PDFDescascarado.tsx'))
const PDFDocumentoEntradaReproceso = lazy(() => import ('../pages/programa reproceso/PDF Programa Produccion/PDFDocumentoEntrada.tsx'))
const PDFDetalleEnvasesReproceso = lazy(() => import ('../pages/programa reproceso/PDF Programa Produccion/PDFDetalleEnvases.tsx'))


// const ListaProgramasReproceso = lazy(() => import ('../pages/programa reproceso/ListaProgramasReproceso.tsx'))


// ADMINISTRADOR

const FormularioRegistroPerfil = lazy(() => import ('../pages/usuarios/Formulario Usuario/FormularioRegistroPerfil.tsx'))



// BODEGA
const ListaBodega = lazy(() => import ('../pages/bodega/ListaBodega.tsx'))
const DetalleBodega = lazy(() => import ('../pages/bodega/Detalle Bodega/DetalleGuia.tsx'))



// CC TARJA 
const ListaCCTarja = lazy(() => import ('../pages/control calidad tarjas/ListaControlCalidadTarja.tsx'))
const DetalleCCTarja = lazy(() => import ('../pages/control calidad tarjas/Detalle Control Calidad Tarja/DetalleCCTarja.tsx'))
// CC TARJA REPROCESO
const ListaCCTarjaReproceso = lazy(() => import ('../pages/control calidad tarja reproceso/ListaControlCalidadTarjaReproceso.tsx'))
const DetalleCCTarjaReproceso = lazy(() => import ('../pages/control calidad tarja reproceso/Detalle Control Calidad Tarja/DetalleCCTarjaReproceso.tsx'))


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
	{ path: '/app/recepcionmp/:id', element: <DetalleGuiaRecepcion /> },



	// CONTROL CALIDAD
	{ path: '/app/control-calidad/', element: <ControlCalidad /> },
	{ path: '/app/control-calidad/:id', element: <DetalleCC /> },
	{ path: '/app/vb_control/', element:  <ControlRendimiento /> },
	{ path: '/app/vb_control/:id', element:  <DetalleCCRendimiento /> },
	{ path: '/app/control-calidad/:id/muestra/:id', element:  <DetalleCCPepa /> },
	{ path: '/app/proyeccion-fruta', element:  <DetalleProyeccion /> },
	
	
	{ path: '/app/pdf-rendimiento/:id', element:  <PDFCCRendimiento /> },
	

	// PROGRAMAS DE PRODUCCION
	{ path: '/app/produccion/', element:  <ListaProgramas /> },
	{ path: '/app/produccion/programa/:id/', element: <DetallePrograma />},
	{ path: '/app/produccion/registro-programa/:id', element: <FormularioRegistroPrograma />},
	{ path: '/app/pdf-operario-x-kilo/', element: <PDFOperarioXKilo />},
	{ path: '/app/pdf-operario-resumido/', element: <PDFResumidoOperario />},
	{ path: '/app/pdf-pre-limpia/', element: <PDFPreLimpia />},
	{ path: '/app/pdf-descascarado/', element: <PDFDescascarado />},
	{ path: '/app/pdf-documento-entrada/:id', element: <PDFDocumentoEntrada />},
	{ path: '/app/pdf-detalle-envases/:id', element: <PDFDetalleEnvases />},
	{ path: '/app/proyeccion-rendimiento/:id', element: <DetalleControlRendimiento />},
	{ path: '/app/programa-reproceso/', element: <ListaProgramasReproceso />},

	// PROGRAMAS DE PRODUCCION REPROCESO
	{ path: '/app/programa-reproceso/', element: <ListaProgramasReproceso />},
	{ path: '/app/produccion/programa-reproceso/:id/', element: <DetalleProgramaReproceso />},
	{ path: '/app/produccion/registro-programa-reproceso/:id', element: <FormularioRegistroProgramaReproceso />},
	{ path: '/app/pdf-operario-x-kilo-reproceso/', element: <PDFOperarioXKiloReproceso />},
	{ path: '/app/pdf-operario-resumido-reproceso/', element: <PDFResumidoOperarioReproceso />},
	{ path: '/app/pdf-pre-limpia-reproceso/', element: <PDFPreLimpiaReproceso />},
	{ path: '/app/pdf-descascarado-reproceso/', element: <PDFDescascaradoReproceso />},
	{ path: '/app/pdf-documento-entrada-reproceso/:id', element: <PDFDocumentoEntradaReproceso />},
	{ path: '/app/pdf-detalle-envases-reproceso/:id', element: <PDFDetalleEnvasesReproceso />},




	// ADMINISTRADOR
	{ path: '/app/registro-usuarios/', element: <FormularioRegistroPerfil />},


	// BODEGA
	{ path: '/app/bodega/', element: <ListaBodega />},
	{ path: '/app/bodega/:id', element: <DetalleBodega />},




	// TARJAS CC
	{ path: '/app/tarjas-cc/', element: <ListaCCTarja />},
	{ path: '/app/tarjas-cc/:id', element: <DetalleCCTarja />},
	{ path: '/app/control-rendimiento/:id', element: <DetalleCCTarja />},
	// TARJAS CC REPROCESO
	{ path: '/app/tarjas-cc-reproceso/', element: <ListaCCTarjaReproceso />},
	{ path: '/app/tarjas-cc-reproceso/:id', element: <DetalleCCTarjaReproceso />},



	



	// { path: authPages.profilePage.to, element: <ProfilePage /> },
	{ path: authPages.loginPage.to, element: <LoginPage /> },
	{ path: authPages.profilePage.to, element: <ProfilePage /> },
	{ path: 'not_found', element: <NotFoundPage />},

	{ path: '*', element: <NotFoundPage /> },
];

export default contentRoutes;
