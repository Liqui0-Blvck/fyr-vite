import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../components/layouts/Container/Container';
import Subheader, {
	SubheaderLeft,
} from '../../components/layouts/Subheader/Subheader';
import Card, { CardBody } from '../../components/ui/Card';
import Button, { IButtonProps } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import useDarkMode from '../../hooks/useDarkMode';
import { RootState } from '../../store/rootReducer';
import EditProfile from './EditProfile.component';
import PasswordComponent from './Password.component';
import TwoFactorConfig from './TwoFactorConfig.component';
import NewlettersComponent from './NewlettersComponent.component';
import SessionsComponent from './SessionsComponent.component';
import ThemeComponent from './ThemeComponent.component';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { TIcons } from '../../types/icons.type';


type TTab = {
	text:
		| 'Editar Perfil'
		| 'Password'
		// | '2FA'
		| 'Boletín de noticias'
		| 'Sesiones'
		| 'Temas';
	icon: TIcons;
};
type TTabs = {
	[key in
		| 'EDIT'
		| 'PASSWORD'
		// | '2FA'
		| 'NEWSLETTER'
		| 'SESSIONS'
		| 'THEME']: TTab;
};
const TAB: TTabs = {
	EDIT: {
		text: 'Editar Perfil',
		icon: 'HeroPencil',
	},
	PASSWORD: {
		text: 'Password',
		icon: 'HeroKey',
	},
	// // '2FA': {
	// // 	text: '2FA',
	// // 	icon: 'HeroShieldExclamation',
	// // },
	NEWSLETTER: {
		text: 'Boletín de noticias',
		icon: 'HeroBell',
	},
	SESSIONS: {
		text: 'Sesiones',
		icon: 'HeroQueueList',
	},
	THEME: {
		text: 'Temas',
		icon: 'HeroSwatch',
	},
};

const ProfilePage = () => {
	const { i18n } = useTranslation();
	const [activeTab, setActiveTab] = useState<TTab>(TAB.EDIT);
	const { user } = useAppSelector((state: RootState) => state.auth.user)
	
	const defaultProps: IButtonProps = {
		color: 'zinc',
	};
	const activeProps: IButtonProps = {
		...defaultProps,
		isActive: true,
		color: 'blue',
		colorIntensity: '500',
	};

	return (
		<PageWrapper name={user?.displayName!}>
			<Subheader>
				<SubheaderLeft>
					{`${user?.displayName}`}{' '}
					<Badge
						color='blue'
						variant='outline'
						rounded='rounded-full'
						className='border-transparent'>
						Editar Usuario
					</Badge>
				</SubheaderLeft>
			</Subheader>
			
			<Container className='h-full'>
				<Card className='h-full'>
					<CardBody>
						<div className='grid grid-cols-12 gap-4'>
							<div className='col-span-12 flex gap-4 max-sm:flex-wrap sm:col-span-4 sm:flex-col md:col-span-3'>
								{Object.values(TAB).map((i) => (
									<div key={i.text}>
										<Button
											icon={i.icon}
											// eslint-disable-next-line react/jsx-props-no-spreading
											{...(activeTab.text === i.text
												? {
														...activeProps,
												  }
												: {
														...defaultProps,
												  })}
											onClick={() => {
												setActiveTab(i);
											}}>
											{i.text}
										</Button>
									</div>
								))}
								<div 
									className='border-zinc-500/25 dark:border-zinc-500/50 max-sm:border-s sm:border-t sm:pt-4'/> 

							</div>
							<div className='col-span-12 flex flex-col gap-4 sm:col-span-8 md:col-span-9'>
								{activeTab === TAB.EDIT && (
									<EditProfile/>
								)}
								
								{activeTab === TAB.PASSWORD && (
									<PasswordComponent/>
								)}
								{/* {activeTab === TAB['2FA'] && (
									<TwoFactorConfig/>
								)} */}
								{activeTab === TAB.NEWSLETTER && (
									<NewlettersComponent/>
								)}
								{activeTab === TAB.SESSIONS && (
									<SessionsComponent />
								)}
								
								{activeTab === TAB.THEME && (
									<ThemeComponent/>
								)}
							</div>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default ProfilePage;
