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
import Radio, { RadioGroup } from '../../../components/form/Radio'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TControlCalidad, TLoteGuia } from '../../../types/registros types/registros.types'

interface IFormCC {
  refresh: Dispatch<SetStateAction<boolean | null>>
  setOpen: Dispatch<SetStateAction<boolean | null>>
  id_lote: number,
  updateEstado: (id: number, estado: string) => void
}

const FormularioRegistroControlCalidad : FC<IFormCC> = ({ refresh, setOpen, id_lote, updateEstado }) => {
  

  console.log(id_lote)
  const { authTokens, validate, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode ();
  const { data: control_calidad } = useAuthenticatedFetch<TControlCalidad[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/?search=${id_lote}`
  ) 

  console.log(userID)

  useEffect(() => {
    let isMounted = true

    if (isMounted && control_calidad){
      formik.setValues({
        humedad: parseFloat(control_calidad[0]?.humedad),
        presencia_insectos: control_calidad[0].presencia_insectos,
        observaciones: control_calidad[0].observaciones
      })
    }

    () => {
      isMounted = false
    } 
  }, [control_calidad])

  

  

  const formik = useFormik({
    initialValues: {
      humedad: 0,
      presencia_insectos: false,
      observaciones: ""
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/${id_lote}/`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: JSON.stringify({
            ...values,
            recepcionmp: id_lote,
            cc_registrado_por: userID?.user_id
          })
        })
        if (res.ok) {
          toast.success("El control de calidad fue registrado exitosamente!!")
          updateEstado(id_lote,'3')
          setOpen(false)
          refresh(true)

        } else {
          toast.error("No se pudo registrar el control de calidad, volver a intentar")
          
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  console.log(formik.values)

  

  const optionsRadio = [
    { id: 1, value: true, label: 'Si'},
    { id: 2, value: false, label: 'No'}
  ];



  return (
    <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-4 gap-x-3
        gap-y-5 mt-10 ${ isDarkTheme ? oneDark : oneLight} relative px-5 py-6
        rounded-md`}
      >
        <div className='md:col-span-2 md:flex-col items-center'>
          <label htmlFor="humedad">Humedad: </label>
          <Input
            type='number'
            name='humedad'
            onChange={formik.handleChange}
            className='py-2'
            value={formik.values.humedad}
          />
        </div>

        <div className='md:col-span-2 md:col-start-3 md:flex-col flex-col lg:flex-row '>
          <label htmlFor="acoplado">Presencia Insectos: </label>
          <div className='w-full bg-gray-100 flex items-center justify-center py-[2.3px] rounded-lg'>
            <RadioGroup isInline>
              {optionsRadio.map(({ id, value, label }) => {
                return (
                  <Radio
                    key={id}
                    label={label}
                    name='presencia_insectos'
                    value={label} // Asignar el valor correcto de cada botón de radio
                    checked={formik.values.presencia_insectos === value} // Comprobar si este botón de radio está seleccionado
                    onChange={(e) => {
                      formik.setFieldValue('presencia_insectos', e.target.value === 'Si' ? true : false) // Actualizar el valor de mezcla_variedades en el estado de formik
                    } } 
                    selectedValue={undefined} />
                );
              })}
            </RadioGroup>
          </div>
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
         <button className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Registrar Control Calidad
          </button>
        </div>
      </form>
      
  )
}

export default FormularioRegistroControlCalidad





