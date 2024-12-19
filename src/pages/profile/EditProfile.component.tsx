import React, { useState } from 'react'
import Avatar from '../../components/Avatar';
import Label from '../../components/form/Label';
import Input from '../../components/form/Input';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Radio, { RadioGroup } from '../../components/form/Radio';
import useSaveBtn from '../../hooks/useSaveBtn';
import Select from '../../components/form/Select';
import { RootState } from '../../store/rootReducer';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import Validation from '../../components/form/Validation';
import Button from '../../components/ui/Button';
import { useFormik } from 'formik';
import { updateProfileData } from '../../store/slices/auth/userSlice';
import toast from 'react-hot-toast';
import { validationEditProfileSchema } from '../../utils/validationSchemas.util';

interface EditProfileProps {
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

const rolesDb = [
  { id: 'admin', name: 'Administrador' }, // Persona encargada de supervisar y gestionar todo.
  { id: 'manager', name: 'Jefe de Área' }, // Responsable de un área o equipo específico.
  { id: 'executive', name: 'Ejecutivo' }, // Usuario que realiza las interacciones con prospectos y clientes.
  { id: 'guest', name: 'Invitado' }, // Usuario con acceso limitado para visualización básica.
]


const EditProfile = () => {
  const { user } = useAppSelector((state: RootState) => state.auth.user)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const formik = useFormik({
    enableReinitialize: true,
		initialValues: {
			first_name: user?.first_name || '',
      second_name: user?.second_name || '',
      last_name: user?.last_name || '',
      second_last_name: user?.second_last_name || '',
      email: user?.email || '',
      phone_number: user?.phoneNumber || '',
      birth: user?.birth || '',
      gender: user?.gender || '',
      role: user?.role || '',
      photoURL: user?.photoURL || '',
			position: user?.position || '',
    },
    validationSchema: validationEditProfileSchema,
    onSubmit: async (values) => {
      await dispatch(updateProfileData({
        first_name: values.first_name,
        second_name: values.second_name,
        last_name: values.last_name,
        second_last_name: values.second_last_name,
        email: values.email,
        phoneNumber: values.phone_number,
        birth: values.birth,
        gender: values.gender,
        role: values.role,
        position: values.position
      })).unwrap().then(() => {
        toast.success('Perfil actualizado correctamente')
      })
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (file) {
      const url = URL.createObjectURL(file);
      formik.setFieldValue('photoURL', url);
    }
  }

  const { saveBtnText, saveBtnColor, saveBtnDisable } = useSaveBtn({
		isNewItem: false,
		isSaving,
		isDirty: formik.dirty,
	});

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
      {/* Nombre */}
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='first_name'>Nombre</Label>
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.first_name}
          invalidFeedback={formik.errors.first_name}
        >
          <FieldWrap firstSuffix={<Icon icon='HeroUser' className='mx-2' />}>
            <Input
              id='first_name'
              name='first_name'
              onChange={formik.handleChange}
              value={formik.values.first_name}
              />
          </FieldWrap>
        </Validation>
      </div>

      {/* Segundo Nombre */}
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='second_name'>Segundo nombre</Label>
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.second_name}
          invalidFeedback={formik.errors.second_name}
        >
          <FieldWrap firstSuffix={<Icon icon='HeroUser' className='mx-2' />}>
            <Input
              id='second_name'
              name='second_name'
              onChange={formik.handleChange}
              value={formik.values.second_name}
              />
          </FieldWrap>
        </Validation>
      </div>

      {/* Apellido Paterno */}
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='last_name'>Apellido Paterno</Label>
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.last_name}
          invalidFeedback={formik.errors.last_name}
        >
          <FieldWrap firstSuffix={<Icon icon='HeroUser' className='mx-2' />}>
            <Input
              id='last_name'
              name='last_name'
              onChange={formik.handleChange}
              value={formik.values.last_name}
              />
          </FieldWrap>
        </Validation>
      </div>

      {/* Apellido Materno */}
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='second_last_name'>Apellido Materno</Label>
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.second_last_name}
          invalidFeedback={formik.errors.second_last_name}
        >
          <FieldWrap firstSuffix={<Icon icon='HeroUser' className='mx-2' />}>
            <Input
              id='second_last_name'
              name='second_last_name'
              onChange={formik.handleChange}
              value={formik.values.second_last_name}
              />
          </FieldWrap>
        </Validation>
      </div>

      {/* Email */}
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='email'>Email</Label>
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.email}
          invalidFeedback={formik.errors.email}
        >
          <FieldWrap firstSuffix={<Icon icon='HeroEnvelope' className='mx-2' />}>
            <Input
              id='email'
              name='email'
              onChange={formik.handleChange}
              value={formik.values.email}/>
          </FieldWrap>
        </Validation>
      </div>

      {/* Número de celular */}
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='phone_number'>N° Celular</Label>
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.phone_number}
          invalidFeedback={formik.errors.phone_number}
        >
          <FieldWrap firstSuffix={<Icon icon='HeroPhone' className='mx-2' />}>
            <Input
              id='phone_number'
              name='phone_number'
              onChange={formik.handleChange}
              value={formik.values.phone_number}/>
          </FieldWrap>
        </Validation>
      </div>

      {/* Fecha de Nacimiento */}
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='birth'>Fecha Nacimiento</Label>
        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.birth}
          invalidFeedback={formik.errors.birth}
        >
          <Input
            type='date'
            id='birth'
            name='birth'
            onChange={formik.handleChange}
            value={formik.values.birth}
            />
        </Validation>
      </div>

      {/* Género */}
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='gender'>Género</Label>
        <RadioGroup isInline>
          {['Masculino', 'Femenino'].map((i) => (
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

      {/* Rol */}
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='position'>Rol</Label>
        <FieldWrap
          firstSuffix={<Icon icon='HeroShieldCheck' className='mx-2' />}
          lastSuffix={<Icon icon='HeroChevronDown' className='mx-2' />}
        >
          <Select
            name='role'
            onChange={formik.handleChange}
            value={formik.values.role}
            placeholder='Select role'
          >
            {rolesDb.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Select>
        </FieldWrap>
      </div>

      {/* Position */}
      <div className='col-span-12 lg:col-span-6'>
        <Label htmlFor='position'>Position</Label>
        <FieldWrap firstSuffix={<Icon icon='HeroBriefcase' className='mx-2' />}>
          <Input
            id='position'
            name='position'
            onChange={formik.handleChange}
            value={formik.values.position}
          />
        </FieldWrap>
      </div>

      <Button
        className='col-span-12 lg:col-span-3 lg:col-start-10'
        icon='HeroServer'
        variant='solid'
        color={saveBtnColor}
        isDisable={saveBtnDisable}
        onClick={() => formik.handleSubmit()}>
        {saveBtnText}
      </Button>
    </div>
    
  </>
  )
}

export default EditProfile
