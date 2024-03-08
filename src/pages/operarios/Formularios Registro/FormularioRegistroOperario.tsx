import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import React, { Dispatch, FC, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useDarkMode from '../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { ACTIVO, TIPOS_OPERARIO } from '../../../constants/select.constanst'

interface IFormChoferes {
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroOperario : FC<IFormChoferes> = ({ setOpen, refresh }) => {
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode() 
  const navigate = useNavigate()


  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      rut: '',
      tipo_operario: '',
      activo: false,
      etiquetas: 'string',
      pago_x_kilo: null
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/registros/operarios/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...values
          })
        })
        if (res.ok) {
          toast.success("El operario fue registrado exitosamente!!")
          setOpen(false)
          refresh(true)
          navigate('/app/operarios')

        } else {
          toast.error("No se pudo registrar el operario volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const opcionOperario = TIPOS_OPERARIO?.map((operario) => ({
    value: operario.values,
    label: operario.label
  })) ?? []

  const Active = ACTIVO?.map((activo) => ({
    value: activo.values,
    label: activo.label
  })) ?? []

  const optionsOperario: TSelectOptions | [] = opcionOperario
  const optionActive: TSelectOptions | [] = Active

  

  return (
      <form 
        onSubmit={formik.handleSubmit}
        className={`
          flex flex-col 
          md:grid md:grid-cols-6 gap-x-4 gap-y-8 mt-10 
          relative p-4 ${ isDarkTheme ? oneDark : oneLight} rounded-md`}
        >
        <div className='md:col-span-2 md:flex-col items-center'>
          <label htmlFor="nombre">Nombre: </label>
          <Input 
            name='nombre'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.nombre}
          />
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="apellido">Apellido: </label>
          <Input 
            name='apellido'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.apellido}
          />
        </div>

        <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="rut">Rut: </label>
          <Input 
            name='rut'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.rut}
          />
        </div>

        <div className='md:col-span-2 md:col-start-1 md:row-start-2 md:flex-col items-center'>
          <label htmlFor="tipo_operario">Tipo Operario: </label>
          <SelectReact
              options={optionsOperario}
              id='tipo_operario'
              placeholder='Selecciona un opción'
              name='tipo_operario'
              className='h-12'
              onChange={(value: any) => {
                formik.setFieldValue('tipo_operario', value.value)
              }}
            />
        </div>

        <div className='md:col-span-2 md:col-start-3 md:row-start-2 md:flex-col items-center'>
          <label htmlFor="activo">Activo: </label>
          <SelectReact
              options={optionActive}
              id='activo'
              placeholder='Selecciona un opción'
              name='activo'
              className='h-12'
              onChange={(value: any) => {
                formik.setFieldValue('activo', value.value)
              }}
            />
        </div>

        <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="etiquetas">etiquetas: </label>
          <Input 
            name='etiquetas'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.etiquetas}
          />
        </div>

        <div className='md:row-start-3 md:col-span-2 md:col-start-1 md:flex-col items-center'>
          <label htmlFor="pago_x_kilo">Pago por Kg: </label>
          <Input 
            name='pago_x_kilo'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.pago_x_kilo!}
          />
        </div>

        <div className='md:row-start-3 md:col-span-2 md:col-start-5 h-12 w-full mt-7'>
          <button className='w-full h-full bg-[#3B82F6] hover:bg-[#3b83f6c9] rounded-md text-white p-2'>Registrar Conductor</button>
        </div>
      </form>
  )
}

export default FormularioRegistroOperario
