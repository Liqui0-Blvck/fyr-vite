import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import React, { Dispatch, FC, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useDarkMode from '../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface IFormChoferes {
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroChoferes : FC<IFormChoferes> = ({ setOpen, refresh }) => {
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode() 
  const navigate = useNavigate()


  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      rut: "",
      telefono: ""
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/registros/choferes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...values
          })
        })
        if (res.ok) {
          toast.success("El conductor fue registrado exitosamente!!")
          setOpen(false)
          refresh(true)
          navigate('/app/conductores')

        } else {
          toast.error("No se pudo registrar el camión volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  return (
      <form 
        onSubmit={formik.handleSubmit}
        className={`
          flex flex-col 
          md:grid md:grid-cols-4 gap-x-4 gap-y-8 mt-10 
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

        <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
          <label htmlFor="rut">Rut: </label>
          <Input 
            name='rut'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.rut}
          />
        </div>

        <div className='md:col-span-2 md:col-start-3 md:row-start-2 md:flex-col items-center'>
          <label htmlFor="telefono">Contacto: </label>
          <Input 
            name='telefono'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.telefono}
          />
        </div>

        <div className='md:row-start-3 md:col-span-2 md:col-start-3 h-14 w-full   '>
          <button className='w-full h-full bg-[#3B82F6] hover:bg-[#3b83f6c9] rounded-md text-white p-2'>Registrar Conductor</button>
        </div>
      </form>
  )
}

export default FormularioRegistroChoferes
