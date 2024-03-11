import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Dispatch, FC, SetStateAction } from 'react'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { useAuth } from '../../../context/authContext'
import useDarkMode from '../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface IFormComercializadorProps {
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroComercializador: FC<IFormComercializadorProps> = ({ refresh, setOpen }) => {
  const { authTokens } = useAuth()
  const { isDarkTheme } = useDarkMode()
  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()

  
  const formik = useFormik({
    initialValues: {
      nombre: "",
      razon_social: "",
      giro: "",
      direccion: "",
      zip_code: "",
      email_comercializador: ""
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/comercializador/`, {
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
          toast.success("El comercializador fue registrado exitosamente!!")
          refresh(true)
          setOpen(false)
          navigate('/app/comercializadores')

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
      md:grid md:grid-cols-6 gap-x-4 gap-y-8 mt-10 
      relative p-4 ${ isDarkTheme ? oneDark : oneLight} rounded-md`}
      >
      <div className='md:col-span-2 md:flex-col items-center'>
        <label htmlFor="nombre">Nombre: </label>
        <Input
          type='text'
          name='nombre'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.nombre}
        />
      </div>

      <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
        <label htmlFor="razon_social">Razón Social: </label>
        <Input
          type='text' 
          name='razon_social'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.razon_social}
        />
      </div>

      <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
        <label htmlFor="giro">Giro: </label>
        <Input 
          type='text'
          name='giro'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.giro}
        />
      </div>
      
      
      <div className='md:col-span-2 md:row-start-2  md:flex-col items-center'>
        <label htmlFor="direccion">Dirección: </label>
        <Input 
          type='text'
          name='direccion'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.direccion}
        />
      </div>
      

      <div className='md:col-span-2 md:row-start-2 md:col-start-3 md:flex-col items-center'>
        <label htmlFor="zip_code">Código de Zona (Zip Code): </label>
        <Input
          type='text' 
          name='zip_code'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.zip_code}
        />
      </div>

      

      <div className='md:col-span-2 md:row-start-2 md:col-start-5 md:flex-col items-center'>
        <label htmlFor="email_comercializador">Email Comercializador: </label>
        <Input
          type='email' 
          name='email_comercializador'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.email_comercializador}
        />
      </div>


      <div className='md:row-start-3 md:col-start-5 md:col-span-2 relative w-full h-14'>
        <button className='w-full h-full bg-[#3B82F6] hover:bg-[#3b83f6c9] rounded-md text-white py-3'>Registrar Comercializador</button>
      </div>
    </form>

  )
}

export default FormularioRegistroComercializador  
