import React, { FC } from 'react'
import { FormikProps } from "formik";
import Avatar from '../../components/Avatar';
import { useAppSelector } from '../../store';
import Label from '../../components/form/Label';
import Input from '../../components/form/Input';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Radio, { RadioGroup } from '../../components/form/Radio';

interface SectionProps {
  formik: FormikProps<any>;
}

const EditProfile: FC<SectionProps> = ({ formik }) => {
  const { user } = useAppSelector((state) => state.auth.session)

  return (
  <>
    <div className='text-4xl font-semibold'>Editar Perfil</div>
    <div className='flex w-full gap-4'>
      <div className='flex-shrink-0'>
        <Avatar
          src={user?.photoURL ? user.photoURL : ''}
          className='!w-24'
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          name={`${user?.displayName}`}
        />
        <div>

        </div>
      </div>
      <div className='flex grow items-center'>
        <div>
          <div className='w-full'>
            <Label
              htmlFor='fileUpload'
              className=''
              description='At least 800x800 px recommended. JPG or PNG and GIF is allowed'>
              Sube tu foto de perfil
            </Label>
            <Input
              id='fileUpload'
              name='fileUpload'
              type='file'
              onChange={formik.handleChange}
              value={formik.values.fileUpload}
            />
          </div>
        </div>
      </div>
    </div>
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='username'>Nombre</Label>
        <FieldWrap
          firstSuffix={
            <Icon icon='HeroUser' className='mx-2' />
          }>
          <Input
            id='username'
            name='username'
            onChange={formik.handleChange}
            value={formik.values.username!}
            autoComplete='username'
          />
        </FieldWrap>
      </div>
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='email'>Email</Label>
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
            value={formik.values.email!}
            autoComplete='email'
          />
        </FieldWrap>
      </div>
      {/* <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='firstName'>First Name</Label>
        <Input
          id='firstName'
          name='firstName'
          onChange={formik.handleChange}
          value={formik.values.username}
          autoComplete='given-name'
          autoCapitalize='words'
        />
      </div> */}
      {/* <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='lastName'>Last Name</Label>
        <Input
          id='lastName'
          name='lastName'
          onChange={formik.handleChange}
          value={formik.values.lastName}
          autoComplete='family-name'
          autoCapitalize='words'
        />
      </div> */}

      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='birth'>Fecha Nacimiento</Label>
        <Input
          type='date'
          id='birth'
          name='birth'
          onChange={formik.handleChange}
          value={formik.values.birth}
          autoComplete='bday'
        />
      </div>
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='gender'>Género</Label>
        <RadioGroup isInline>
          {['Male', 'Female'].map((i) => (
            <Radio
              key={i}
              label={i}
              name='gender'
              value={i}
              selectedValue={formik.values.gender}
              onChange={formik.handleChange}
            />
          ))}
        </RadioGroup>
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
            onChange={formik.handleChange}
            value={formik.values.role}
            placeholder='Select role'>
            {rolesDb.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Select>
        </FieldWrap>
      </div> */}
      {/* <div className='col-span-12'>
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
            onChange={formik.handleChange}
            value={formik.values.position}
          />
        </FieldWrap>
      </div> */}
      {/* <div className='col-span-12'>
        <Label htmlFor='bio'>Bio</Label>
        <RichText
          id='bio'
          value={formik.values.bio}
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
  )
}

export default EditProfile
