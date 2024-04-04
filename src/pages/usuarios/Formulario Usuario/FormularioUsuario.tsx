import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { useAuth } from '../../../context/authContext'
import { useFormik } from 'formik'
import useDarkMode from '../../../hooks/useDarkMode'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import { Input, Radio } from 'antd'
import SelectReact from '../../../components/form/SelectReact'
import Textarea from '../../../components/form/Textarea'
import { RadioGroup } from '../../../components/form/Radio'



interface IFormUsuarioProps {
  setStep: Dispatch<SetStateAction<number>>
}


const FormularioUsuario: FC<IFormUsuarioProps> = ({ setStep }) => {
  const { authTokens, validate, perfilData } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      password_confirm: "",
      is_active: false,
      is_staff: false,
      is_admin: false
    },
    onSubmit: async (values: any) => {

    }
  })

  const optionsRadio = [
    { id: 1, value: true, label: 'Si' },
    { id: 2, value: false, label: 'No' }
  ];

  return (
    <form
    onSubmit={formik.handleSubmit}
    className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
    gap-y-5 mt-10 ${ isDarkTheme ? 'bg-zinc-700' : 'bg-zinc-200'} relative px-5 py-6
    rounded-md`}
  >
    <div className='md:col-span-2 md:flex-col items-center'>
      <Label htmlFor='email'>Email: </Label>

      <Validation
        isValid={formik.isValid}
        isTouched={formik.touched.email ? true : undefined}
        invalidFeedback={formik.errors.email ? String(formik.errors.email) : undefined}
        validFeedback='Good'>
        <FieldWrap>
        <Input
          type='text'
          name='email'
          onChange={formik.handleChange}
          className='py-3 text-black'
          value={formik.values.email}
        />
        </FieldWrap>
      </Validation>
    </div>

    <div className='md:col-span-2 md:col-start-3 md:flex-col flex'>
      <Label htmlFor='first_name'>Nombre: </Label>

      <Validation
        isValid={formik.isValid}
        isTouched={formik.touched.first_name ? true : undefined}
        invalidFeedback={formik.errors.first_name ? String(formik.errors.first_name) : undefined}
        validFeedback='Good'>
        <FieldWrap>
          <Input
            type='text'
            name='first_name'
            onChange={formik.handleChange}
            className='py-3 text-black'
            value={formik.values.first_name}
          />
        </FieldWrap>
      </Validation>

    </div>

    <div className='md:row-start-2 md:col-span-2  md:flex-col flex'>
      <Label htmlFor='last_name'>Apellido: </Label>

      <Validation
        isValid={formik.isValid}
        isTouched={formik.touched.last_name ? true : undefined}
        invalidFeedback={formik.errors.last_name ? String(formik.errors.last_name) : undefined}
        validFeedback='Good'>
        <FieldWrap>
          <Input
            type='text'
            name='last_name'
            onChange={formik.handleChange}
            className='py-3 text-black'
            value={formik.values.last_name}
          />
        </FieldWrap>
      </Validation>

    </div>

    <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col flex'>
      <Label htmlFor='acoplado'>Acoplado: </Label>

      <RadioGroup isInline>
        {optionsRadio.map(({ id, value, label }) => {
          return (
            <Radio
              key={id}
              label={label}
              name='mezcla_variedades'
              value={label} // Asignar el valor correcto de cada botón de radio
              checked={formik.values.mezcla_variedades === value} // Comprobar si este botón de radio está seleccionado
              onChange={(e) => {
                formik.setFieldValue('mezcla_variedades', e.target.value === 'Si' ? true : false) // Actualizar el valor de mezcla_variedades en el estado de formik
              }}
              selectedValue={undefined} />
          );
        })}
      </RadioGroup>

    </div>

    <div className='md:row-start-3 md:col-span-2  md:flex-col flex'>
      <Label htmlFor='acoplado'>Acoplado: </Label>

      <Validation
        isValid={formik.isValid}
        isTouched={formik.touched.acoplado ? true : undefined}
        invalidFeedback={formik.errors.acoplado ? String(formik.errors.acoplado) : undefined}
        validFeedback='Good'>
        <FieldWrap>
          <SelectReact
            // options={optionsAcoplado}
            id='acoplado'
            placeholder='Selecciona un opción'
            name='acoplado'
            className='h-14 py-2'
            onChange={(value: any) => {
              formik.setFieldValue('acoplado', value.value)
            }}
          />
        </FieldWrap>
      </Validation>

    </div>

    <div className='md:row-start-4 md:col-span-2 md:flex-col flex'>
      <Label htmlFor='acoplado'>Acoplado: </Label>

      <Validation
        isValid={formik.isValid}
        isTouched={formik.touched.acoplado ? true : undefined}
        invalidFeedback={formik.errors.acoplado ? String(formik.errors.acoplado) : undefined}
        validFeedback='Good'>
        <FieldWrap>
          <SelectReact
            // options={optionsAcoplado}
            id='acoplado'
            placeholder='Selecciona un opción'
            name='acoplado'
            className='h-14 py-2'
            onChange={(value: any) => {
              formik.setFieldValue('acoplado', value.value)
            }}
          />
        </FieldWrap>
      </Validation>

    </div>

    <div className='md:row-start-5 md:col-span-2 md:flex-col flex'>
      <Label htmlFor='acoplado'>Acoplado: </Label>

      <Validation
        isValid={formik.isValid}
        isTouched={formik.touched.acoplado ? true : undefined}
        invalidFeedback={formik.errors.acoplado ? String(formik.errors.acoplado) : undefined}
        validFeedback='Good'>
        <FieldWrap>
          <SelectReact
            // options={optionsAcoplado}
            id='acoplado'
            placeholder='Selecciona un opción'
            name='acoplado'
            className='h-14 py-2'
            onChange={(value: any) => {
              formik.setFieldValue('acoplado', value.value)
            }}
          />
        </FieldWrap>
      </Validation>

    </div>

    {/* <div className='md:row-start-3 md:col-span-4 md:col-start-3 md:flex-col items-center'>
      <Label htmlFor='observaciones'>Observaciones: </Label>

      <Validation
        isValid={formik.isValid}
        isTouched={formik.touched.observaciones ? true : undefined}
        invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
        validFeedback='Good'>
        <FieldWrap>
          <Textarea
            rows={5}
            cols={9}
            name='observaciones'
            onChange={formik.handleChange}
            value={formik.values.observaciones}
          />
        </FieldWrap>
      </Validation>
    </div> */}



    <div className='relative w-full h-20 col-span-4'>
     <button className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
        Registrar Camión
      </button>
    </div>
  </form>
  )
}

export default FormularioUsuario