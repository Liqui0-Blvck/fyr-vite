import { useFormik, validateYupSchema } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import useDarkMode from '../../../hooks/useDarkMode'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { TProductor } from '../../../types/registros types/registros.types'

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

interface IFormProductor {
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
  id: number
}

const FormularioEdicionProductores: FC<IFormProductor> = ({ refresh, setOpen, id }) => {
  const { authTokens, validate } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()
  const { isDarkTheme } = useDarkMode()
  const { data: productores } = useAuthenticatedFetch<TProductor>(
    authTokens,
    validate,
    `/api/productores/${id}`
  )


  const formik = useFormik({
    initialValues: {
      rut_productor: "",
      nombre: "",
      telefono: "",
      region: 0,
      provincia: 0,
      comuna: 0,
      direccion: "",
      movil: "",
      pagina_web: "",
      email: "",
      numero_contrato: 0
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/productores/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...values
          })
        })
        if (res.ok) {
          toast.success("El productor fue registrado exitosamente!!")
          setOpen(false)
          refresh(true)
          navigate('/app/productores')

        } else {
          toast.error("No se pudo registrar el camión volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  useEffect(() => {
    let isMounted = true

    if (isMounted && productores) {
      formik.setValues({
        rut_productor: productores?.rut_productor,
        nombre: productores?.nombre,
        telefono: productores?.telefono,
        region: productores.region,
        provincia: productores.provincia,
        comuna: productores.comuna,
        direccion: productores.direccion,
        movil: productores.movil,
        pagina_web: productores.pagina_web,
        email: productores.email,
        numero_contrato: productores.numero_contrato
      })
    }

    return () => {
      isMounted = false
    }
  }, [productores])

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

  const region = regiones?.map((region: IRegion) => ({
    value: String(region.region_id),
    label: region.region_nombre
  })) ?? []

  const provincia = provincias?.map((provincia: IProvincia) => ({
    value: String(provincia.provincia_id),
    label: provincia.provincia_nombre
  })) ?? []

  const comuna = comunas?.map((comuna: IComuna) => ({
    value: String(comuna.comuna_id),
    label: comuna.comuna_nombre
  })) ?? []

  const optionsRegion: TSelectOptions | [] = region
  const optionsProvincia: TSelectOptions | [] = provincia
  const optionsComuna: TSelectOptions | [] = comuna

  console.log(formik.values)

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
      gap-y-10 mt-10 ${isDarkTheme ? oneDark : oneLight} relative px-5 py-6
      rounded-md`}
    >
      <div className='md:col-span-2 md:flex-col items-center'>
        <label htmlFor="rut_productor">Rut Productor: </label>
        <Input
          type='text'
          name='rut_productor'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.rut_productor}
        />
      </div>

      <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
        <label htmlFor="nombre">Nombre: </label>
        <Input
          type='text'
          name='nombre'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.nombre}
        />
      </div>

      <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
        <label htmlFor="email">Correo: </label>
        <Input
          type='email'
          name='email'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.email}
        />
      </div>

      <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
        <label htmlFor="region">Región: </label>
        <SelectReact
          options={optionsRegion}
          id='region'
          name='region'
          placeholder='Selecciona una región'
          value={optionsRegion.find(option => Number(option?.value) === formik.values.region)}
          className='h-14'
          onChange={(value: any) => {
            formik.setFieldValue('region', value.value)
          }}
        />
      </div>

      <div className='md:col-span-2  md:row-start-2 md:col-start-3 md:flex-col items-center'>
        <label htmlFor="provincia">Provincia: </label>
        <SelectReact
          options={optionsProvincia}
          id='provincia'
          name='provincia'
          placeholder='Selecciona una provincia'
          value={optionsProvincia.find(option => Number(option?.value) === formik.values.provincia)}
          className='h-14'
          onChange={(value: any) => {
            formik.setFieldValue('provincia', value.value)
          }}
        />
      </div>

      <div className='md:col-span-2 md:row-start-2 md:col-start-5 md:flex-col items-center'>
        <label htmlFor="comuna">Comuna: </label>
        <SelectReact
          options={optionsComuna}
          id='comuna'
          name='comuna'
          placeholder='Selecciona una comuna'
          value={optionsComuna.find(option => Number(option?.value) === formik.values.comuna)}
          className='h-14'
          onChange={(value: any) => {
            formik.setFieldValue('comuna', value.value)
          }}
        />
      </div>

      <div className='md:col-span-2 md:row-start-3  md:flex-col items-center'>
        <label htmlFor="direccion">Dirección: </label>
        <Input
          type='text'
          name='direccion'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.direccion}
        />
      </div>


      <div className='md:col-span-2 md:row-start-3 md:col-start-3 md:flex-col items-center'>
        <label htmlFor="telefono">Telefono Fijo: </label>
        <Input
          type='text'
          name='telefono'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.telefono}
        />
      </div>



      <div className='md:col-span-2 md:row-start-3 md:col-start-5 md:flex-col items-center'>
        <label htmlFor="movil">Telefono Celular: </label>
        <Input
          type='text'
          name='movil'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.movil}
        />
      </div>

      <div className='md:col-span-2 md:row-start-4 md:flex-col items-center'>
        <label htmlFor="pagina_web">Página Web: </label>
        <Input
          type='text'
          name='pagina_web'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.pagina_web}
        />
      </div>

      <div className='md:col-span-2 md:row-start-4 md:col-start-3 md:flex-col items-center'>
        <label htmlFor="numero_contrato">N° Contrato: </label>
        <Input
          type='text'
          name='numero_contrato'
          onChange={formik.handleChange}
          className='py-3'
          value={formik.values.numero_contrato!}
        />
      </div>


      <div className='md:row-start-4 md:col-start-5 md:col-span-2 relative w-full'>
        <button className='w-full mt-6 bg-[#3B82F6] hover:bg-[#3b83f6cd] rounded-md text-white py-3.5'>Guardar Cambios</button>
      </div>
    </form>
  )
}

export default FormularioEdicionProductores  
