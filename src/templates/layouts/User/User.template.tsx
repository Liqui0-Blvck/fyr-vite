import React, { useEffect } from 'react';
import Icon from '../../../components/icon/Icon';
import Badge from '../../../components/ui/Badge';
import { NavButton, NavItem, NavSeparator } from '../../../components/layouts/Navigation/Nav';
import { appPages, authPages } from '../../../config/pages.config';
import User from '../../../components/layouts/User/User';
import { useAuth } from '../../../context/authContext';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { jwtDecode } from 'jwt-decode';

interface IUser {
	first_name: string,
	last_name: string,
	email: string,
	username: string
}

const UserTemplate = () => {
	const { perfilData, onLogout } = useAuth();


	return (
		<User
			isLoading={false}
			name={perfilData?.user.first_name}
			nameSuffix={perfilData?.user.username}
			position={perfilData?.area}
			src={''}
		// suffix={
		// 	<Badge color='amber' variant='solid' className='text-xs font-bold'>
		// 		PRO
		// 	</Badge>
		// }
		>
			<NavSeparator />
			<NavItem {...authPages.profilePage} />
			<NavItem text='Logout' icon='HeroArrowRightOnRectangle' onClick={() => onLogout()} />
		</User>
	);
};

export default UserTemplate;
