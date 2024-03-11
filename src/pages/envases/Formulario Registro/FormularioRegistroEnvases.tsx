import { useFormik } from 'formik'
import Input from '../../../components/form/Input';
import React, { Dispatch, FC, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/authContext'
import useDarkMode from '../../../hooks/useDarkMode';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Textarea from '../../../components/form/Textarea';


interface IFormEnvasesProps {
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroEnvases : FC<IFormEnvasesProps> = ({ refresh, setOpen }) => {
  const { authTokens, validate } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
	const { isDarkTheme } = useDarkMode();

  const formik = useFormik({
    initialValues: {
      nombre: "",
      peso: null,
      descripcion: ""
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/envasesmp/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: JSON.stringify({
            ...values
          })
        })
        if (res.ok) {
          toast.success("El envase fue registrado exitosamente!!")
          refresh(true)
          setOpen(false)

        } else {
          toast.error("No se pudo registrar el envase, volver a intentar")
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
          md:grid md:grid-cols-6 gap-x-4 gap-y-8 mt-10 
          relative p-4 ${ isDarkTheme ? oneDark : oneLight} rounded-md`}
        >
        <div className='md:col-span-3 md:flex-col items-center'>
          <label htmlFor="nombre">Nombre: </label>
          <Input
            type='text'
            name='nombre'
            onChange={formik.handleChange}
            value={formik.values.nombre}
            className='py-2'
          />
        </div>

        <div className='md:col-span-3 md:col-start-4 md:flex-col items-center'>
          <label htmlFor="peso">Peso: </label>
          <Input
            type='number' 
            name='peso'
            onChange={formik.handleChange}
            value={formik.values.peso!}  
            className='py-2'
          />
        </div>

        <div className='md:row-start-2 md:col-span-6 md:flex-col items-center'>
          <label htmlFor="descripcion">Descripción: </label>
          <Textarea 
            name='descripcion'
            onChange={formik.handleChange}
            value={formik.values.descripcion}
            className='py-2'
            rows={6}
          />
        </div>

      

        <div className='md:row-start-4 md:col-start-5 md:col-span-2 relative w-full'>
          <button className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Registrar Envase
          </button>
        </div>
      </form>
  )
}

export default FormularioRegistroEnvases  
