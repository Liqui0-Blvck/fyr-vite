import MaxWidthWrapper from '@/componentes/MaxWidthWrapper'
import { useFormik } from 'formik'
import { Input } from 'antd'
import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const FormularioRegistroChoferes = () => {
  const base_url = import.meta.env.VITE_BASE_URL
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
          navigate('/app/lista-conductores')

        } else {
          toast.error("No se pudo registrar el camión volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  return (
    <MaxWidthWrapper>
      <form 
        onSubmit={formik.handleSubmit}
        className='flex flex-col 
          md:grid md:grid-cols-4 gap-x-4 gap-y-8 mt-10 
          relative p-4 border border-gray-200 rounded-md'
        >
        <div className='md:col-span-2 md:flex-col items-center'>
          <label htmlFor="nombre">Nombre: </label>
          <Input 
            name='nombre'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="apellido">Apellido: </label>
          <Input 
            name='apellido'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
          <label htmlFor="rut">Rut: </label>
          <Input 
            name='rut'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        <div className='md:col-span-2 md:col-start-3 md:row-start-2 md:flex-col items-center'>
          <label htmlFor="telefono">Contacto: </label>
          <Input 
            name='telefono'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        <div className='relative w-full h-12 col-span-6 '>
          <button className='absolute bottom-0 right-5 md:mt-10 md:row-start-2 bg-[#1693A7] hover:bg-[#1694a7d0] rounded-md text-white p-2'>Registrar Conductor</button>
        </div>
      </form>
    </MaxWidthWrapper>
  )
}

export default FormularioRegistroChoferes
