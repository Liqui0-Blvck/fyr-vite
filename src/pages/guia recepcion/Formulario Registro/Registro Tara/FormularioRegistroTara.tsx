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

interface IFormularioEditable {
  refresh: Dispatch<SetStateAction<boolean | null>>
  isOpen: Dispatch<SetStateAction<boolean | null>>
  guia: TGuia | null
  lote: TLoteGuia | null
}

const FormularioRegistroTara : FC<IFormularioEditable> = ({ refresh, isOpen, guia, lote }) => {
  const { authTokens, validate, userID } = useAuth()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()

  console.log(lote)


  const { data: camiones } = useAuthenticatedFetch<TCamion[]>(
    authTokens,
    validate,
    '/api/registros/camiones/'
  )

  const optionsRadio = [
    { id: 1, value: true, label: 'Si' },
    { id: 2, value: false, label: 'No' }
  ];

  const { data: loteGuia } = useAuthenticatedFetch<TLoteGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${id}/lotes/${lote?.id}`
  )

  console.log("estamos aqui")

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
      refresh(true)
      isOpen(false)
    } else {
      console.log("Todo mal")
    }
  }


  const formik = useFormik({
    initialValues: {
      kilos_brutos_1: 0,
      kilos_brutos_2: 0,
      kilos_tara_1: 0,
      kilos_tara_2: 0,
      estado_recepcion: null,
      guiarecepcion: null,
      creado_por: null,
    },
    onSubmit: async (values: any) => {
      try {
        const res = await fetch(`${base_url}/api/recepcionmp/${guia?.id}/lotes/${lote?.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${authTokens?.access}` 
          },
          body: JSON.stringify({
            ...values, 
            creado_por: userID?.user_id, 
            estado_recepcion: 7
          })
        });
        if (res.ok) {
          if (!guia?.mezcla_variedades){
            updateGuiaRecepcion()
          }
          toast.success("la guia de recepción fue registrado exitosamente!!")
          refresh(true)
          isOpen(false)
          

        } else {
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })




  useEffect(() => {
    let isMounted = true
    if (loteGuia && isMounted) {
      formik.setValues({
        kilos_brutos_1: loteGuia.kilos_brutos_1,
        kilos_brutos_2: loteGuia.kilos_brutos_2,
        estado_recepcion: loteGuia.estado_recepcion,
        guiarecepcion: loteGuia.guiarecepcion,
        creado_por: loteGuia.creado_por,
      })

    }
    return () => {
      isMounted = false
    }
  }, [loteGuia])

  useEffect(() => {
    let isMounted = true
    if (guia && isMounted){
      formik
    }
  }, [guia])

  console.log(guia)


  const camionAcoplado = camiones?.find(camion => camion.id === Number(guia?.camion))?.acoplado



  return (
    <div className={`${isDarkTheme ? oneDark : 'bg-white'} w-full  h-full`}>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-5
          gap-y-10  relative px-5 py-6 w-full
          rounded-md`}
          >

        <div className='rounded-md col-span-6'>
          <h1 className='text-center text-xl p-4'>Registro Guía Recepción Para Materias Primas Origen</h1>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="productor">Productor: </label>
          <div className={`rounded-md px-3 h-14 w-full flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_productor}</span>
          </div>

        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="camionero">Chofer: </label>
          <div className={`rounded-md h-14 w-full px-3 flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_camionero}</span>
          </div>

        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="camion">Camion: </label>
          <div className={`rounded-md h-14 w-full px-3 flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_camion}</span>
          </div>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="comercializador">Comercializador: </label>
          <div className={`rounded-md h-14 w-full px-3 flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_comercializador}</span>
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
                    value={value}
                    checked={guia?.mezcla_variedades === value} // Comprueba si la opción está seleccionada basándose en el valor de guia.mezcla_variedades
                    disabled
                  />
                );
              })}
            </RadioGroup>
          </div>
        </div>

        <div className='md:row-start-3 md:col-span-2  md:col-start-5 md:flex-col items-center'>
          <label htmlFor="numero_guia_productor">N° Guia Productor: </label>
          <div className={`rounded-md h-14 w-full px-3 flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.numero_guia_productor}</span>
          </div>
        </div>

        <div className={`md:row-start-4 ${!camionAcoplado ? 'md:col-start-2 md:col-span-4': 'md:col-start-1 md:col-span-3 '} md:flex-col items-center`}>
          <label htmlFor="kilos_tara_1">Tara Camión: </label>
          <Input
            type='text'
            name='kilos_tara_1'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.kilos_tara_1!}
          />
        </div>


        {
          camionAcoplado
            ? (
              <div className='md:row-start-4 md:col-span-3 md:col-start-4 md:flex-col items-center'>
                <label htmlFor="kilos_tara_2">Tara Camión Acoplado: </label>
                <Input
                  type='text'
                  name='kilos_tara_2'
                  onChange={formik.handleChange}
                  className='py-3'
                  value={formik.values.kilos_tara_2!}
                  
                />
              </div>
            )
            : null
        }

        <div className='md:row-start-5 md:col-start-5 md:col-span-2 relative w-full'>
          <button className='w-full mt-6 bg-[#3B82F6] hover:bg-[#3b83f6cd] rounded-md text-white py-3'>Añadir Tara</button>
        </div>
      </form>
    </div>
  )
}

export default FormularioRegistroTara 
