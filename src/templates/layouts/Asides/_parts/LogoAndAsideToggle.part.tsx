import React from 'react';
import { Link } from 'react-router-dom';
import Visible from '../../../../components/utils/Visible';
import Icon from '../../../../components/icon/Icon';
import useAsideStatus from '../../../../hooks/useAsideStatus';
import LogoTemplate from '../../Logo/Logo.template';

interface ILogo {
	to: string
}

const LogoAndAsideTogglePart = ({ to }: ILogo ) => {
	const { asideStatus, setAsideStatus } = useAsideStatus();
	return (
		<>
			<Visible is={asideStatus}>
				<Link to={to} aria-label='Logo' className='flex items-center justify-center gap-2 rounded-md'>
					<img src='/src/assets/prodalmen_foto.png' className='w-20 rounded-md'/>
					<h1 className='relative top-2 text-lg  text-orange-900'>Prodalmen</h1>
				</Link>
			</Visible>
			<button
				type='button'
				aria-label='Toggle Aside Menu'
				onClick={() => setAsideStatus(!asideStatus)}
				className='flex h-12 w-12 items-center justify-center'>
				<Icon
					icon={asideStatus ? 'HeroBars3BottomLeft' : 'HeroBars3'}
					className='text-2xl'
				/>
			</button>
		</>
	);
};

export default LogoAndAsideTogglePart;
