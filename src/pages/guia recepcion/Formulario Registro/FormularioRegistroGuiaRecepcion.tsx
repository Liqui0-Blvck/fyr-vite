import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TCamion, TComercializador, TConductor, TProductor } from '../../../types/registros types/registros.types'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import useDarkMode from '../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'
import { ACTIVO } from '../../../constants/select.constanst'
import FooterFormularioRegistro from './FooterFormularioRegistroGuiaRecepcion'

import Label from '../../../components/form/Label'
import Radio, { RadioGroup } from '../../../components/form/Radio'

const FormularioRegistroGuiaRecepcion = () => {
  const { authTokens, validate, userID } = useAuth()
  const [guiaGenerada, setGuiaGenerada] = useState<boolean>(false)
  const [guiaID, setGuiaID] = useState<number | null>(null)
  const [variedad, setVariedad] = useState<boolean>(false)
  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()
  const { isDarkTheme } = useDarkMode()

  console.log(variedad)

  const { data: camiones } = useAuthenticatedFetch<TCamion[]>(
    authTokens,
    validate,
    '/api/registros/camiones/'
  )

  const { data: productores } = useAuthenticatedFetch<TProductor[]>(
    authTokens,
    validate,
    '/api/productores/'
  )

  const { data: conductores } = useAuthenticatedFetch<TConductor[]>(
    authTokens,
    validate,
    '/api/registros/choferes'
  )

  const { data: comercializadores } = useAuthenticatedFetch<TComercializador[]>(
    authTokens,
    validate,
    '/api/comercializador/'
  )

  const optionsRadio = [
    { id: 1, value: true, label: 'Si'},
    { id: 2, value: false, label: 'No'}
  ];




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
    onSubmit: async (values: any) => {
      try {
        const res = await fetch(`${base_url}/api/recepcionmp/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: JSON.stringify({
            ...values,
            estado_recepcion: 1,
            creado_por: userID?.user_id

          })
        })
        if (res.ok) {
          const data = await res.json()
          console.log(data.id)
          setGuiaID(data.id)
          setVariedad(data.mezcla_variedades)
          toast.success("la guia de recepción fue registrado exitosamente!!")
          setGuiaGenerada(true)

        } else {
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const camionFilter = camiones?.map((camion: TCamion) => ({
    value: String(camion.id),
    label: (`${camion.patente},  ${camion.acoplado ? 'Con Acoplado' : 'Sin Acoplado'}`)
  })) ?? []

  const productoresFilter = productores?.map((productor: TProductor) => ({
    value: String(productor.id),
    label: productor.nombre
  })) ?? []

  const conductoresFilter = conductores?.map((conductor: TConductor) => ({
    value: String(conductor.id),
    label: conductor.nombre
  })) ?? []

  const comercializadoresFilter = comercializadores?.map((comerciante: TComercializador) => ({
    value: String(comerciante.id),
    label: comerciante.nombre
  })) ?? []

  const mezclaVariedadesFilter = ACTIVO?.map((variedad) => ({
    value: String(variedad.values),
    label: variedad.label
  })) ?? []

  const optionsCamion: TSelectOptions | [] = camionFilter
  const optionsProductor: TSelectOptions | [] = productoresFilter
  const optionsConductor: TSelectOptions | [] = conductoresFilter
  const optionsComercializador: TSelectOptions | [] = comercializadoresFilter
  const optionsMezcla: TSelectOptions | [] = mezclaVariedadesFilter


  console.log(formik.values)

  return (
    <div className={`${isDarkTheme ? oneDark : 'bg-white'} h-full`}>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
      gap-y-10 mt-10 ${isDarkTheme ? oneDark : oneLight} relative px-5 py-6 
      rounded-md`}
      >

        <div className='border border-gray-300 rounded-md col-span-6'>
          <h1 className='text-center text-2xl p-4'>Registro Guía Recepción Para Materias Primas Origen</h1>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="productor">Productor: </label>
          <SelectReact
            options={optionsProductor}
            id='productor'
            name='productor'
            placeholder='Selecciona un productor'
            className='h-14'
            onChange={(value: any) => {
              formik.setFieldValue('productor', value.value)
            }}
          />
          
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="camionero">Chofer: </label>
          <SelectReact
            options={optionsConductor}
            id='camionero'
            name='camionero'
            placeholder='Selecciona un chofer'
            className='h-14'
            onChange={(value: any) => {
              formik.setFieldValue('camionero', value.value)
            }}
          />
          
        </div>

        <div className='md:row.start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="camion">Camion: </label>
          <SelectReact
            options={optionsCamion}
            id='camion'
            name='camion'
            placeholder='Selecciona un camión'
            className='h-14'
            onChange={(value: any) => {
              formik.setFieldValue('camion', value.value)
            }}
          />
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="comercializador">Comercializador: </label>
          <SelectReact
            options={optionsComercializador}
            id='comercializador'
            name='comercializador'
            placeholder='Selecciona una opción'
            className='h-14'
            onChange={(value: any) => {
              formik.setFieldValue('comercializador', value.value)
            }}
          />
        </div>

        <div className='md:col-span-2  2 md:col-start-3 md:flex-col items-center justify-center'>
          <label htmlFor="mezcla_variedades">Mezcla Variedades: </label>

          <div className='w-full h-14 bg-gray-100  rounded-md flex items-center justify-center'>
          <RadioGroup isInline>
            {optionsRadio.map(({ id, value, label }) => {
              return (
                <Radio
                  key={id}
                  label={label}
                  name='mezcla_variedades'
                  value={label} // Asignar el valor correcto de cada botón de radio
                  checked={formik.values.mezcla_variedades === value} // Comprobar si este botón de radio está seleccionado
                  onChange={(e) => {
                    formik.setFieldValue('mezcla_variedades', e.target.value === 'Si' ? true : false ); // Actualizar el valor de mezcla_variedades en el estado de formik
                  }}
                />
              );
            })}
          </RadioGroup>
          </div>
        </div>

        <div className='md:col-span-2  md:col-start-5 md:flex-col items-center'>
          <label htmlFor="numero_guia_productor">N° Guia Productor: </label>
          <Input
            type='text'
            name='numero_guia_productor'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.numero_guia_productor!}
          />
        </div>



        {
          guiaGenerada
            ? null
            :
            (
              <div className='md:row-start-4 md:col-start-5 md:col-span-2 relative w-full'>
                <button className='w-full mt-6 bg-[#1693A7] hover:bg-[#1694a7d0] rounded-md text-white py-3'>Continuar con la guia</button>
              </div>
            )
        }
      </form>

      {
        (guiaGenerada && variedad)
          ? (
            <FooterFormularioRegistro id_guia={guiaID!} variedades={variedad} />
            )
          : null
      }

    </div>
  )
}

export default FormularioRegistroGuiaRecepcion 
