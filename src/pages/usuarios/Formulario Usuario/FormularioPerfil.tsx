import React, { useState } from 'react'
import { useAuth } from '../../../context/authContext'
import { useFormik } from 'formik'
import useDarkMode from '../../../hooks/useDarkMode'
import Label from '../../../components/form/Label'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import { Input } from 'antd'
import SelectReact from '../../../components/form/SelectReact'
import Textarea from '../../../components/form/Textarea'

const FormularioPerfil = () => {
  const { authTokens, validate, perfilData } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  const formik = useFormik({
    initialValues: {
      sexo: null,
      direccion: "",
      comuna: "",
      celular: "",
      fnacimiento: null,
      valoracion: null,
    },
    onSubmit: async (values: any) => {

    }
  })

  return (
    <form
    onSubmit={formik.handleSubmit}
    className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
    gap-y-5 mt-10 ${ isDarkTheme ? 'bg-zinc-700' : 'bg-zinc-200'} relative px-5 py-6
    rounded-md`}
  >
    {/* <div className='md:col-span-2 md:flex-col items-center'>
      <Label htmlFor='patente'>Patente: </Label>

      <Validation
        isValid={formik.isValid}
        isTouched={formik.touched.patente ? true : undefined}
        invalidFeedback={formik.errors.patente ? String(formik.errors.patente) : undefined}
        validFeedback='Good'>
        <FieldWrap>
        <Input
          type='text'
          name='patente'
          onChange={formik.handleChange}
          className='py-3 text-black'
          value={formik.values.patente}
        />
        </FieldWrap>
      </Validation>
    </div> */}

    <div className='md:col-span-2 md:col-start-3 md:flex-col flex'>
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

    <div className='md:row-start-2 md:col-span-2  md:flex-col flex'>
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

    <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col flex'>
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

export default FormularioPerfil