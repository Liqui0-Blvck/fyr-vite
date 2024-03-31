import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import toast from 'react-hot-toast'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { TIPO_ACOPLADO } from '../../../constants/select.constanst'
import Textarea from '../../../components/form/Textarea'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TCamion, TEnvases } from '../../../types/registros types/registros.types'


const DetalleEnvaseMP = ({ data }: { data: TEnvases }) => {
  const { isDarkTheme } = useDarkMode();
  const { authTokens, validate } = useAuth()
 
  console.log(data)

  return (  
    <div
      className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
        gap-y-5 mt-10 ${isDarkTheme ? oneDark : oneLight} relative px-5 py-6
        rounded-md`}
    >
      <div className='md:col-span-2 md:flex-col items-center'>
        <label htmlFor="nombre">Nombre: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{data?.nombre}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:flex-col md:cols-start-2 items-center'>
        <label htmlFor="peso">Peso: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{data?.peso}</span>
        </div>
      </div>

      <div className='md:col-span-4 md:flex-col md:cols-start-2 items-center'>
        <label htmlFor="descripcion">Descripción: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex h-32 rounded-md`}>
          <span>{data?.descripcion}</span>
        </div>
      </div>
    </div>

  )
}

export default DetalleEnvaseMP
