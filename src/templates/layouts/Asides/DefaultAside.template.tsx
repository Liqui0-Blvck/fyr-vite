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

const DefaultAsideTemplate = () => {
	const navigate = useNavigate();
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
						to={'recepcion'}
						icon={appPages.recepcionAppPages.icon}
						>
						<NavItem {...appPages.recepcionAppPages.subPages.recepcionMp} />
						<NavItem {...appPages.recepcionAppPages.subPages.envases} />
						<NavItem {...appPages.recepcionAppPages.subPages.controlCalidad} />
						{
							cargolabels(perfilData).includes('CDC Jefatura')
								? <NavItem {...appPages.recepcionAppPages.subPages.lotes} />
								: null
						}
					</NavCollapse>

					<NavCollapse
						text={appPages.produccion.text}
						to={'produccion'}
						icon={appPages.produccion.icon}
						>
						<NavItem {...appPages.produccion.subPages.p_produccion} />
						<NavItem {...appPages.produccion.subPages.tarjas} />
						<NavItem {...appPages.produccion.subPages.reproceso} />
						<NavItem {...appPages.produccion.subPages.tarja_seleccion} />
					</NavCollapse>
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
