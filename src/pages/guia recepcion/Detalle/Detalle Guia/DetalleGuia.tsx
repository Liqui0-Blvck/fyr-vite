import { useFormik } from 'formik'
import Input from '../../../../components/form/Input'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../context/authContext'
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction'
import { TCamion, TComercializador, TConductor, TControlCalidad, TGuia, TLoteGuia, TProductor } from '../../../../types/registros types/registros.types'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import useDarkMode from '../../../../hooks/useDarkMode'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FC, useEffect, useState } from 'react'
import { ACTIVO, ESTADO_CONTROL, usuarioRole } from '../../../../constants/select.constanst'

import Radio, { RadioGroup } from '../../../../components/form/Radio'
import { urlNumeros } from '../../../../services/url_number'
import FooterDetalleGuia from './FooterDetalleGuia'
import FooterFormularioEdicionGuia from '../../Formulario Edicion/Edicion Guia/FooterFormularioEdicionGuiaRecepcion'
import FooterDetalleGuiaFinalizada from './FooterDetalleGuiaFinalizada'


const DetalleGuia = () => {
  const { authTokens, validate, userID } = useAuth()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const [nuevoLote, setNuevoLote] = useState<boolean>(false)
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

  const { data: control_calidad } = useAuthenticatedFetch<TControlCalidad[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp`
  ) 

  const optionsRadio = [
    { id: 1, value: true, label: 'Si' },
    { id: 2, value: false, label: 'No' }
  ];

  const { data: guia_recepcion, setRefresh } = useAuthenticatedFetch<TGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${id}`
  )

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
          setGuiaID(data.id)
          setVariedad(data.mezcla_variedades)
          setDatosGuia(data)
          toast.success("la guia de recepción fue registrado exitosamente!!")

        } else {
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const estado_guia_update = async (id: any) => {
    const res = await fetch(`${base_url}/api/recepcionmp/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        estado_recepcion: 3
      })
    })

    if (res.ok){
      toast.success('Guia Finalizada')
      setRefresh(true)
    } else {
      toast.error('No se pudo finalizar la guia')
    }
  }



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

  // const controlesRechazados = control_calidad?.
  //   filter(control => control.recepcionmp === lote.id && control.estado_cc === '0')
  //   .map(control => {
  //       return control; // Puedes devolver el control si lo necesitas para otros propósitos
  //   }).length;


  // const controlesAprobados = control_calidad?.
  //   filter(control => control.recepcionmp === lote.id && control.estado_cc === '1')
  //   .map(control => {
  //       return control; // Puedes devolver el control si lo necesitas para otros propósitos
  //   }).length;

  // const controlesEnEspera = control_calidad?.
  //   filter(control => control.recepcionmp === lote.id && control.estado_cc === '2')
  //   .map(control => {
  //       return control; // Puedes devolver el control si lo necesitas para otros propósitos
  //   }).length;

  const optionsCamion: TSelectOptions | [] = camionFilter
  const optionsProductor: TSelectOptions | [] = productoresFilter
  const optionsConductor: TSelectOptions | [] = conductoresFilter
  const optionsComercializador: TSelectOptions | [] = comercializadoresFilter
  const optionsMezcla: TSelectOptions | [] = mezclaVariedadesFilter

  useEffect(() => {
    let isMounted = true
    if (guia_recepcion && isMounted) {
      formik.setValues({
        estado_recepcion: guia_recepcion.estado_recepcion,
        mezcla_variedades: guia_recepcion.mezcla_variedades,
        cierre_guia: guia_recepcion.cierre_guia,
        tara_camion_1: guia_recepcion.tara_camion_1,
        tara_camion_2: guia_recepcion.tara_camion_2,
        terminar_guia: guia_recepcion.terminar_guia,
        numero_guia_productor: guia_recepcion.numero_guia_productor,
        creado_por: guia_recepcion.creado_por,
        comercializador: guia_recepcion.comercializador,
        productor: guia_recepcion.productor,
        camionero: guia_recepcion.camionero,
        camion: guia_recepcion.camion
      })

      setDatosGuia(guia_recepcion)

    }
    return () => {
      isMounted = false
    }
  }, [guia_recepcion])


  console.log(control_calidad)

  return (
    <div className={`${isDarkTheme ? oneDark : 'bg-white'} h-full`}>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
      gap-y-10 mt-10 ${isDarkTheme ? oneDark : oneLight} relative px-5 py-6 
      rounded-md`}
      >

        <div className='border border-[#18181B] rounded-md col-span-6'>
          <h1 className='text-center text-2xl p-2'>Guía Recepción Materia Prima</h1>
          <h5 className='text-center text-xl p-2'>Estado: {guia_recepcion?.estado_recepcion_label}</h5>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="productor">Productor: </label>
          <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
            <span>{guia_recepcion?.nombre_productor}</span>
          </div>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="camionero">Chofer: </label>
          <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
            <span>{guia_recepcion?.nombre_camionero}</span>
          </div>

        </div>

        <div className='md:row.start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="camion">Camion: </label>
          <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
            <span>{guia_recepcion?.nombre_camion}</span>
          </div>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="comercializador">Comercializador: </label>
          <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
            <span>{guia_recepcion?.comercializador}</span>
          </div>
        </div>

        <div className='md:col-span-2  2 md:col-start-3 md:flex-col items-center justify-center'>
          <label htmlFor="mezcla_variedades">Mezcla Variedades: </label>

          <div className={`w-full h-12  ${isDarkTheme ? 'bg-[#27272A]' : 'bg-gray-100'} rounded-md flex items-center justify-center relative`}>
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
                    disabled />
                );
              })}
            </RadioGroup>
          </div>
        </div>

        <div className='md:col-span-2  md:col-start-5 md:flex-col items-center'>
          <label htmlFor="numero_guia_productor">N° Guia Productor: </label>
          <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
            <span>{guia_recepcion?.numero_guia_productor}</span>
          </div>
        </div>

        {
          guia_recepcion?.tara_camion_2
            ? (
              <div className='md:row-start-4 md:col-span-2  md:col-start-3 md:flex-col items-center'>
                <label htmlFor="numero_guia_productor">N° Guia Productor: </label>
                <Input
                  type='text'
                  name='numero_guia_productor'
                  onChange={formik.handleChange}
                  className='py-3'
                  value={formik.values.numero_guia_productor!}
                  disabled
                />
              </div>  
              )
            : null
        }
      </form>

      {
        nuevoLote
          ? null
          : guia_recepcion?.mezcla_variedades
              ? (
                <div className='w-full flex ml-6 gap-5'>
                  <div
                    onClick={() => setNuevoLote(prev => !prev)}
                    className=' bg-blue-400 w-32 flex items-center justify-center rounded-md p-2 cursor-pointer hover:scale-105'>
                    <span className='text-white'>Agregar Lote</span>
                  </div>

                  {
                    (guia_recepcion.lotesrecepcionmp.length >= 2 && usuarioRole.area === 'Recepcion' && guia_recepcion.estado_recepcion === '3')
                      ? (
                        <div
                          onClick={() => estado_guia_update(id)}
                          className=' bg-slate-400 w-32 flex items-center justify-center rounded-md p-2 cursor-pointer hover:scale-105'>
                          <span className='text-white'>Finalizar Guia</span>
                        </div>
                        )
                      : null
                  }

                  
                </div>
                )
              : null
      }


      {
        guia_recepcion?.estado_recepcion === '4'
          ? <FooterDetalleGuiaFinalizada data={guia_recepcion!} refresh={setRefresh}/>
          : nuevoLote
              ? <FooterFormularioEdicionGuia data={guia_recepcion!} variedad={guia_recepcion?.mezcla_variedades!} detalle={setNuevoLote} refresh={setRefresh} />
              : <FooterDetalleGuia data={guia_recepcion!} refresh={setRefresh}/>

      }
    </div>
  )
}

export default DetalleGuia 
