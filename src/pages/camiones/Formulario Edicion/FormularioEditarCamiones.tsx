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
import { TCamion } from '../../../types/registros types/registros.types'



interface IFormCamiones {
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
  id: number
}

const FormularioEditarCamiones: FC<IFormCamiones> = ({ refresh, setOpen, id }) => {
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode();
  const { authTokens, validate } = useAuth()
  const { data: camiones } = useAuthenticatedFetch<TCamion>(
    authTokens,
    validate,
    `/api/registros/camiones/${id}`
  )

  const formik = useFormik({
    initialValues: {
      patente: "",
      acoplado: false,
      observaciones: ""
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/registros/camiones/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...values })
        })
        if (res.ok) {
          console.log(await res.json())
          toast.success("El envase fue registrado exitosamente!!")
          refresh(true)
          setOpen(false)

        } else {
          toast.error("No se pudo registrar el envase, volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  useEffect(() => {
    let isMounted = true

    if (isMounted && camiones) {
      formik.setValues({
        patente: camiones.patente,
        acoplado: camiones.acoplado,
        observaciones: camiones.observaciones
      })
    }

    return () => {
      isMounted = false
    }
  }, [camiones])

  const acoplados = TIPO_ACOPLADO?.map((acoplado) => ({
    value: acoplado.values,
    label: acoplado.label
  })) ?? []

  const options: TSelectOptions | [] = acoplados

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
        gap-y-5 mt-10 ${isDarkTheme ? oneDark : oneLight} relative px-5 py-6
        rounded-md`}
    >
      <div className='md:col-span-2 md:flex-col items-center'>
        <label htmlFor="patente">Patente: </label>
        <Input
          name='patente'
          onChange={formik.handleChange}
          className='py-2.5'
          value={formik.values.patente}
        />
      </div>

      <div className='md:col-span-2 md:col-start-3 md:flex-col flex'>
        <label htmlFor="acoplado">Acoplado: </label>
        <SelectReact
          options={options}
          id='acoplado'
          placeholder='Selecciona un opción'
          name='acoplado'
          className='h-12'
          value={options.find(option => option?.value === String(formik.values.acoplado))}
          onChange={(value: any) => {
            formik.setFieldValue('acoplado', value.value)
          }}
        />
      </div>

      <div className='md:row-start-2 md:col-span-4  md:flex-col items-center'>
        <label htmlFor="observaciones">Observaciones: </label>
        <Textarea
          rows={5}
          cols={9}
          name='observaciones'
          onChange={formik.handleChange}
          value={formik.values.observaciones}
        />
      </div>



      <div className='relative w-full h-20 col-span-4'>
        <button type='submit' className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
          Guardar Cambios
        </button>
      </div>
    </form>

  )
}

export default FormularioEditarCamiones
