import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import toast from 'react-hot-toast'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { TIPO_ACOPLADO } from '../../../utils/select.constanst'
import Textarea from '../../../components/form/Textarea'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TCamion, TEnvasePatio, TPatioTechadoEx } from '../../../types/registros types/registros.types'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../services/url_number'
import TablaEnvasesPatio from '../Tabla Bodega/Tabla Envases Patio/TablaEnvasesPatio'


const DetalleCamion = () => {
  const { isDarkTheme } = useDarkMode();
  const { authTokens, validate } = useAuth()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)

  const { data: guia } = useAuthenticatedFetch<TPatioTechadoEx>(
    authTokens,
    validate,
    `/api/patio-techado-ex/${id}`
  )

  const envasesPatio: TEnvasePatio[] = guia?.envases!

  
  

  return (
    <div
      className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
        gap-y-5 mt-10 ${isDarkTheme ? oneDark : oneLight} relative px-5 py-6 h-full
        rounded-md`}
    >
      <div className='w-full md:col-span-4 flex items-center justify-center'>
        <h1>Detalle Guía Patio</h1>
      </div>
      
      <div className='md:row-start-2 md:col-span-2 flex flex-col gap-y-5'>
        <div className='md:col-span-2 md:flex-col items-center'>
          <label htmlFor="rut_productor">Cantidad Envases: </label>
          <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
            <span>{envasesPatio?.length}</span>
          </div>
        </div>

        <div className='md:col-span-2 md:flex-col md:cols-start-2 items-center'>
          <label htmlFor="rut_productor">Estado: </label>
          <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
            <span>{guia?.estado_lote_label}</span>
          </div>
        </div>

        <div className='md:col-span-4 md:flex-col md:cols-start-2 items-center'>
          <label htmlFor="rut_productor">Ubicación: </label>
          <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex h-12 rounded-md`}>
            <span>{guia?.ubicacion_label}</span>
          </div>
        </div>

        <div className='md:col-span-4 md:flex-col md:cols-start-2 items-center'>
          <label htmlFor="rut_productor">Ubicación: </label>
          <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex h-12 rounded-md`}>
            <span>{guia?.procesado ? '100% de envases procesados' : 'Aun no se ha procesado el 100% de envases'}</span>
          </div>
        </div>

      </div>

      <div className='md:row-start-2 md:col-start-3 md:col-span-2'>
        <TablaEnvasesPatio data={envasesPatio}/>
      </div>
    </div>

  )
}

export default DetalleCamion
