import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { useAuth } from '../../../context/authContext'
import useDarkMode from '../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TComercializador } from '../../../types/registros types/registros.types'

interface IDetalleProps {
  id: number
}

const DetalleComercializador: FC<IDetalleProps> = ({ id }) => {
  const { isDarkTheme } = useDarkMode()

  const { authTokens, validate } = useAuth()
  const { data: comercializador } = useAuthenticatedFetch<TComercializador>(
    authTokens,
    validate,
    `/api/comercializador/${id}`
  )


  return (
    <div
      className={`
      flex flex-col 
      md:grid md:grid-cols-6 gap-x-4 gap-y-8 mt-10 
      relative p-4 ${isDarkTheme ? oneDark : oneLight} rounded-md`}
    >
      <div className='md:col-span-2 md:flex-col items-center'>
        <label htmlFor="nombre">Nombre: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{comercializador?.nombre}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
        <label htmlFor="razon_social">Razón Social: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{comercializador?.razon_social}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
        <label htmlFor="giro">Giro: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{comercializador?.giro}</span>
        </div>
      </div>


      <div className='md:col-span-2 md:row-start-2  md:flex-col items-center'>
        <label htmlFor="direccion">Dirección: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{comercializador?.direccion}</span>
        </div>
      </div>


      <div className='md:col-span-2 md:row-start-2 md:col-start-3 md:flex-col items-center'>
        <label htmlFor="zip_code">Código de Zona (Zip Code): </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{comercializador?.zip_code}</span>
        </div>
      </div>



      <div className='md:col-span-2 md:row-start-2 md:col-start-5 md:flex-col items-center'>
        <label htmlFor="email_comercializador">Email Comercializador: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{comercializador?.email_comercializador}</span>
        </div>
      </div>


    </div>
  )
}

export default DetalleComercializador  
