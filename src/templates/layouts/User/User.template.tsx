import React, { useState } from 'react';
import Icon from '../../../components/icon/Icon';
import Badge from '../../../components/ui/Badge';
import { NavButton, NavItem, NavSeparator } from '../../../components/layouts/Navigation/Nav';
import { appPages, authPages } from '../../../config/pages.config';
import User from '../../../components/layouts/User/User';
import { useAuth } from '../../../context/authContext';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import { RootState } from 'src/store/rootReducer';
import { logout } from '../../../store/slices/auth/authSlices';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const UserTemplate = () => {
	const [loading, setLoading] = useState(false);
	const { user } = useAppSelector((state: RootState) => state.auth.user)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const handleLogout = async () => {
		setLoading(true);
		await dispatch(logout()).unwrap().then(() => {
			Cookies.remove('user');
			navigate('/login')
		})
		setLoading(false);
	}



	return (
		<User
			isLoading={loading}
			name={user?.first_name + ' ' + user?.last_name}
			nameSuffix={!loading && <Icon icon='HeroCheckBadge' color='blue' />}
			position={user?.position ? user?.position : ''}
			src={user?.photoURL ? user?.photoURL : ''}
			>
			<NavSeparator />
			<NavItem {...authPages.profilePage} />
			{/* <NavItem {...appPages.mailAppPages.subPages.inboxPages}>
				<Badge variant='solid' className='leading-none'>
					3
				</Badge>
				<NavButton icon='HeroPlusCircle' title='New Mail' onClick={() => {}} />
			</NavItem> */}
			<NavItem text='Logout' icon='HeroArrowRightOnRectangle' onClick={() => handleLogout()} />
		</User>
	);
};

export default UserTemplate;
