import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TCamion, TComercializador, TConductor, TGuia, TProductor } from '../../../types/registros types/registros.types'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import useDarkMode from '../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'
import { ACTIVO } from '../../../utils/select.constanst'
import FooterFormularioRegistro from './FooterFormularioRegistroGuiaRecepcion'

import Radio, { RadioGroup } from '../../../components/form/Radio'
import Validation from '../../../components/form/Validation'
import Icon from '../../../components/icon/Icon'
import FieldWrap from '../../../components/form/FieldWrap'
import { headerGuiaRegistroSchema } from '../../../utils/Validator'
import Label from '../../../components/form/Label'

const FormularioRegistroGuiaRecepcion = () => {
  const { authTokens, validate, userID } = useAuth()
  const [guiaGenerada, setGuiaGenerada] = useState<boolean>(false)
  const [guiaID, setGuiaID] = useState<number | null>(null)
  const [variedad, setVariedad] = useState<boolean>(false)
  const [activo, setActivo] = useState<boolean>(false)
  const [datosGuia, setDatosGuia] = useState<TGuia | null>(null)
  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()
  const { isDarkTheme } = useDarkMode()


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
    { id: 1, value: true, label: 'Si' },
    { id: 2, value: false, label: 'No' }
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
    validationSchema: headerGuiaRegistroSchema,
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
          setGuiaID(data.id)
          setVariedad(data.mezcla_variedades)
          setDatosGuia(data)
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
    label: (`Patente ${camion.patente},  ${camion.acoplado ? 'Con Acoplado' : 'Sin Acoplado'}`)
  })) ?? []

  const productoresFilter = productores?.map((productor: TProductor) => ({
    value: String(productor.id),
    label: productor.nombre
  })) ?? []

  const conductoresFilter = conductores?.map((conductor: TConductor) => ({
    value: String(conductor.id),
    label: conductor.nombre + ' ' + conductor.apellido
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



  return (
    <div className={`${isDarkTheme ? oneDark : 'bg-white'} h-full`}>
      <form
        onSubmit={formik.handleSubmit}
        noValidate
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
      gap-y-10 mt-10 ${isDarkTheme ? oneDark : oneLight} relative px-5 py-6 
      rounded-md`}
      >

        <div className={`${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-100'} rounded-md col-span-6`}>
          <h1 className='text-center text-2xl p-4'>Guía Recepción Materia Prima</h1>
          <h4>{datosGuia?.estado_recepcion_label}</h4>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
          <Label htmlFor='productor'>Productor: </Label>

          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.productor ? true : undefined}
            invalidFeedback={formik.errors.productor ? String(formik.errors.productor) : undefined}
            >
            <FieldWrap>
              <SelectReact
                options={optionsProductor}
                id='productor'
                name='productor'
                placeholder='Selecciona un productor'
                className='h-14'
                onBlur={formik.handleBlur}
                onChange={(value: any) => {
                  formik.setFieldValue('productor', value.value)
                }}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <Label htmlFor='camionero'>Chofer: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.camionero ? true : undefined}
            invalidFeedback={formik.errors.camionero ? String(formik.errors.camionero) : undefined}

>
            <FieldWrap>
              <SelectReact
                options={optionsConductor}
                id='camionero'
                name='camionero'
                placeholder='Selecciona un chofer'
                className='h-14'
                onBlur={formik.handleBlur}
                onChange={(value: any) => {
                  formik.setFieldValue('camionero', value.value)
                }}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row.start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <Label htmlFor='camion'>Camión: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.camion ? true : undefined}
            invalidFeedback={formik.errors.camionero ? String(formik.errors.camion) : undefined}
            >
            <FieldWrap>
              <SelectReact
                options={optionsCamion}
                id='camion'
                name='camion'
                placeholder='Selecciona un camión'
                className='h-14'
                onBlur={formik.handleBlur}
                onChange={(value: any) => {
                  formik.setFieldValue('camion', value.value)
                }}
              />
            </FieldWrap>
          </Validation>

        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col items-center'>
          <Label htmlFor='comercializador'>Comercializador: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.comercializador ? true : undefined}
            invalidFeedback={formik.errors.comercializador ? String(formik.errors.comercializador) : undefined}

>
            <FieldWrap>
              <SelectReact
                options={optionsComercializador}
                id='comercializador'
                name='comercializador'
                placeholder='Selecciona una opción'
                className='h-14'
                onBlur={formik.handleBlur}

                onChange={(value: any) => {
                  formik.setFieldValue('comercializador', value.value)
                }}
              />
            </FieldWrap>
          </Validation>

        </div>

        <div className='md:col-span-2  2 md:col-start-3 md:flex-col items-center justify-center'>
          <Label htmlFor='mezcla_variedades'>Mezcla Variedades: </Label>


          <div className={`w-full h-14  ${isDarkTheme ? 'bg-[#27272A]' : 'bg-gray-100'} rounded-md flex items-center justify-center relative`}>
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
                      formik.setFieldValue('mezcla_variedades', e.target.value === 'Si' ? true : false) // Actualizar el valor de mezcla_variedades en el estado de formik
                    }}
                    selectedValue={undefined} />
                );
              })}
            </RadioGroup>
          </div>
        </div>

        <div className='md:col-span-2  md:col-start-5 md:flex-col items-center'>
          <Label htmlFor='numero_guia_productor'>N° Guía Productor: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.numero_guia_productor ? true : undefined}
            invalidFeedback={formik.errors.numero_guia_productor ? String(formik.errors.numero_guia_productor) : undefined}

>
            <FieldWrap>
              <Input
                type='text'
                name='numero_guia_productor'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='py-3'
                value={formik.values.numero_guia_productor!}
              />
            </FieldWrap>
          </Validation>
        </div>



        {
          guiaGenerada
            ? null
            :
            (
              <div className='md:row-start-4 md:col-start-5 md:col-span-2 relative w-full'>
                <button className='w-full mt-6 bg-[#3B82F6] hover:bg-[#3b83f6cd] rounded-md text-white py-3'>Continuar con la guia</button>
              </div>
            )
        }
      </form>

      {
        (guiaGenerada && !variedad)
          ? (
            <FooterFormularioRegistro data={datosGuia!} variedad={variedad} />
          )
          : (guiaGenerada && activo)
            ? (
              <FooterFormularioRegistro data={datosGuia!} variedad={variedad} />
            )
            : guiaGenerada
              ? (
                <button
                  type='submit'
                  className={`${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'}
                      ml-10 mt-10 px-6 py-3 rounded-md font-semibold text-md
                      `}
                  onClick={() => setActivo(prev => !prev)}>Agregar Lotes</button>
              )
              : null
      }

    </div>
  )
}

export default FormularioRegistroGuiaRecepcion 
