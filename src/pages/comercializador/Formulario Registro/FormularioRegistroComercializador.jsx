import MaxWidthWrapper from '@/componentes/MaxWidthWrapper'
import { useFormik } from 'formik'
import { Input, Select, Switch } from 'antd'
import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { TIPOS_OPERARIO } from '@/const/constantes'
import { useAuth } from '@/context/AuthContext'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

const FormularioRegistroComercializador  = () => {
  const { authTokens, validToken } = useAuth()
  const base_url = import.meta.env.VITE_BASE_URL
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
        const res = await fetch(`${base_url}/api/productores/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...values
          })
        })
        if (res.ok) {
          toast.success("El operario fue registrado exitosamente!!")
          navigate('/app/lista-operarios')

        } else {
          toast.error("No se pudo registrar el camión volver a intentar")
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
        <div className='md:col-span-2 md:flex-col items-center'>
          <label htmlFor="rut_productor">Rut Productor: </label>
          <Input
            type='text'
            name='rut_productor'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="nombre">Nombre: </label>
          <Input
            type='text' 
            name='nombre'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="email">Correo: </label>
          <Input 
            type='email'
            name='email'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
          <label htmlFor="region">Región: </label>
          <Select
            showSearch
            placeholder="Selecciona una región"
            optionFilterProp="children"
            className='rounded-md mt-1 col-span-3 h-11 w-full'
            onChange={value => formik.setFieldValue('region', value) }
            onSearch={onSearch}
            name='region'
            filterOption={filterOption}
            // options={regiones && regiones.map((region) => ({
            //   value: region.region_id,
            //   label: region.region_nombre
            // }))}
            />
        </div>

        <div className='md:col-span-2  md:row-start-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="provincia">Provincia: </label>
          <Select
            showSearch
            placeholder="Selecciona una tipo de operario"
            optionFilterProp="children"
            className='rounded-md mt-1 col-span-3 h-11 w-full'
            onChange={value => formik.setFieldValue('provincia', value) }
            onSearch={onSearch}
            name='provincia'
            filterOption={filterOption}
            // options={provincias && provincias.map((prov) => ({
            //   value: prov.provincia_id,
            //   label: prov.provincia_nombre
            // }))}
            />
        </div>

        <div className='md:col-span-2 md:row-start-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="comuna">Comuna: </label>
          <Select
            showSearch
            placeholder="Selecciona una comuna"
            optionFilterProp="children"
            className='rounded-md mt-1 col-span-3 h-11 w-full'
            onChange={value => formik.setFieldValue('comuna', value) }
            onSearch={onSearch}
            name='comuna'
            filterOption={filterOption}
            // options={comunas && comunas.map((comu) => ({
            //   value: comu.comuna_id,
            //   label: comu.comuna_nombre
            // }))}
            />
        </div>
        
        <div className='md:col-span-2 md:row-start-3  md:flex-col items-center'>
          <label htmlFor="direccion">Dirección: </label>
          <Input 
            type='text'
            name='direccion'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>
        

        <div className='md:col-span-2 md:row-start-3 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="telefono">Telefono Fijo: </label>
          <Input
            type='text' 
            name='telefono'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        

        <div className='md:col-span-2 md:row-start-3 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="movil">Telefono Celular: </label>
          <Input
            type='text' 
            name='movil'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        <div className='md:col-span-2 md:row-start-4 md:flex-col items-center'>
          <label htmlFor="pagina_web">Página Web: </label>
          <Input
            type='text' 
            name='pagina_web'
            onChange={formik.handleChange}
            className='py-3'
          />
        </div>

        <div className='md:col-span-2 md:row-start-4 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="numero_contrato">N° Contrato: </label>
          <Input
            type='text' 
            name='numero_contrato'
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

export default FormularioRegistroComercializador  
