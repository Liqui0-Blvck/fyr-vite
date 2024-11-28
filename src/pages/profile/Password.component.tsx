import React, { FC, useState } from 'react'
import { useAppSelector } from '../../store'
import { FormikProps } from 'formik'
import Label from '../../components/form/Label'
import FieldWrap from '../../components/form/FieldWrap'
import Icon from '../../components/icon/Icon'
import Input from '../../components/form/Input'

interface PasswordProps {
  formik: FormikProps<any>
}

const PasswordComponent: FC<PasswordProps> = ({ formik }) => {
  const { user } = useAppSelector((state) => state.auth.session)
  const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);
	const [passwordNewShowStatus, setPasswordNewShowStatus] = useState<boolean>(false);
	const [passwordNewConfShowStatus, setPasswordNewConfShowStatus] = useState<boolean>(false);

  return (
  <>
    <div className='text-4xl font-semibold'>Password</div>
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-12'>
        <Label htmlFor='oldPassword'>Contraseña Anterior</Label>
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
            value={''}
            autoComplete='current-password'
          />
        </FieldWrap>
      </div>
      <div className='col-span-12'>
        <Label htmlFor='newPassword'>Contraseña nueva</Label>
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
            onChange={formik.handleChange}
            value={formik.values.newPassword}
            autoComplete='new-password'
          />
        </FieldWrap>
      </div>
      <div className='col-span-12'>
        <Label htmlFor='newPasswordConfirmation'>
          Repita la contraseña nueva
        </Label>
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
      </div>
    </div>
  </>
  )
}

export default PasswordComponent
