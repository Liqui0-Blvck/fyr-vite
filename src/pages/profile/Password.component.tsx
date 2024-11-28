import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../store/hook'
import { useFormik } from 'formik'
import Label from '../../components/form/Label'
import FieldWrap from '../../components/form/FieldWrap'
import Icon from '../../components/icon/Icon'
import Input from '../../components/form/Input'
import Validation from '../../components/form/Validation'
import { passwordValidationSchema } from '../../utils/validationSchemas.util'
import Button from '../../components/ui/Button'
import useSaveBtn from '../../hooks/useSaveBtn'
import { changePassword } from '../../store/slices/auth/authSlices'
import toast from 'react-hot-toast'
import { useKeyPress } from 'react-use'


const PasswordComponent = () => {
  const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);
	const [passwordNewShowStatus, setPasswordNewShowStatus] = useState<boolean>(false);
	const [passwordNewConfShowStatus, setPasswordNewConfShowStatus] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  const isPressed = useKeyPress('Enter')

	useEffect(() => {
		if (isPressed[0] && !isSaving) {
			formik.handleSubmit()
		} 
	}, [isPressed])

  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });



  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      dispatch(changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })).unwrap()
      .then(() => {
        toast.success('Contraseña actualizada correctamente');
      })
      .catch(() => {
        toast.error('Contraseña actual incorrecta') 
      }).finally(() => {
        formik.resetForm();
        setPasswordShowStatus(false);
        setPasswordNewShowStatus(false);
        setPasswordNewConfShowStatus(false);
      })
    }
  })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPasswordStrength({
      minLength: newPassword.length >= 8,
      upperCase: /[A-Z]/.test(newPassword),
      lowerCase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      specialChar: /[\W_]/.test(newPassword),
    });
  };

  const { saveBtnText, saveBtnColor, saveBtnDisable } = useSaveBtn({
		isNewItem: false,
		isSaving,
		isDirty: formik.dirty,
	});

  return (
  <div className='flex flex-col gap-10 h-ful'>
    <section className='w-full h-full'>
      <div className='text-4xl font-semibold mb-5'>Password</div>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-12'>
          <Label htmlFor='oldPassword'>Contraseña Anterior</Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.oldPassword}
            invalidFeedback={formik.errors.oldPassword}
            >
            <FieldWrap
              lastSuffix={
                <Icon
                  className='mx-2'
                  icon={
                    passwordShowStatus
                      ? 'HeroEyeSlash'
                      : 'HeroEye'
                  }
                  onClick={() => {
                    setPasswordShowStatus(
                      !passwordShowStatus,
                    );
                  }}
                />
              }>
              <Input
                type={
                  passwordShowStatus ? 'text' : 'password'
                }
                id='oldPassword'
                name='oldPassword'
                onChange={formik.handleChange}
                value={formik.values.oldPassword}
                autoComplete='current-password'
              />
            </FieldWrap>
          </Validation>
        </div>
        <div className='col-span-12'>
          <Label htmlFor='newPassword'>Contraseña nueva</Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.newPassword}
            invalidFeedback={formik.errors.newPassword}>
              <FieldWrap
              lastSuffix={
                <Icon
                  className='mx-2'
                  icon={
                    passwordNewShowStatus
                      ? 'HeroEyeSlash'
                      : 'HeroEye'
                  }
                  onClick={() => {
                    setPasswordNewShowStatus(
                      !passwordNewShowStatus,
                    );
                  }}
                />
              }>
              <Input
                type={
                  passwordNewShowStatus
                    ? 'text'
                    : 'password'
                }
                id='newPassword'
                name='newPassword'
                onChange={(e) => {
                  formik.handleChange(e);
                  handlePasswordChange(e);
                }}
                value={formik.values.newPassword}
                autoComplete='new-password'
              />
            </FieldWrap>
          </Validation>
           {
            formik.values.newPassword && (
              <div className='mt-2 flex'>
                <ul className='py-4 px-2 rounded-md border border-zinc-800'>
                  <li className={passwordStrength.minLength ? "text-green-700" : "text-red-500"}>
                    Longitud mínima de 8 caracteres
                  </li>
                  <li className={passwordStrength.upperCase ? "text-green-700" : "text-red-500"}>
                    Al menos una letra mayúscula
                  </li>
                  <li className={passwordStrength.lowerCase ? "text-green-700" : "text-red-500"}>
                    Al menos una letra minúscula
                  </li>
                  <li className={passwordStrength.number ? "text-green-700" : "text-red-500"}>
                    Al menos un número
                  </li>
                  <li className={passwordStrength.specialChar ? "text-green-700" : "text-red-500"}>
                    Al menos un carácter especial
                  </li>
                </ul>
              </div>
            )
           }
        </div>
        <div className='col-span-12'>
          <Label htmlFor='newPasswordConfirmation'>
            Repita la contraseña nueva
          </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.newPasswordConfirmation}
            invalidFeedback={formik.errors.newPasswordConfirmation}>
            <FieldWrap
              lastSuffix={
                <Icon
                  className='mx-2'
                  icon={
                    passwordNewConfShowStatus
                      ? 'HeroEyeSlash'
                      : 'HeroEye'
                  }
                  onClick={() => {
                    setPasswordNewConfShowStatus(
                      !passwordNewConfShowStatus,
                    );
                  }}
                />
              }>
              <Input
                type={
                  passwordNewConfShowStatus
                    ? 'text'
                    : 'password'
                }
                id='newPasswordConfirmation'
                name='newPasswordConfirmation'
                onChange={formik.handleChange}
                value={
                  formik.values.newPasswordConfirmation
                }
                autoComplete='new-password'
              />
            </FieldWrap>

          </Validation>
        </div>
      </div>
    </section>
    <section className='grid grid-cols-12'>
      <Button
        className='col-span-12 lg:col-span-3 lg:col-start-10'
        icon='HeroServer'
        variant='solid'
        color={saveBtnColor}
        isDisable={saveBtnDisable}
        onClick={() => formik.handleSubmit()}>
        {saveBtnText}
      </Button>
    </section>
  </div>
  )
}

export default PasswordComponent
