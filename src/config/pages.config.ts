



export const appPages = {
	homePage: {
		id: 'homePage',
		to: '/',
		text: 'Home',
		icon: 'HeroHome',
	},
	prospectPage: {
		id: 'prospectPage',
		to: '/prospect',
		text: 'Prospectos',
		icon: 'HeroUser',
		subpages: {
			detail_page: {
				id: 'detail_page',
				to: '/prospect/:id',
				text: 'Detalle Prospecto',
				icon: 'HeroUser',
			}
		}
	},
	clientPage: {
		id: 'clientPage',
		to: '/client',
		text: 'Clientes',
		icon: 'HeroUser',
		subpages: {
			detail_page: {
				id: 'detail_page',
				to: '/client/:id',
				text: 'Detalle Cliente',
				icon: 'HeroUser',
			}
		}
	},
	calendarPage: {
		id: 'calendarPage',
		to: '/calendar',
		text: 'Calendario',
		icon: 'HeroCalendar',
	},
	marketingPage: {
		id: 'marketingPage',
		to: '/marketing',
		text: 'Marketing',
		icon: 'HeroSquare3Stack3D',
	},
	tasksPage: {
		id: 'tasksPage',
		to: '/tasks',
		text: 'Tareas',
		icon: 'HeroClipboardDocumentCheck',
		subpages: {
			task_list: {
				id: 'task_list',
				to: '/tasks/list',
				text: 'Lista de tareas',
				icon: 'HeroClipboardDocumentCheck',
			},
			task_dashboard: {
				id: 'task_dashboard',
				to: '/tasks/dashboard',
				text: 'Tablero de tareas',
				icon: 'HeroRectangleStack',
			}
		}
	},
	teamManagementPage: {
		id: 'teamManagementPage',
		to: '/team-management',
		text: 'Gestión de equipo',
		icon: 'HeroUserGroup',
		subpages: {
			teams: {
				id: 'teams',
				to: '/team-management/teams',
				text: 'Equipos',
				icon: 'HeroUserGroup',
			},
			roles: {
				id: 'roles',
				to: '/team-management/roles',
				text: 'Roles',
				icon: 'HeroShieldCheck',
			}
		}

	}
};

export const componentsPages = {
};

export const authPages = {
	loginPage: {
		id: 'loginPage',
		to: '/login',
		text: 'Login',
		icon: 'HeroArrowRightOnRectangle',
	},
	profilePage: {
		id: 'profilePage',
		to: '/perfil',
		text: 'Perfil',
		icon: 'HeroUser',
	},
	restorePage: {
		id: 'restoreAccount',
		to: '/restore-account',
		text: 'Restore Account',
		icon: 'HeroArrowPath'
	}
};

const pagesConfig = {
	...authPages,
};

export default pagesConfig;
