



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
		subPages: {
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
		subPages: {
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
