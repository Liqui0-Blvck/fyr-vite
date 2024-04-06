import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import React, { Dispatch, FC, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useDarkMode from '../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { ACTIVO, TIPOS_OPERARIO } from '../../../utils/select.constanst'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { useAuth } from '../../../context/authContext'
import { TOperarios } from '../../../types/registros types/registros.types'

interface IDetalleOperario {
  id: number
}

const DetalleOperario: FC<IDetalleOperario> = ({ id }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode()
  const { data: operario } = useAuthenticatedFetch<TOperarios>(
    authTokens,
    validate,
    `/api/registros/operarios/${id}`
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
          <span>{operario?.nombre}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
        <label htmlFor="apellido">Apellido: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{operario?.apellido}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
        <label htmlFor="rut">Rut: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{operario?.rut}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:col-start-1 md:row-start-2 md:flex-col items-center'>
        <label htmlFor="tipo_operario">Tipo Operario: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{operario?.tipo_operario}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:col-start-3 md:row-start-2 md:flex-col items-center'>
        <label htmlFor="activo">Activo: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{operario?.activo ? 'Si' : 'No'}</span>
        </div>
      </div>

      <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
        <label htmlFor="etiquetas">etiquetas: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{operario?.etiquetas}</span>
        </div>
      </div>

      <div className='md:row-start-3 md:col-span-2 md:col-start-1 md:flex-col items-center'>
        <label htmlFor="pago_x_kilo">Pago por Kg: </label>
        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
          <span>{operario?.pago_x_kilo}</span>
        </div>
      </div>
    </div>
  )
}

export default DetalleOperario
