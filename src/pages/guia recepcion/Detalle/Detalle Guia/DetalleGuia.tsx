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
import React, { Dispatch, FC, SetStateAction, SyntheticEvent, useEffect, useState } from 'react'
import { ACTIVO, ESTADO_CONTROL, usuarioRole } from '../../../../utils/select.constanst'

import Radio, { RadioGroup } from '../../../../components/form/Radio'
import { urlNumeros } from '../../../../services/url_number'
import FooterDetalleGuia from './FooterDetalleGuia'
import FooterFormularioEdicionGuia from '../../Formulario Registro/Registro Tara/FooterFormularioEdicionGuiaRecepcion'
import FooterDetalleGuiaFinalizada from './FooterDetalleGuiaFinalizada'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { Tabs, Typography } from '@mui/material'
import ModalConfirmacion from '../../../../components/ModalConfirmacion'
import ModalRegistro from '../../../../components/ModalRegistro'
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import FooterDetalleRechazado from './FooterDetalleRechazado'
import Button from '../../../../components/ui/Button'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import Label from '../../../../components/form/Label'
import { cargolabels } from '../../../../utils/generalUtils'


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const DetalleGuia = () => {
  const { authTokens, validate, userID, perfilData } = useAuth()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const [nuevoLote, setNuevoLote] = useState<boolean>(false)
  const [guiaID, setGuiaID] = useState<number | null>(null)
  const [variedad, setVariedad] = useState<boolean>(false)
  const [datosGuia, setDatosGuia] = useState<TGuia | null>(null)
  const [confirmacionCierre, setConfirmacionCierre] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()

  const [editar, setEditar] = useState<boolean>(false)



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
        const res = await fetch(`${base_url}/api/recepcionmp/${id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: JSON.stringify({
            ...values,
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
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}` 
      },
      body: JSON.stringify({
        estado_recepcion: 4
      })
    })

    if (res.ok) {
      toast.success('Guia Finalizada')
      setRefresh(true)
    } else {
      toast.error('No se pudo finalizar la guia')
    }
  }


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

  useEffect(() => {
    if (confirmacionCierre){
      estado_guia_update(guia_recepcion?.id)
    }
  }, [confirmacionCierre])


  const [value, setValue] = useState(0);
  const [valueConditional, setValueConditional] = useState(1)
  const cargoLabels = perfilData?.cargos.map(cargo => cargo.cargo_label) || [];


  const handleChange = (event: SyntheticEvent, newValue: number) => {
    const lote_rechazado = guia_recepcion?.estado_recepcion === '4'
    lote_rechazado 
      ? setValueConditional(newValue)
      : setValue(newValue);
    
  };

  console.log(cargoLabels)

  const controles = guia_recepcion?.lotesrecepcionmp.some((lote: TLoteGuia) => {
    return control_calidad?.filter(control => control.recepcionmp === lote.id && (control.estado_cc === '1' || control.estado_cc === '0')).length;
  })


  const { data: conductores } = useAuthenticatedFetch<TConductor[]>(
    authTokens,
    validate,
    '/api/registros/choferes'
  )

  const conductoresFilter = conductores?.map((conductor: TConductor) => ({
    value: String(conductor.id),
    label: conductor.nombre + ' ' + conductor.apellido
  })) ?? []

  const optionsConductor: TSelectOptions | [] = conductoresFilter



  return (
    <div className={`dark:bg-zinc-900 bg-zinc-50 h-full px-5`}>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3 gap-y-10 dark:bg-zinc-900 bg-zinc-50 px-5 py-2 rounded-md relative`}
      >
        {
          cargolabels(perfilData).includes('RecepcionMP', 'Administrador')
            ? (
              <>
                {
                  !editar
                    ? (
                      <Button
                        color='sky'
                        variant='solid'
                        className='absolute top-28 right-10'
                        onClick={() => setEditar(true)}>
                        Editar
                      </Button>
                    )
                    : (
                      <Button
                        color='sky'
                        variant='solid'
                        className='absolute top-28 right-10'
                        onClick={() => {
                          formik.handleSubmit()
                          setEditar(false)
                          setRefresh(true)
                        }}
                        >
                        Guardar
                      </Button>
                    )
                }
              </>
            )
            : null
        }
        
        <div className={`${isDarkTheme ? 'bg-zinc-800' : 'bg-[#F4F4F5] '} rounded-md col-span-6 bg-[#F4F4F5]`}>
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

          {
            editar
              ? (
                <>
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
                        className='h-12'
                        onBlur={formik.handleBlur}
                        value={optionsConductor.find(con => con?.value === String(formik.values.camionero))}
                        onChange={(value: any) => {
                          formik.setFieldValue('camionero', value.value)
                        }}
                      />
                    </FieldWrap>
                  </Validation>
                </>
                )
              : (
               <>
                <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                  <span>{guia_recepcion?.nombre_camionero}</span>
                </div>
               </>
              )
          }

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
            <span>{guia_recepcion?.nombre_comercializador}</span>
          </div>
        </div>

        <div className='md:col-span-2  2 md:col-start-3 md:flex-col items-center justify-center'>
          <label htmlFor="mezcla_variedades">Mezcla Variedades: </label>

          <div className={`w-full h-12  ${isDarkTheme ? 'bg-[#27272A]' : 'bg-gray-100'} rounded-md flex items-center justify-center relative mt-0.5`}>
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

        <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="numero_guia_productor">N° Guia Productor: </label>
          {
            editar
              ? (
                <>
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
                </>
                )
              : (
                <>
                  <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                    <span>{guia_recepcion?.numero_guia_productor}</span>
                  </div>
                </>
                )
          }
        </div>


      </form>


      {
        guia_recepcion?.lotesrecepcionmp.length === 0
          ? (
            <div
              onClick={() => setNuevoLote(prev => !prev)}
              className='bg-blue-400 w-32 flex items-center justify-center rounded-md p-2 cursor-pointer hover:scale-105 relative left-5 top-2'>
              <span className='text-white'>Agregar Lote</span>
            </div>
          )
          : null
      }


      {
        nuevoLote
          ? null
          : guia_recepcion?.mezcla_variedades && guia_recepcion?.estado_recepcion !== '4' && cargoLabels.includes('RecepcionMP')
            ? (
              <div className='w-full flex ml-6 gap-5'>
                {
                  controles
                    ? (
                      <div
                        onClick={() => setNuevoLote(prev => !prev)}
                        className='bg-blue-400 w-32 flex items-center justify-center rounded-md p-2 cursor-pointer hover:scale-105'>
                        <span className='text-white'>Agregar Lote</span>
                      </div>
                    )
                    : null
                }



                {
                  guia_recepcion?.lotesrecepcionmp.every(lote => lote.estado_recepcion >= '6') 
                    ? (
                      <ModalRegistro
                        open={open || false}
                        setOpen={setOpen}
                        title={'Finalizar Guía'}
                        textTool='Detalle'
                        size={450}
                        width={`w-52 h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                        textButton='Finalizar Guía'
                        
                      >
                        <ModalConfirmacion 
                            id={id[0]}
                            mensaje='¿Quieres Finalizar La Guia'
                            confirmacion={confirmacionCierre}
                            setConfirmacion={setConfirmacionCierre}
                            setOpen={setOpen}
                            refresh={setRefresh} />
                      </ModalRegistro>
                          )
                          
                    :  guia_recepcion.estado_recepcion > '2' 
                    ? (
                      <>
                        <ModalRegistro
                          open={open || false}
                          setOpen={setOpen}
                          title={'Finalizar Guía'}
                          textTool='Detalle'
                          size={450}
                          width={`w-52 h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                          textButton='Finalizar Guía'
                        >
                          <ModalConfirmacion 
                            id={id[0]}
                            mensaje='¿Quieres Finalizar La Guia'
                            confirmacion={confirmacionCierre}
                            setConfirmacion={setConfirmacionCierre}
                            setOpen={setOpen}
                            refresh={setRefresh} />
                        </ModalRegistro>
                      </>
      
                    )
                    : null
                }


              </div>
            )
            : null
      }



      {
        nuevoLote
          ? <FooterFormularioEdicionGuia data={guia_recepcion!} variedad={guia_recepcion?.mezcla_variedades!} detalle={setNuevoLote} refresh={setRefresh} />
          : (
            <div className='mt-5'>
              <Box sx={{ width: '100%'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', paddingTop: 2 }}>
                  <Tabs value={guia_recepcion?.estado_recepcion === '4' ? valueConditional : value}  onChange={handleChange}>
                    { guia_recepcion?.estado_recepcion !== '4' ? <Tab label="Lotes Pendientes" {...a11yProps(0)} className={`${isDarkTheme ? 'light' : 'dark'}`} /> : null}
                    <Tab label="Lotes Aprobados" {...a11yProps(1)} className={`${isDarkTheme ? 'light' : 'dark'}`} />
                    <Tab label="Lote Rechazado" {...a11yProps(2)}  className={`${isDarkTheme ? 'light' : 'dark'}`}/>
                  </Tabs>
                </Box>
                {
                  guia_recepcion?.estado_recepcion !== '4'
                    ? (
                      <CustomTabPanel value={value} index={0} >
                        <FooterDetalleGuia data={guia_recepcion!} refresh={setRefresh} />
                      </CustomTabPanel>
                      )
                    : null
                }
                <CustomTabPanel value={guia_recepcion?.estado_recepcion === '4' ? valueConditional : value} index={guia_recepcion?.estado_recepcion === '4' ? 0 : 1}>
                  <FooterDetalleGuiaFinalizada data={guia_recepcion!} refresh={setRefresh} />
                </CustomTabPanel>
                <CustomTabPanel value={guia_recepcion?.estado_recepcion === '4' ? valueConditional : value} index={guia_recepcion?.estado_recepcion === '4' ? 1 : 2}>
                  <FooterDetalleRechazado data={guia_recepcion!} refresh={setRefresh}/>
                </CustomTabPanel>
              </Box>
            </div>
          )
      }
    </div>
  )
}

export default DetalleGuia 
