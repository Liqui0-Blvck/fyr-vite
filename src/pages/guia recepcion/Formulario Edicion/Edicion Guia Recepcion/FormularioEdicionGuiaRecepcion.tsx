import { useFormik } from 'formik'
import Input from '../../../../components/form/Input'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../context/authContext'
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction'
import { TCamion, TComercializador, TConductor, TGuia, TLoteGuia, TProductor } from '../../../../types/registros types/registros.types'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import useDarkMode from '../../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { ACTIVO } from '../../../../utils/select.constanst'

import Radio, { RadioGroup } from '../../../../components/form/Radio'
import { urlNumeros } from '../../../../services/url_number'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'

const FormularioEdicionGuiaRecepcion = () => {
  const { authTokens, validate, userID } = useAuth()
  const { pathname } = useLocation()
  const { isDarkTheme } = useDarkMode()
  const navigate = useNavigate()
  const id = urlNumeros(pathname)
  const base_url = process.env.VITE_BASE_URL_DEV




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

  const { data: guia } = useAuthenticatedFetch<TGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${id}`
  )

  const updateGuiaRecepcion = async () => {
    const res = await fetch(`${base_url}/api/estado-guia-update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      },
      body: JSON.stringify({
        estado_recepcion: 4
      })
    })

    if (res.ok){
    } else {
      console.log("Todo mal")
    }
  }


  const formik = useFormik({
    initialValues: {
      mezcla_variedades: false,
      numero_guia_productor: null,
      camionero: null,
    },
    onSubmit: async (values: any) => {
      try {
        const res = await fetch(`${base_url}/api/recepcionmp/${guia?.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${authTokens?.access}` 
          },
          body: JSON.stringify({
            ...values, 
            creado_por: userID?.user_id,
          })
        });
        if (res.ok) {
          toast.success("la guia de recepción fue registrado exitosamente!!")
          navigate('/app/recepcionmp/')
          

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
  
  
  console.log(optionsConductor)

  useEffect(() => {
    let isMounted = true
    if (guia && isMounted) {
      formik.setValues({
        mezcla_variedades: guia.mezcla_variedades,
        numero_guia_productor: guia.numero_guia_productor,
        camionero: guia.camionero,
        creado_por: guia.creado_por,
      })

    }
    return () => {
      isMounted = false
    }
  }, [guia])


  const camionAcoplado = camiones?.find(camion => camion.id === Number(guia?.camion))?.acoplado


  console.log(formik.values)

  return (
    <div className={`${isDarkTheme ? oneDark : 'bg-white'}w-full  h-full`}>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-5
          gap-y-10  relative px-5 py-6 w-full
          rounded-md`}
          >

        <div className='rounded-md col-span-6'>
          <h1 className='text-center text-3xl p-4'>Edición Guía Recepción Para Materias Primas Origen</h1>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="productor">Productor: </label>
          <div className={`rounded-md px-3 h-14 w-full flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_productor}</span>
          </div>

        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor='camionero'>Chofer: </label>
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
                value={optionsConductor.find(con => con?.value === String(formik.values.camionero))}
                onChange={(value: any) => {
                  formik.setFieldValue('camionero', value.value)
                }}
              />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="camion">Camion: </label>
          <div className={`rounded-md h-14 w-full px-3 flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_camion}</span>
          </div>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="comercializador">Comercializador: </label>
          <div className={`rounded-md h-14 w-full px-3 flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_comercializador}</span>
          </div>
        </div>

        <div className='md:rw-start-3 md:col-span-2 md:col-start-3 md:flex-col items-center justify-center'>
          <label htmlFor="mezcla_variedades">Mezcla Variedades: </label>

          <div className={`w-fullrounded-md h-14  ${isDarkTheme ? 'bg-[#27272A]' : 'bg-gray-100'} rounded-md flex items-center justify-center relative`}>
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
                    selectedValue={undefined}
                    />
                );
              })}
            </RadioGroup>
          </div>
        </div>

        <div className='md:row-start-3 md:col-span-2  md:col-start-5 md:flex-col items-center'>
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

        <div className='md:row-start-5 md:col-start-5 md:col-span-2 relative w-full'>
          <button className='w-full mt-6 bg-[#3B82F6] hover:bg-[#3b83f6cd] rounded-md text-white py-3'>Guardar Cambios</button>
        </div>
      </form>
    </div>
  )
}

export default FormularioEdicionGuiaRecepcion 
