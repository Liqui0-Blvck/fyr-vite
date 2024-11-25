

export const appPages = {
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
		to: '/profile',
		text: 'Profile',
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
