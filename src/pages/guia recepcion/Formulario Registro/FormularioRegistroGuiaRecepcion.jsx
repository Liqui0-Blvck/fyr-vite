import MaxWidthWrapper from '@/componentes/MaxWidthWrapper'
import { useFormik } from 'formik'
import { Input, Select, Switch } from 'antd'
import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

const FormularioRegistroGuiaRecepcion = () => {
  const { authTokens, validToken } = useAuth()
  const base_url = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate()
  const { data: camiones } = useAuthenticatedFetch(
    authTokens,
    validToken,
    '/api/registros/camiones/'
  )

  const { data: productores } = useAuthenticatedFetch(
    authTokens,
    validToken,
    '/api/productores/'
  )

  const { data: conductores } = useAuthenticatedFetch(
    authTokens,
    validToken,
    '/api/registros/choferes'
  )

  const { data: comercializadores } = useAuthenticatedFetch(
    authTokens,
    validToken,
    '/api/comercializador/'
  ) 
  console.log(comercializadores)

  
  const formik = useFormik({
    initialValues: {
      estado_recepcion: null,
      mezcla_variedades: false,
      cierre_guia: false,
      tara_camion_1: null,
      tara_camion_2: null,
      terminar_guia: false,
      numero_guia_productor: null,
      creado_por: null,
      comercializador: null,
      productor: null,
      camionero: null,
      camion: null
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/recepcionmp/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...values
          })
        })
        if (res.ok) {
          const data = await res.json()
          console.log(data)
          toast.success("la guia de recepción fue registrado exitosamente!!")
          navigate('/app/lista-guias-salida')

        } else {
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const onSearch = (value) => {
    console.log("search:", value);
  };


  const filterOption = (
    input,
    option,
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());


  return (
    <MaxWidthWrapper>
      <form 
        onSubmit={formik.handleSubmit}
        className='flex flex-col 
          md:grid md:grid-cols-6 gap-x-6 gap-y-8 mt-10 
          relative p-4 border border-gray-200 rounded-md'
        >

        <div className='border border-gray-300 rounded-md col-span-6'>
          <h1 className='text-center text-2xl p-4'>Registro Guía Recepción Para Materias Primas Origen</h1>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="camion">Camión: </label>
          <Select
            showSearch
            placeholder="Selecciona una camion"
            optionFilterProp="children"
            className='rounded-md mt-1 col-span-3 h-11 w-full'
            onChange={value => formik.setFieldValue('region', value) }
            onSearch={onSearch}
            name='camion'
            filterOption={filterOption}
            options={camiones && camiones.map((camion) => ({
              value: camion.id,
              label: `Patente ${camion.patente}, ${camion.acoplado ? 'Con Acoplado' : 'Sin Acoplado'}`
            }))}
            />
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="productor">Productor: </label>
          <Select
            showSearch
            placeholder="Selecciona una productor"
            optionFilterProp="children"
            className='rounded-md mt-1 col-span-3 h-11 w-full'
            onChange={value => formik.setFieldValue('productor', value) }
            onSearch={onSearch}
            name='productor'
            filterOption={filterOption}
            options={productores && productores.map((productor) => ({
              value: productor.id,
              label: productor.nombre
            }))}
            />
        </div>

        <div className='md:row.start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="camionero">Camionero: </label>
          <Select
            showSearch
            placeholder="Selecciona una camionero"
            optionFilterProp="children"
            className='rounded-md mt-1 col-span-3 h-11 w-full'
            onChange={value => formik.setFieldValue('camionero', value) }
            onSearch={onSearch}
            name='camionero'
            filterOption={filterOption}
            options={conductores && conductores.map((conductor) => ({
              value: conductor.id,
              label: conductor.nombre
            }))}
            />
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="comercializador">Comercializador: </label>
          <Select
            showSearch
            placeholder="Selecciona una comercializador"
            optionFilterProp="children"
            className='rounded-md mt-1 col-span-3 h-11 w-full'
            onChange={value => formik.setFieldValue('comercializador', value) }
            onSearch={onSearch}
            name='comercializador'
            filterOption={filterOption}
            options={comercializadores && comercializadores.map((comercializador) => ({
              value: comercializador.id,
              label: comercializador.nombre
            }))}
            />
        </div>

        <div className='md:col-span-2  2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="provincia">Provincia: </label>
          <Input 
            type='text'
            name='direccion'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        <div className='md:col-span-2  md:col-start-5 md:flex-col items-center'>
          <label htmlFor="comuna">Comuna: </label>
          <Input 
            type='text'
            name='direccion'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>
        


        <div className='md:row-start-4 md:col-start-5 md:col-span-2 relative w-full'>
          <button className='w-full mt-6 bg-[#1693A7] hover:bg-[#1694a7d0] rounded-md text-white py-3'>Registrar Operario</button>
        </div>
      </form>
    </MaxWidthWrapper>
  )
}

export default FormularioRegistroGuiaRecepcion 
