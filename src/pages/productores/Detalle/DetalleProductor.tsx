import { useFormik } from 'formik'
import { Input, Select, Switch } from 'antd'
import React from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
// import { TIPOS_OPERARIO } from '../../const/constantes'
import { urlNumeros } from '../../../services/url_number.js'

interface IProductor {
  id: number,
  rut_productor: string,
  nombre: string,
  telefono: string,
  region: number,
  provincia: number,
  comuna: number,
  direccion: string,
  movil: string,
  pagina_web: string,
  email: string,
  fecha_creacion: string,
  numero_contrato: number,
  usuarios: []
}

const FormularioRegistroProductores = () => {
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate } = useAuth()
  console.log(id)
  const { data: productor } = useAuthenticatedFetch<IProductor>(
    authTokens,
    validate,
    `/api/productores/${id}`
  )

  return (
    <div className='p-10 h-full'>
      <form
        className='flex flex-col 
          md:grid md:grid-cols-6 gap-x-6 gap-y-2
          relative p-2 rounded-md h-full'
      >
        <div className='md:col-span-2 md:flex-col items-center'>
          <label htmlFor="rut_productor">Rut Productor: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md'>
            <span className='px-2 text-lg'>{productor?.rut_productor}</span>
          </div>
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="nombre">Nombre: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md'>
            <span className='px-2 text-lg'>{productor?.nombre}</span>
          </div>
        </div>

        <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="email">Correo: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md'>
            <span className='px-2 text-lg'>{productor?.email}</span>
          </div>
        </div>

        <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
          <label htmlFor="region">Región: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md'>
            <span className='px-2 text-lg'>{productor?.region}</span>
          </div>
        </div>

        <div className='md:col-span-2  md:row-start-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="provincia">Provincia: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md'>
            <span className='px-2 text-lg'>{productor?.provincia}</span>
          </div>
        </div>

        <div className='md:col-span-2 md:row-start-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="comuna">Comuna: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md'>
            <span className='px-2 text-lg'>{productor?.comuna}</span>
          </div>
        </div>

        <div className='md:col-span-2 md:row-start-3  md:flex-col items-center'>
          <label htmlFor="direccion">Dirección: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md'>
            <span className='px-2 text-lg'>{productor?.direccion}</span>
          </div>
        </div>


        <div className='md:col-span-2 md:row-start-3 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="telefono">Telefono Fijo: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md'>
            <span className='px-2 text-lg'>{productor?.telefono}</span>
          </div>
        </div>



        <div className='md:col-span-2 md:row-start-3 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="movil">Telefono Celular: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md'>
            <span className='px-2 text-lg'>{productor?.telefono}</span>
          </div>
        </div>

        <div className='md:col-span-2 md:row-start-4 md:flex-col items-center'>
          <label htmlFor="pagina_web">Página Web: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md p-2'>
            <span className='px-2 text-lg'>{productor?.pagina_web}</span>
          </div>
        </div>

        <div className='md:col-span-2 md:row-start-4 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="numero_contrato">N° Contrato: </label>
          <div className='w-full flex items-center border border-gray-200 h-14 rounded-md p-2'>
            <span className='px-2 text-lg'>{productor?.numero_contrato}</span>
          </div>
        </div>

      </form>
    </div>
  )
}

export default FormularioRegistroProductores  
