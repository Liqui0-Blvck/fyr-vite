



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
		text: 'Prospect',
		icon: 'HeroUser',
	},
	calendarPage: {
		id: 'calendarPage',
		to: '/calendar',
		text: 'Calendar',
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
