import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import { appPages, authPages, componentsPages, examplePages } from '../config/pages.config';
import NotFoundPage from '../pages/NotFound.page';
import LoginPage from '../pages/auth/Login.page';






// const ProjectDashboardPage = lazy(
// 	() => import('../pages/project/ProjectDashboardPage/ProjectDashboard.page'),
// );
// const ProjectBoardPage = lazy(() => import('../pages/project/ProjectBoardPage/ProjectBoard.page'));

const ExamplesPage = lazy(() => import('../pages/ExamplePage/Examples.page'));
const ProfilePage = lazy(() => import('../pages/Profile.page'));
const HomePage = lazy(() => import('../pages/main/Main.Page'))





/**
 * Other
 */
const UnderConstructionPage = lazy(() => import('../pages/UnderConstruction.page'));

const contentRoutes: RouteProps[] = [
	

	// {
	// 	path: appPages.projectAppPages.subPages.projectDashboardPage.to,
	// 	element: <ProjectDashboardPage />,
	// },
	// {
	// 	path: `${appPages.projectAppPages.subPages.projectBoardPageLink.to}/:id`,
	// 	element: <ProjectBoardPage />,
	// },

	// {
	// 	path: appPages.educationAppPages.to,
	// 	element: <UnderConstructionPage />,
	// },

	// {
	// 	path: appPages.reservationAppPages.to,
	// 	element: <UnderConstructionPage />,
	// },

	{
		path: appPages.mailAppPages.to,
		element: <UnderConstructionPage />,
	},
	{ path: appPages.mainAppPages.to, element: <HomePage />},


	
	{ path: examplePages.examplesPage.to, element: <ExamplesPage /> },


	// { path: authPages.profilePage.to, element: <ProfilePage /> },
	{ path: authPages.loginPage.to, element: <LoginPage /> },
	{ path: authPages.profilePage.to, element: <ProfilePage /> },

	{ path: '*', element: <NotFoundPage /> },
];

export default contentRoutes;
