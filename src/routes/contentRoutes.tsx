import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import { appPages, authPages} from '../config/pages.config';
import NotFoundPage from '../pages/NotFound.page';
import LoginPage from '../pages/auth/Login.page';
import DetailClient from 'src/pages/clients/detailPages/DetailClient.page';

const ProfilePage = lazy(() => import('../pages/profile/Profile.page'));






/**
 * Other
 */
const UnderConstructionPage = lazy(() => import('../pages/UnderConstruction.page'));
const CustomDashboardPage = lazy(() => import('../pages/customDashboardPages/CustomerDashboard.page'));


// Pages Prospects
const ProspectPage = lazy(() => import('../pages/prospects/Prospects.page'));
const DetailProspectPage = lazy(() => import('../pages/prospects/detailPages/DetailProspect.page'));


// Pages Clients
const ClientPage = lazy(() => import('../pages/clients/Clients.page'));
const DetailClientPage = lazy(() => import('../pages/clients/detailPages/DetailClient.page'));



const contentRoutes: RouteProps[] = [

	{path: appPages.homePage.to, element: <CustomDashboardPage/>},



	// prospects urls
	{path: appPages.prospectPage.to, element: <ProspectPage/>},
	{path: appPages.prospectPage.subPages.detail_page.to, element: <DetailProspectPage/>},


	// clients urls
	{path: appPages.clientPage.to, element: <ClientPage />},
	{path: appPages.clientPage.subPages.detail_page.to, element: <DetailClientPage />},
	




	// { path: authPages.loginPage.to, element: <LoginPage /> },
	{ path: authPages.profilePage.to, element: <ProfilePage /> },
	{ path: authPages.loginPage.to, element: <LoginPage /> },
	{ path: authPages.profilePage.to, element: <ProfilePage /> },

	{ path: '*', element: <NotFoundPage /> },
];

export default contentRoutes;
