import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import React, { Dispatch, FC, SetStateAction, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useDarkMode from '../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TConductor } from '../../../types/registros types/registros.types'

interface IDetalleConductor {
  id: number
}

const DetalleConductor: FC<IDetalleConductor> = ({ id }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode()
  const { data: conductor } = useAuthenticatedFetch<TConductor>(
    authTokens,
    validate,
    `/api/registros/choferes/${id}`
  )

  return (
    <div
      className={`
          flex flex-col 
          md:grid md:grid-cols-4 gap-x-4 gap-y-8 mt-10 
          relative p-4 ${isDarkTheme ? oneDark : oneLight} rounded-md`}
    >
      <div className='md:col-span-2 md:flex-col items-center'>
        <label htmlFor="nombre">Nombre: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{conductor?.nombre}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
        <label htmlFor="apellido">Apellido: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{conductor?.apellido}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
        <label htmlFor="rut">Rut: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{conductor?.rut}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:col-start-3 md:row-start-2 md:flex-col items-center'>
        <label htmlFor="telefono">Contacto: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{conductor?.telefono}</span>
        </div>
      </div>
    </div>
  )
}

export default DetalleConductor
