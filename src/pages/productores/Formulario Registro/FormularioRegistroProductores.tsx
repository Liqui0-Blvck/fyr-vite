import { useFormik } from 'formik'
import { Input, Select, Switch } from 'antd'
import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
// import { TIPOS_OPERARIO } from '../../const/constantes'

interface IRegion {
  region_id: number
  region_nombre: string
}

interface IProvincia {
  provincia_id: number
  provincia_nombre: string
}

interface IComuna {
  comuna_id: number
  comuna_nombre: string
}

const FormularioRegistroProductores = () => {
  const { authTokens, validate } = useAuth()
  const base_url = process.env.VITE_BASE_URL
  const navigate = useNavigate()


  const formik = useFormik({
    initialValues: {
      rut_productor: "",
      nombre: "",
      telefono: "",
      region: null,
      provincia: null,
      comuna: null,
      direccion: "",
      movil: "",
      pagina_web: "",
      email: "",
      numero_contrato: null
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

  const { data: regiones } = useAuthenticatedFetch<IRegion[]>(
    authTokens,
    validate,
    '/api/regiones'
  )

  const { data: provincias } = useAuthenticatedFetch<IProvincia[]>(
    authTokens,
    validate,
    `/api/region/${formik.values.region}/provincias/`
  )

  const { data: comunas } = useAuthenticatedFetch<IComuna[]>(
    authTokens,
    validate,
    `/api/provincias/${formik.values.provincia}/comunas/`
  )

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());



  return (
    <div className='p-10 h-full'>
      <form
        onSubmit={formik.handleSubmit}
        className='flex flex-col 
          md:grid md:grid-cols-6 gap-x-6 gap-y-2
          relative p-2 rounded-md h-full'
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
            className='rounded-md mt-1 col-span-3 h-14 w-full'
            onChange={value => formik.setFieldValue('region', value)}
            onSearch={onSearch}
            name='region'
            filterOption={filterOption}
            options={regiones && regiones.map((region: IRegion) => ({
              value: region.region_id,
              label: region.region_nombre
            }))}
          />
        </div>

        <div className='md:col-span-2  md:row-start-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="provincia">Provincia: </label>
          <Select
            showSearch
            placeholder="Selecciona una tipo de operario"
            optionFilterProp="children"
            className='rounded-md mt-1 col-span-3 h-14 w-full'
            onChange={value => formik.setFieldValue('provincia', value)}
            onSearch={onSearch}
            name='provincia'
            filterOption={filterOption}
            options={provincias && provincias.map((prov: IProvincia) => ({
              value: prov.provincia_id,
              label: prov.provincia_nombre
            }))}
          />
        </div>

        <div className='md:col-span-2 md:row-start-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="comuna">Comuna: </label>
          <Select
            showSearch
            placeholder="Selecciona una comuna"
            optionFilterProp="children"
            className='rounded-md mt-1 col-span-3 h-14 w-full'
            onChange={value => formik.setFieldValue('comuna', value)}
            onSearch={onSearch}
            filterOption={filterOption}
            options={comunas && comunas.map((comu: IComuna) => ({
              value: comu.comuna_id,
              label: comu.comuna_nombre
            }))}
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
          <button className='w-full mt-6 bg-[#1693A7] hover:bg-[#1694a7d0] rounded-md text-white py-3.5'>Registrar Operario</button>
        </div>
      </form>
    </div>
  )
}

export default FormularioRegistroProductores  
