import React from 'react';
import { useNavigate } from 'react-router-dom';
import Aside, { AsideBody, AsideFooter, AsideHead } from '../../../components/layouts/Aside/Aside';
import LogoAndAsideTogglePart from './_parts/LogoAndAsideToggle.part';
import DarkModeSwitcherPart from './_parts/DarkModeSwitcher.part';
import { appPages, componentsPages } from '../../../config/pages.config';
import Nav, {
	NavButton,
	NavCollapse,
	NavItem,
	NavSeparator,
	NavTitle,
	NavUser,
} from '../../../components/layouts/Navigation/Nav';
import Badge from '../../../components/ui/Badge';
import UserTemplate from '../User/User.template';
import { useAuth } from '../../../context/authContext';
import { cargolabels } from '../../../utils/generalUtils';
import Tooltip from '../../../components/ui/Tooltip';

const DefaultAsideTemplate = () => {
	const { perfilData } = useAuth()

	return (
		<Aside>
			<AsideHead>
				<LogoAndAsideTogglePart to={appPages.mainAppPages.to} />
			</AsideHead>
			<AsideBody>
				<Nav>
					

					<NavTitle>Accesos</NavTitle>
					 <NavCollapse
						text={appPages.registroAppPages.text}
						to={'registro'}
						icon={appPages.registroAppPages.icon}
						>
						<NavItem {...appPages.registroAppPages.subPages.clientes} />
						<NavItem {...appPages.registroAppPages.subPages.productores} />
						<NavItem {...appPages.registroAppPages.subPages.camiones} />
						<NavItem {...appPages.registroAppPages.subPages.conductores} />
						<NavItem {...appPages.registroAppPages.subPages.comercializadores} />
						<NavItem {...appPages.registroAppPages.subPages.operarios} />
					</NavCollapse>
					

					<NavCollapse
						text={appPages.recepcionAppPages.text}
						to={'registro'}
						icon={appPages.recepcionAppPages.icon}
						>
						<NavItem {...appPages.recepcionAppPages.subPages.recepcionMp} />
						<NavItem {...appPages.recepcionAppPages.subPages.envases} />
					</NavCollapse>

					<NavCollapse
						text={appPages.controles_calidad.text}
						to={'control'}
						icon={appPages.controles_calidad.icon}
						>
							<NavCollapse
								text={appPages.controles_calidad.subPages.recepcion.text}
								to={'cc_produccion'}
								icon={appPages.controles_calidad.icon}
								>
									<NavItem {...appPages.controles_calidad.subPages.recepcion.subPages.controlCalidad} />
									<NavItem {...appPages.controles_calidad.subPages.recepcion.subPages.control_calidad_vb} />
									<NavItem {...appPages.controles_calidad.subPages.recepcion.subPages.proyeccion} />
							</NavCollapse>

							<NavCollapse
								text={appPages.controles_calidad.subPages.produccion.text}
								to={'cc_produccion'}
								icon={appPages.controles_calidad.icon}
								>
								<NavItem {...appPages.controles_calidad.subPages.produccion.subPages.produccion} />
								<NavItem {...appPages.controles_calidad.subPages.produccion.subPages.reproceso} />
							</NavCollapse>

							<NavCollapse
								text={appPages.controles_calidad.subPages.seleccion.text}
								to={'cc_produccion'}
								icon={appPages.controles_calidad.icon}
								>
								<NavItem {...appPages.controles_calidad.subPages.seleccion.subPages.seleccion} />
							</NavCollapse>

					</NavCollapse>

					<NavCollapse
						text={appPages.produccion.text}
						to={'produccion'}
						icon={appPages.produccion.icon}
						>
							<NavItem {...appPages.produccion.subPages.p_produccion} />
							<NavItem {...appPages.produccion.subPages.reproceso} />

							<NavCollapse
								text={appPages.produccion.subPages.seleccion.text}
								to={'seleccion'}
								icon={appPages.produccion.icon}
								>
								<NavItem {...appPages.produccion.subPages.seleccion.subPages.programa_seleccion} />
								<NavItem {...appPages.produccion.subPages.seleccion.subPages.bins_subproducto} />
								<NavItem {...appPages.produccion.subPages.seleccion.subPages.bins_subproducto_operario} />
							</NavCollapse>
					</NavCollapse>

					{
					cargolabels(perfilData).includes('Bodega Patio Exterior', 'Administrador')
						? (
							<NavCollapse
								text={appPages.bodega.text}
								to={'bodega'}
								icon={appPages.bodega.icon}
								>

								<NavItem {...appPages.bodega.subPages.stock_bodega} />
								<NavItem {...appPages.bodega.subPages.lotes} />

								<NavCollapse
									text={appPages.bodega.subPages.bodegas.text}
									to={'seleccion'}
									icon={appPages.produccion.icon}
									>
									<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g1} />
									<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g2} />
									<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g3} />
									<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g4} />
									<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g5} />
									<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g6} />
									<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g7} />
								</NavCollapse>

								<NavCollapse
									text={appPages.bodega.subPages.acciones.text}
									to={'seleccion'}
									icon={appPages.produccion.icon}
									>
									<NavItem {...appPages.bodega.subPages.acciones.subPages.transferencias} />
									<NavItem {...appPages.bodega.subPages.acciones.subPages.agrupacion_bin} />
									<NavItem {...appPages.bodega.subPages.acciones.subPages.fumigacion} />
									<NavItem {...appPages.bodega.subPages.acciones.subPages.inventario_bodega} />
								</NavCollapse>
							</NavCollapse>
						)
						: null
					}

				</Nav>
			</AsideBody>
			<AsideFooter>
				<Nav>
					<NavSeparator />
				</Nav>

				<UserTemplate />
				<DarkModeSwitcherPart />
			</AsideFooter>
		</Aside>
	);
};

export default DefaultAsideTemplate;
