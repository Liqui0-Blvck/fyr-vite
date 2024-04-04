import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/authContext';
import Input from '../../components/form/Input';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Validation from '../../components/form/Validation';
import { useAuthenticatedFetch } from '../../hooks/useAxiosFunction';
import { authPages } from '../../config/pages.config';
import ModalRegistro from '../../components/ModalRegistro';
import RecoveryPage from './Recuperacion.page';
import DarkModeSwitcherPart from '../../templates/layouts/Asides/_parts/DarkModeSwitcher.part';

type TValues = {
	username: string;
	password: string;
};

const LoginPage = () => {
	const { onLogin } = useAuth();
	const [touched, setTouched] = useState<boolean>()
	const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false)

	const formik = useFormik({
		initialValues: {
			username: '',
			password: '',
		},
		validate: (values: TValues) => {
			const errors: Partial<TValues> = {};

			if (!values.username) {
				errors.username = 'Requerido';
			}

			if (!values.password) {
				errors.password = 'Requerido';
			}

			return errors;
		},
		onSubmit: (values: TValues) => {
			onLogin(values.username, values.password)
		},
	});

	return (
		<PageWrapper isProtectedRoute={false} className='bg-white dark:bg-inherit' name='Sign In'>
			<div className='container mx-auto flex h-full items-center justify-center'>
				<div className='flex max-w-sm flex-col gap-8'>
					<div className='h-full flex flex-col items-center gap-y-5'>
						<img src="/src/assets/prodalmen_foto.png" alt="" className='h-56 w-full object-cover rounded-md'/>
						<span className='text-2xl font-semibold text-center'>Iniciar Sesión para continuar</span>
					</div>
					<div className='border border-zinc-500/25 dark:border-zinc-500/50' />
					<div>
						<DarkModeSwitcherPart />
					</div>


					<form className='flex flex-col gap-4' noValidate>
						<div
							className={classNames({
								'mb-2': !formik.isValid,
							})}>
							<Validation
								isValid={formik.isValid}
								isTouched={formik.touched.username}
								invalidFeedback={formik.errors.username}
								validFeedback='Good'>
								<FieldWrap
									firstSuffix={<Icon icon='HeroEnvelope' className='mx-2' />}>
									<Input
										dimension='lg'
										id='username'
										autoComplete='username'
										name='username'
										placeholder='Nombre de Usuario'
										value={formik.values.username}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
							</Validation>
						</div>
						<div
							className={classNames({
								'mb-2': !formik.isValid,
							})}>
							<Validation
								isValid={formik.isValid}
								isTouched={formik.touched.password}
								invalidFeedback={formik.errors.password}
								validFeedback='Good'>
								<FieldWrap
									firstSuffix={<Icon icon='HeroKey' className='mx-2' />}
									lastSuffix={
										<Icon
											className='mx-2 cursor-pointer'
											icon={passwordShowStatus ? 'HeroEyeSlash' : 'HeroEye'}
											onClick={() => {
												setPasswordShowStatus(!passwordShowStatus);
											}}
										/>
									}>
									<Input
										dimension='lg'
										type={passwordShowStatus ? 'text' : 'password'}
										autoComplete='current-password'
										id='password'
										name='password'
										placeholder='Contraseña'
										value={formik.values.password}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
							</Validation>
						</div>
						<div>
							<Button

								size='lg'
								variant='solid'
								className='w-full font-semibold'
								onClick={() => {
									formik.handleSubmit()
									setTouched(true)
								}}>
								Ingresar
							</Button>
						</div>
					</form>

					<div>
						<span className='flex gap-2 text-sm'>
							<span className='text-zinc-400 dark:text-zinc-600 text-md'>
								¿Olvido su contraseña?
							</span>
							<ModalRegistro
								title='Restablecimiento de Contraseña'
								open={open}
								setOpen={setOpen}
								size={500}
								textButton='Restablecer contraseña'>
								<RecoveryPage setOpen={setOpen}/>
							</ModalRegistro>
						</span>
					</div>

				</div>
			</div>
		</PageWrapper>
	);
};

export default LoginPage;
