import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import { useAuth } from '../../context/authContext';
import Container from '../../components/layouts/Container/Container';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../components/layouts/Subheader/Subheader';
import Card, { CardBody, CardFooter, CardFooterChild } from '../../components/ui/Card';
import Button, { IButtonProps } from '../../components/ui/Button';
import { TIcons } from '../../types/icons.type';
import Label from '../../components/form/Label';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import Avatar from '../../components/Avatar';
import useSaveBtn from '../../hooks/useSaveBtn';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Checkbox from '../../components/form/Checkbox';
import Badge from '../../components/ui/Badge';
import RichText from '../../components/RichText';
import Radio, { RadioGroup } from '../../components/form/Radio';
import useDarkMode from '../../hooks/useDarkMode';
import { TDarkMode } from '../../types/darkMode.type';
import { useAppSelector } from '../../store';
import { RootState } from '../../store/rootReducer';
import EditProfile from './EditProfile.component';
import PasswordComponent from './Password.component';
import TwoFactorConfig from './TwoFactorConfig.component';
import NewlettersComponent from './NewlettersComponent.component';
import SessionsComponent from './SessionsComponent.component';
import ThemeComponent from './ThemeComponent.component';

type TTab = {
	text:
		| 'Editar Perfil'
		| 'Password'
		| '2FA'
		| 'Boletín de noticias'
		| 'Sesiones'
		| 'Temas';
	icon: TIcons;
};
type TTabs = {
	[key in
		| 'EDIT'
		| 'PASSWORD'
		| '2FA'
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
	'2FA': {
		text: '2FA',
		icon: 'HeroShieldExclamation',
	},
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

	const { setDarkModeStatus } = useDarkMode();

	const [activeTab, setActiveTab] = useState<TTab>(TAB.EDIT);
	const { user } = useAppSelector((state: RootState) => state.auth.session)


	const defaultProps: IButtonProps = {
		color: 'zinc',
	};
	const activeProps: IButtonProps = {
		...defaultProps,
		isActive: true,
		color: 'blue',
		colorIntensity: '500',
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			fileUpload: '',
			username: user?.displayName,
			email: user?.email,
			// firstName: user?.,
			// lastName: user?.lastName,
			// position: user?.position,
			// role: user?.role,
			oldPassword: '',
			newPassword: '',
			newPasswordConfirmation: '',
			// twoFactorAuth: user?.twoFactorAuth,
			// weeklyNewsletter: user?.newsletter?.weeklyNewsletter || false,
			// lifecycleEmails: user?.newsletter?.lifecycleEmails || false,
			// promotionalEmails: user?.newsletter?.promotionalEmails || false,
			// productUpdates: user?.newsletter?.productUpdates || false,
			// bio: (user?.bio && (JSON.parse(user.bio) as Descendant[])) || [],
			gender: 'Male',
			theme: 'dark',
			birth: '1987-12-21',
		},
		onSubmit: () => {},
	});

	useEffect(() => {
		setDarkModeStatus(formik.values.theme as TDarkMode);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.theme]);



	const { saveBtnText, saveBtnColor, saveBtnDisable } = useSaveBtn({
		isNewItem: false,
		isSaving,
		isDirty: formik.dirty,
	});

	return (
		<PageWrapper name={formik.values?.username!}>
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
				<SubheaderRight>
					<Button
						icon='HeroServer'
						variant='solid'
						color={saveBtnColor}
						isDisable={saveBtnDisable}
						onClick={() => formik.handleSubmit()}>
						{saveBtnText}
					</Button>
				</SubheaderRight>
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
								<div className='border-zinc-500/25 dark:border-zinc-500/50 max-sm:border-s sm:border-t sm:pt-4'>
									<Button icon='HeroTrash' color='red'>
										Eliminar Cuenta
									</Button>
								</div>
							</div>
							<div className='col-span-12 flex flex-col gap-4 sm:col-span-8 md:col-span-9'>
								{activeTab === TAB.EDIT && (
									<EditProfile formik={formik}/>
								)}
								
								{activeTab === TAB.PASSWORD && (
									<PasswordComponent formik={formik}/>
								)}
								{activeTab === TAB['2FA'] && (
									<TwoFactorConfig formik={formik}/>
								)}
								{activeTab === TAB.NEWSLETTER && (
									<NewlettersComponent formik={formik}/>
								)}
								{activeTab === TAB.SESSIONS && (
									<SessionsComponent />
								)}
								
								{activeTab === TAB.THEME && (
									<ThemeComponent formik={formik}/>
								)}
							</div>
						</div>
					</CardBody>
					<CardFooter>
						<CardFooterChild>
							<div className='flex items-center gap-2'>
								<Icon icon='HeroDocumentCheck' size='text-2xl' />
								<span className='text-zinc-500'>Ultimo guardado:</span>
								<b>{dayjs().locale(i18n.language).format('LLL')}</b>
							</div>
						</CardFooterChild>
						<CardFooterChild>
							<Button
								icon='HeroServer'
								variant='solid'
								color={saveBtnColor}
								isDisable={saveBtnDisable}
								onClick={() => formik.handleSubmit()}>
								{saveBtnText}
							</Button>
						</CardFooterChild>
					</CardFooter>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default ProfilePage;
