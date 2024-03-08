import MaxWidthWrapper from '@/componentes/MaxWidthWrapper'
import { useFormik } from 'formik'
import { Input, Select } from 'antd'
import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useAuthenticatePost } from '@/hooks/useAuthenticatedFetch'
import { TIPO_ACOPLADO } from '@/const/constantes'

const { TextArea } = Input

const FormularioRegistroCamiones = ({ modal }) => {
  const { authTokens, validToken } = useAuth()
  const { usePostPutDelete } = useAuthenticatePost()
  const formik = useFormik({
    initialValues: {
      patente: "",
      acoplado: false,
      observaciones: ""
    },
    onSubmit: async (values) => {
      try {
        usePostPutDelete(
          authTokens,
          validToken,
          '/api/registros/camiones/',
          JSON.stringify({ ...values }),
          'POST',
          modal(false)
        )
      } catch (error) {
        console.log(error)
      }
    }
  })
  const filterOption = (
    input,
    option,
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <MaxWidthWrapper>
      <form
        onSubmit={formik.handleSubmit}
        className='flex flex-col md:grid md:grid-cols-4 gap-x-3
         gap-y-5 mt-10 border border-gray-200 relative px-5 py-6
         rounded-md'
      >
        <div className='md:col-span-2 md:flex-col items-center'>
          <label htmlFor="patente">Patente: </label>
          <Input
            name='patente'
            onChange={formik.handleChange}
          />
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col flex '>
          <label htmlFor="acoplado">Acoplado: </label>
          <Select
            showSearch
            placeholder="Selecciona una opción"
            optionFilterProp="children"
            onChange={value => formik.setFieldValue('acoplado', value)}
            name='acoplado'
            filterOption={filterOption}
            options={TIPO_ACOPLADO.map((acoplado) => ({
              value: acoplado.values,
              label: acoplado.label
            }))}
          />
        </div>

        <div className='md:row-start-2 md:col-span-4  md:flex-col items-center'>
          <label htmlFor="observaciones">Observaciones: </label>
          <TextArea
            rows={5}
            cols={9}
            name='observaciones'
            onChange={formik.handleChange}
          />
        </div>



        <div className='relative w-full h-20 col-span-4'>
          <button type='submit' className='absolute right-0 border border-gray-800 md:mt-10 md:row-start-2 bg-[#224871] hover:bg-[#224871cb] rounded-md text-white p-2 font-semibold'>Registrar Camion</button>
        </div>
      </form>
    </MaxWidthWrapper>
  )
}

export default FormularioRegistroCamiones
