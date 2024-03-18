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
import { ACTIVO } from '../../../../constants/select.constanst'

import Radio, { RadioGroup } from '../../../../components/form/Radio'
import { urlNumeros } from '../../../../services/url_number'

interface IFormularioEditable {
  refresh: Dispatch<SetStateAction<boolean | null>>
  isOpen: Dispatch<SetStateAction<boolean | null>>
  guia: TGuia | null
  lote: TLoteGuia | null
}

const FormularioEdicionGuiaRecepcion : FC<IFormularioEditable> = ({ refresh, isOpen, guia, lote }) => {
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

  const { data: loteGuia } = useAuthenticatedFetch<TLoteGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${id}/lotes/${lote?.id}`
  )

  console.log(loteGuia)

  const updateEstadoLote = async (id: number, estado: string) => {
    console.log(estado);
    const res = await fetch(`${base_url}/api/estado-update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({  
        estado_recepcion: estado
      })
    });

    if (res.ok) {
      console.log('si')
    } else {
      console.log("Errores sobre errores");
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
            estado_recepcion: 3 
          })
        });
        if (res.ok) {
          updateEstadoLote(lote?.id!, '7')
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


  const camionAcoplado = camiones?.find(camion => camion.id === Number(guia?.camion))?.acoplado



  return (
    <div className={`${isDarkTheme ? oneDark : 'bg-white'} h-full`}>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
      gap-y-10 ${isDarkTheme ? oneDark : oneLight} relative px-5 py-6 
      rounded-md`}
      >

        <div className='rounded-md col-span-6'>
          {/* <h1 className='text-center text-xl p-4'>Registro Guía Recepción Para Materias Primas Origen</h1> */}
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="productor">Productor: </label>
          <div className=' h-full w-full flex items-center justify-center'>
            <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_productor}</span>
          </div>

        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="camionero">Chofer: </label>
          <div className=' h-full w-full flex items-center justify-center'>
            <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_camionero}</span>
          </div>

        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="camion">Camion: </label>
          <div className=' h-full w-full flex items-center justify-center'>
            <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_camion}</span>
          </div>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="comercializador">Comercializador: </label>
          <div className=' h-full w-full flex items-center justify-center'>
            <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_comercializador}</span>
          </div>
        </div>

        <div className='md:rw-start-3 md:col-span-2 md:col-start-3 md:flex-col items-center justify-center'>
          <label htmlFor="mezcla_variedades">Mezcla Variedades: </label>

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
                    selectedValue={undefined} 
                    disabled
                    />
                );
              })}
            </RadioGroup>
          </div>
        </div>

        <div className='md:row-start-3 md:col-span-2  md:col-start-5 md:flex-col items-center'>
          <label htmlFor="numero_guia_productor">N° Guia Productor: </label>
          <div className=' h-full w-full flex items-center justify-center'>
            <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.numero_guia_productor}</span>
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
                <label htmlFor="tara_camion_">Tara Camión Acoplado: </label>
                <Input
                  type='text'
                  name='tara_camion_2'
                  onChange={formik.handleChange}
                  className='py-3'
                  value={formik.values.tara_camion_2!}
                  
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

export default FormularioEdicionGuiaRecepcion 
