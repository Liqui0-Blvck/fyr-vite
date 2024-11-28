import React, { FC, useState } from 'react'
import { FormikProps, useFormik } from "formik";
import Avatar from '../../components/Avatar';
import { useAppSelector } from '../../store';
import Label from '../../components/form/Label';
import Input from '../../components/form/Input';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Radio, { RadioGroup } from '../../components/form/Radio';
import useSaveBtn from '../../hooks/useSaveBtn';

interface SectionProps {
  formik: any
}

interface FormValues {
  first_name: string;
  second_name: string;
  last_name: string;
  second_last_name: string;
  email: string;
  phone_number: string;
  birth: string
  gender: string
  role: string
  photoURL: string
}

const EditProfile: FC<SectionProps> = ({ formik }) => {
  const { user } = useAppSelector((state) => state.auth.session)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url)
      formik.setFieldValue('photoURL', url);
    }
  };

  return (
  <>
    <div className='text-4xl font-semibold'>Editar Perfil</div>
    <div className='flex w-full gap-4'>
      <div className='flex-shrink-0'>
        <Avatar
          src={formik.values.photoURL ? formik.values.photoURL : ''}
          className='!w-24'
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          name={`${user?.displayName}`}
        />
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
              onChange={(e) => {
                formik.handleChange('photoURL')
                handleFileChange(e)
              }}
            />
          </div>
        </div>
      </div>
    </div>
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='first_name'>Nombre</Label>
        <FieldWrap
          firstSuffix={
            <Icon icon='HeroUser' className='mx-2' />
          }>
          <Input
            id='first_name'
            name='first_name'
            onChange={formik.handleChange}
            value={formik.values.first_name}
            autoComplete='first_name'
          />
        </FieldWrap>
      </div>

      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='second_name'>Segundo nombre</Label>
        <FieldWrap
          firstSuffix={
            <Icon icon='HeroUser' className='mx-2' />
          }>
          <Input
            id='second_name'
            name='second_name'
            onChange={formik.handleChange}
            value={formik.values.second_name}
            autoComplete='second_name'
          />
        </FieldWrap>
      </div>

      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='last_name'>Apellido Paterno</Label>
        <FieldWrap
          firstSuffix={
            <Icon icon='HeroUser' className='mx-2' />
          }>
          <Input
            id='last_name'
            name='last_name'
            onChange={formik.handleChange}
            value={formik.values.last_name}
            autoComplete='last_name'
          />
        </FieldWrap>
      </div>

      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='second_last_name'>Apellido Paterno</Label>
        <FieldWrap
          firstSuffix={
            <Icon icon='HeroUser' className='mx-2' />
          }>
          <Input
            id='second_last_name'
            name='second_last_name'
            onChange={formik.handleChange}
            value={formik.values.second_last_name}
            autoComplete='second_last_name'
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

      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='phone_number'>N° Celular</Label>
        <FieldWrap
          firstSuffix={
            <Icon
              icon='HeroPhone'
              className='mx-2'
            />
          }>
          <Input
            id='phone_number'
            name='phone_number'
            onChange={formik.handleChange}
            value={formik.values.phone_number!}
            autoComplete='phone_number'
          />
        </FieldWrap>
      </div>

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
