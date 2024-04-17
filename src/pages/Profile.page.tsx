import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import PageWrapper from '../components/layouts/PageWrapper/PageWrapper';
import { useAuth } from '../context/authContext';
import Container from '../components/layouts/Container/Container';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../components/layouts/Subheader/Subheader';
import Card, { CardBody, CardFooter, CardFooterChild } from '../components/ui/Card';
import Button, { IButtonProps } from '../components/ui/Button';
import { TIcons } from '../types/icons.type';
import Label from '../components/form/Label';
import Input from '../components/form/Input';
import Select from '../components/form/Select';
import rolesDb from '../mocks/db/roles.db';
import Avatar from '../components/Avatar';
import useSaveBtn from '../hooks/useSaveBtn';
import FieldWrap from '../components/form/FieldWrap';
import Icon from '../components/icon/Icon';
import Checkbox from '../components/form/Checkbox';
import Badge from '../components/ui/Badge';
import RichText from '../components/RichText';
import Radio, { RadioGroup } from '../components/form/Radio';
import useDarkMode from '../hooks/useDarkMode';
import { TDarkMode } from '../types/darkMode.type';
import toast from 'react-hot-toast';
import { putFotoPerfil, putPerfil } from '../api/perfil.api';
import { putPersonalizacionPerfil } from '../api/personalizacion-perfil.api';
import { putUser } from '../api/user.api';
import SelectReact, { TSelectOptions } from '../components/form/SelectReact';
const options: TSelectOptions = [
	{ value: '2024', label: '2024' },
	{ value: '2023', label: '2023'},
	{ value: '2022', label: '2022'},
	{ value: '2021', label: '2021'}
];

const options_balanza_recepcion: TSelectOptions = [
	{ value: 'Manual', label: 'Manual'},
	{ value: 'Automático', label: 'Automático'}
]

import fotoPerfil from '../assets/avatar/user6-thumb.png'

// type TTab = {
// 	text:
// 		| 'Edit Profile'
// 		| 'Social'
// 		| 'Password'
// 		| '2FA'
// 		| 'Newsletter'
// 		| 'Sessions'
// 		| 'Connected'
// 		| 'Appearance';
// 	icon: TIcons;
// };
// type TTabs = {
// 	[key in
// 		| 'EDIT'
// 		| 'SOCIAL'
// 		| 'PASSWORD'
// 		| '2FA'
// 		| 'NEWSLETTER'
// 		| 'SESSIONS'
// 		| 'CONNECTED'
// 		| 'APPEARANCE']: TTab;
// };

type TTab = {
	text:
		| 'Perfil'
		| 'Personalización'
		| 'Permisos'
	icon: TIcons;
};
type TTabs = {
	[key in
		| 'PERFIL'
		| 'PERSONALIZACION'
		| 'PERMISOS' ]: TTab;
};

const TAB: TTabs = {
	PERFIL: {
		text: 'Perfil',
		icon: 'HeroPencil',
	},
	PERSONALIZACION: {
		text: 'Personalización',
		icon: 'HeroSwatch',
	},
	PERMISOS: {
		text: 'Permisos',
		icon: 'HeroShieldExclamation'
	}
};

const ProfilePage = () => {
	// console.log(process.env.API_URL)
	const { i18n } = useTranslation();

	const { setDarkModeStatus } = useDarkMode();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// const { userData, isLoading } = useAuth();
	const { perfilData, personalizacionData, authTokens, refreshToken, obtener_perfil } = useAuth()
	const [activeTab, setActiveTab] = useState<TTab>(TAB.PERFIL);

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
			// fotoperfil: perfilData?.fotoperfil ? perfilData.fotoperfil: '',
			username: perfilData?.user.username,
			email: perfilData?.user.email,
			first_name: perfilData?.user.first_name,
			last_name: perfilData?.user.last_name,
			sexo: perfilData?.sexo,
			estilo: personalizacionData?.estilo,
			fnacimiento: perfilData?.fnacimiento,
			celular: perfilData?.celular,
			cabecera: personalizacionData?.cabecera,
			anio: personalizacionData?.anio,
			direccion: perfilData?.direccion,
			comuna: perfilData?.comuna,
			iot_balanza_recepcionmp: personalizacionData?.iot_balanza_recepcionmp
		},
		onSubmit: async (values) => {
			let put_valido = false
			setIsSaving(true)
			const put_perfil = await putPerfil(values, authTokens?.access, perfilData.user.id)
			const put_personalizacion = await putPersonalizacionPerfil(values, authTokens?.access, perfilData.user.id)
			const put_user = await putUser(values, authTokens?.access, perfilData.user.id)
			if (put_perfil == true && put_personalizacion == true && put_user == true) {
				put_valido = true
			} else if (put_perfil == 401 || put_personalizacion == 401 || put_user == 401) {
				const access = await refreshToken()
				if (access) {
					const put_perfil_v = await putPerfil(values, access, perfilData.user.id)
					const put_personalizacion_v = await putPersonalizacionPerfil(values, access, perfilData.user.id)
					const put_user_v = await putUser(values, access, perfilData.user.id)
					if (put_perfil_v && put_personalizacion_v && put_user_v) {
						put_valido = true
					}
				}
			}
			if (put_valido) {
				toast.success('Perfil Editado')
				location.reload()
			} else {
				toast.error('Error en la edición del perfil')
			}
			setIsSaving(false)
		},
	});

	useEffect(() => {
		setDarkModeStatus(formik.values.estilo as TDarkMode);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.estilo]);

	// const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);
	// const [passwordNewShowStatus, setPasswordNewShowStatus] = useState<boolean>(false);
	// const [passwordNewConfShowStatus, setPasswordNewConfShowStatus] = useState<boolean>(false);

	const { saveBtnText, saveBtnColor, saveBtnDisable } = useSaveBtn({
		isNewItem: false,
		isSaving,
		isDirty: formik.dirty,
	});
	return (
		<PageWrapper name='pagina'>
			<Subheader>
				<SubheaderLeft>
					<Badge
						color='blue'
						variant='outline'
						rounded='rounded-full'
						className='border-transparent'>
						{`${perfilData?.user.first_name} ${perfilData?.user.last_name}`}{' '}
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
							<div className='col-span-12 flex gap-4 max-sm:flex-wrap sm:col-span-4 sm:flex-col md:col-span-2'>
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
								{/* <div className='border-zinc-500/25 dark:border-zinc-500/50 max-sm:border-s sm:border-t sm:pt-4'>
									<Button icon='HeroTrash' color='red'>
										Delete Account
									</Button>
								</div> */}
							</div>
							<div className='col-span-12 flex flex-col gap-4 sm:col-span-8 md:col-span-10'>
								{activeTab === TAB.PERFIL && (
									<>
										<div className='text-4xl font-semibold'>Perfil</div>
										<div className='flex w-full gap-4'>
											<div className='flex-shrink-0'>
												<Avatar
													src={perfilData?.fotoperfil ? perfilData.fotoperfil : fotoPerfil}
													className='!w-24'
													// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
													// name={`${userData?.firstName} ${userData?.lastName}`}
												/>
											</div>
											<div className='flex grow items-center'>
												<div>
													<div className='w-full'>
														<Label
															htmlFor='fileUpload'
															className=''
															description='At least 800x800 px recommended. JPG or PNG and GIF is allowed'>
															Editar Imagen
														</Label>
														<Input
															id='fileUpload'
															name='fileUpload'
															type='file'
															onChange={async (e) => {
																// console.log(e.target.files ? e.target.files[0] : '' )
																if (e.target.files) {
																	const put_perfil = await putFotoPerfil(e.target.files[0], authTokens?.access, perfilData.user.id)
																	let valido = false
																	if (put_perfil == 401) {
																		const access = await refreshToken()
																		if (access) {
																			const put_perfil_v = await putFotoPerfil(e.target.files[0], access, perfilData.user.id)
																			if (put_perfil_v == true) {
																				valido = true
																			}
																		}
																	} else if (put_perfil == true) {
																		valido = true
																	}
																	if (valido) {
																		toast.success('Cambio de Foto Correcto')
																		location.reload()
																	} else {
																		toast.error('Error en el Cambio de Foto')
																	}
																}
															}}
															// defaultValue={perfilData?.fotoperfil ? perfilData.fotoperfil: ''}
														/>
													</div>
												</div>
											</div>
										</div>
										<div className='grid grid-cols-12 gap-4'>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='username'>Nombre de Usuario</Label>
												<FieldWrap
													firstSuffix={
														<Icon icon='HeroUser' className='mx-2' />
													}>
													<Input
														id='username'
														name='username'
														// onChange={formik.handleChange}
														// defaultValue={formik.values.username}
														value={formik.values.username}
														autoComplete='username'
														readOnly={true}
													/>
												</FieldWrap>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='email'>E-mail</Label>
												<FieldWrap
													firstSuffix={
														<Icon
															icon='HeroEnvelope'
															className='mx-2'
														/>
													}>
													<Input
														id='email'
														name='email'
														onChange={formik.handleChange}
														value={formik.values.email}
														autoComplete='email'
													/>
												</FieldWrap>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='first_name'>Nombre</Label>
												<Input
													id='first_name'
													name='first_name'
													onChange={formik.handleChange}
													value={formik.values.first_name}
													autoComplete='given-name'
													autoCapitalize='words'
												/>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='last_name'>Apellido</Label>
												<Input
													id='last_name'
													name='last_name'
													onChange={formik.handleChange}
													value={formik.values.last_name}
													autoComplete='family-name'
													autoCapitalize='words'
												/>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='fnacimiento'>Fecha de Nacimiento</Label>
												<Input
													type='date'
													id='fnacimiento'
													name='fnacimiento'
													onChange={formik.handleChange}
													value={formik.values.fnacimiento}
													autoComplete='bday'
												/>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='sexo'>Sexo</Label>
												<RadioGroup isInline >
													<Radio
														label='Femenino'
														name='sexo'
														value='F'
														selectedValue={formik.values?.sexo == 'F' ? formik.values?.sexo : ''}
														onChange={formik.handleChange}
													/>
													<Radio
														label='Masculino'
														name='sexo'
														value='M'
														selectedValue={formik.values?.sexo == 'M' ? formik.values?.sexo : ''}
														onChange={formik.handleChange}
													/>
													<Radio
														label='No Especificado'
														name='sexo'
														value='O'
														selectedValue={formik.values?.sexo == 'O' ? formik.values?.sexo : ''}
														onChange={formik.handleChange}
													/>
													{/* {((i) => (
														<Radio
															key={i}
															label={i}
															name='sexo'
															value={i == perfilData?.sexo ? perfilData?.sexo : ''}
															selectedValue={i == perfilData?.sexo ? perfilData?.sexo : ''}
															onChange={formik.handleChange}
														/>
													))} */}
												</RadioGroup>
												
											</div>
											<div className='col-span-12 lg:col-span-12'>
												<Label htmlFor='direccion'>Dirección</Label>
												<Input
													id='direccion'
													name='direccion'
													onChange={formik.handleChange}
													value={formik.values.direccion}
													autoComplete='direccion'
												/>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='comuna'>Comuna</Label>
												<Input
													id='comuna'
													name='comuna'
													onChange={formik.handleChange}
													value={formik.values.comuna}
													autoComplete='comuna'
												/>
											</div>
											
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='celular'>Celular</Label>
												<Input
													id='celular'
													name='celular'
													onChange={formik.handleChange}
													value={formik.values.celular}
													autoComplete='celular'
												/>
											</div>

											{/* <div className='col-span-12'>
												<Label htmlFor='position'>Role</Label>
												<FieldWrap
													firstSuffix={
														<Icon
															icon='HeroShieldCheck'
															className='mx-2'
														/>
													}
													lastSuffix={
														<Icon
															icon='HeroChevronDown'
															className='mx-2'
														/>
													}>
													<Select
														name='role'
														// onChange={formik.handleChange}
														// value={formik.values.role}
														placeholder='Select role'>
														{rolesDb.map((role) => (
															<option key={role.id} value={role.id}>
																{role.name}
															</option>
														))}
													</Select>
												</FieldWrap>
											</div>
											<div className='col-span-12'>
												<Label htmlFor='position'>Position</Label>

												<FieldWrap
													firstSuffix={
														<Icon
															icon='HeroBriefcase'
															className='mx-2'
														/>
													}>
													<Input
														id='position'
														name='position'
														// onChange={formik.handleChange}
														// value={formik.values.position}
													/>
												</FieldWrap>
											</div> */}
											{/* <div className='col-span-12'>
												<Label htmlFor='bio'>Bio</Label>
												<RichText
													id='bio'
													// value={formik.values.bio}
													handleChange={(event) => {
														formik
															.setFieldValue('bio', event)
															.then(() => {})
															.catch(() => {});
													}}
												/>
											</div> */}
										</div>
									</>
								)}
								{activeTab === TAB.PERSONALIZACION && (
									<>
										<div className='text-4xl font-semibold'>Personalización</div>
										<div className='grid grid-cols-12 gap-4'>
											<div className='col-span-12'>
												<Label htmlFor='estilo'>Tema</Label>
												<RadioGroup isInline>
													<Radio
														name='estilo'
														value='dark'
														selectedValue={formik.values.estilo}
														onChange={formik.handleChange}
													>
														<div className='relative'>
															<div className='flex h-2 w-full items-center gap-1 bg-zinc-500 p-1'>
																<div className='h-1 w-1 rounded-full bg-red-500' />
																<div className='h-1 w-1 rounded-full bg-amber-500' />
																<div className='h-1 w-1 rounded-full bg-emerald-500' />
															</div>
															<div className='flex aspect-video w-56 bg-zinc-950'>
																<div className='h-full w-1/4 border-e border-zinc-800/50 bg-zinc-900/75' />
																<div className='h-full w-3/4'>
																	<div className='h-4 w-full border-b border-zinc-800/50 bg-zinc-900/75' />
																	<div />
																</div>
															</div>
														</div>
													</Radio>
													<Radio
														name='estilo'
														value='light'
														selectedValue={formik.values.estilo}
														onChange={formik.handleChange}
														>
														<div className='relative'>
															<div className='flex h-2 w-full items-center gap-1 bg-zinc-500 p-1'>
																<div className='h-1 w-1 rounded-full bg-red-500' />
																<div className='h-1 w-1 rounded-full bg-amber-500' />
																<div className='h-1 w-1 rounded-full bg-emerald-500' />
															</div>
															<div className='flex aspect-video w-56 bg-zinc-100'>
																<div className='h-full w-1/4 border-e border-zinc-300/25 bg-white' />
																<div className='h-full w-3/4'>
																	<div className='h-4 w-full border-b border-zinc-300/25 bg-white' />
																	<div />
																</div>
															</div>
														</div>
													</Radio>
												</RadioGroup>
											</div>
											<div className="col-span-12">
												<Label htmlFor='anio'>Año</Label>
												<SelectReact
													placeholder="Seleccione un año"
													options={options}
													id='anio'
													name='anio'
													value={{value: formik.values.anio, label: formik.values.anio}}
													onChange={(value: any) => formik.setFieldValue('anio', value.value)}
												/>
											</div>
										</div>
									</>
								)}
								{activeTab === TAB.PERMISOS && (
									<>
									<div className='text-4xl font-semibold'>Permisos</div>
									<div className='grid grid-cols-12 gap-4'>
										<div className="col-span-12">
											<Label htmlFor='iot_balanza_recepcionmp'>Balanza Recepcion MP</Label>
											<SelectReact
												placeholder="Balanza Recepcion MP"
												options={options_balanza_recepcion}
												id='iot_balanza_recepcionmp'
												name='iot_balanza_recepcionmp'
												value={{value: formik.values.iot_balanza_recepcionmp, label: formik.values.iot_balanza_recepcionmp}}
												onChange={(value: any) => formik.setFieldValue('iot_balanza_recepcionmp', value.value)}
											/>
										</div>
									</div>
								</>
								)}
							</div>
						</div>
					</CardBody>
					{/* <CardFooter>
						<CardFooterChild>
							<div className='flex items-center gap-2'>
								<Icon icon='HeroDocumentCheck' size='text-2xl' />
								<span className='text-zinc-500'>Last saved:</span>
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
					</CardFooter> */}
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default ProfilePage;
