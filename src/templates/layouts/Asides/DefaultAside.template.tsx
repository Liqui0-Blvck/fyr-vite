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

const DefaultAsideTemplate = () => {
	const navigate = useNavigate();

	return (
		<Aside>
			<AsideHead>
				<LogoAndAsideTogglePart />
			</AsideHead>
			<AsideBody>
				<Nav>
					<NavItem {...appPages.homePage}/>
					<NavItem {...appPages.prospectPage}/>
					<NavItem {...appPages.calendarPage}/>
					<NavItem {...appPages.marketingPage}/>
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
