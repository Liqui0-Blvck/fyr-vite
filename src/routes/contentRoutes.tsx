import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import { appPages, authPages} from '../config/pages.config';
import NotFoundPage from '../pages/NotFound.page';
import LoginPage from '../pages/auth/Login.page';

const ProfilePage = lazy(() => import('../pages/profile/Profile.page'));






/**
 * Other
 */
const UnderConstructionPage = lazy(() => import('../pages/UnderConstruction.page'));
const CustomDashboardPage = lazy(() => import('../pages/customDashboardPages/CustomerDashboard.page'));
const ProspectPage = lazy(() => import('../pages/prospects/Prospects.page'));




const contentRoutes: RouteProps[] = [

	{path: appPages.homePage.to, element: <CustomDashboardPage/>},
	{path: appPages.prospectPage.to, element: <ProspectPage/>},
	




	// { path: authPages.loginPage.to, element: <LoginPage /> },
	{ path: authPages.profilePage.to, element: <ProfilePage /> },
	{ path: authPages.loginPage.to, element: <LoginPage /> },
	{ path: authPages.profilePage.to, element: <ProfilePage /> },

	{ path: '*', element: <NotFoundPage /> },
];

export default contentRoutes;
