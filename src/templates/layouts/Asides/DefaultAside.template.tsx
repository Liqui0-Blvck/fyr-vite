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
import { useAppSelector } from '../../../store/hook';
import { RootState } from '../../../store/rootReducer';

const DefaultAsideTemplate = () => {
	const { user } = useAppSelector((state: RootState) => state.auth.user)

	

	return (
		<Aside>
			<AsideHead>
				<LogoAndAsideTogglePart />
			</AsideHead>
			<AsideBody>
				<Nav>
					<NavItem {...appPages.homePage}/>
					<NavItem {...appPages.prospectPage}/>
					<NavItem {...appPages.clientPage}/>
					<NavItem {...appPages.calendarPage}/>
					{
						user?.role === 'executive' && (
							<NavCollapse
								text={appPages.tasksPage.text}
								to={appPages.tasksPage.to}
								icon={appPages.tasksPage.icon}
								>
								<NavItem {...appPages.tasksPage.subpages.task_list} />
								<NavItem {...appPages.tasksPage.subpages.task_dashboard} />
							</NavCollapse>
						)
					}

					{
						user?.role === 'admin' && (
							<NavCollapse
								text={appPages.teamManagementPage.text}
								to={appPages.teamManagementPage.to}
								icon={appPages.teamManagementPage.icon}
							>
								<NavItem {...appPages.teamManagementPage.subpages.teams}/>
								<NavItem {...appPages.teamManagementPage.subpages.roles}/>
							</NavCollapse>
						)
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
