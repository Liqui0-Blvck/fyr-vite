import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { TIPO_ACOPLADO } from '../../../constants/select.constanst'
import Textarea from '../../../components/form/Textarea'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TCamion, TControlCalidad, TControlCalidadB, TEnvaseEnGuia, TEnvases, TFotosCC, TGuia, TLoteGuia, TPerfil, TProductor, TRendimientoMuestra } from '../../../types/registros types/registros.types'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../services/url_number'
import { format } from '@formkit/tempo'
import { tipoFrutaFilter, variedadFilter } from '../../../constants/options.constants'
import { Image } from 'antd';
import TablaMuestras from '../Tabla Muestra/TablaMuestras'
import ModalRegistro from '../../../components/ModalRegistro'
import FormularioCCRendimiento from '../Formulario CC Rendimiento/FormularioCCRendimiento'
import ModalConfirmacion from '../../../components/ModalConfirmacion'
import FormularioCCPepaCalibre from '../Formulario Calibres/FormularioCalibres'
import { FaPlus } from 'react-icons/fa6'
import { cargolabels } from '../../../utils/generalUtils'


const DetalleCC = () => {
  const { isDarkTheme } = useDarkMode();
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate, perfilData } = useAuth()
  const [openModalRegistro, setOpenModalRegistro] = useState<boolean>(false)
  const [openModalCPepaCalibre, setOpenModalCPepaCalibre] = useState<boolean>(false)
  const [openConfirmacion, setOpenConfirmacion] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)



  const { data: control_calidad } = useAuthenticatedFetch<TControlCalidadB>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id}`
  )

  const { data: guia_recepcion } = useAuthenticatedFetch<TGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${control_calidad?.guia_recepcion}`
  )

  const { data: userData } = useAuthenticatedFetch<TPerfil>(
    authTokens,
    validate,
    `/api/registros/perfil/${control_calidad?.cc_registrado_por}`
  )

  const { data: envases } = useAuthenticatedFetch<TEnvases[]>(
    authTokens,
    validate,
    `/api/envasesmp/`
  )

  const { data: fotoscc } = useAuthenticatedFetch<TFotosCC[]>(
    authTokens,
    validate,
    `/api/fotos-cc/?search=${control_calidad?.id}`
  )


  const { data: cc_rendimiento, setRefresh } = useAuthenticatedFetch<TRendimientoMuestra[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${control_calidad?.id!}/muestras/`
  )



  const kilos_fruta = guia_recepcion?.lotesrecepcionmp.map((row: TLoteGuia) => {
    const kilos_total_envases = 
      row.envases.map((envase_lote) => {
      const envaseTotal = envases?.
      filter(envase => envase.id === envase_lote.envase).
      reduce((acumulador, envase) => acumulador + (envase_lote.cantidad_envases * envase.peso), 0)
      return envaseTotal;
      }).reduce((acumulador, pesoTotal) => acumulador! + pesoTotal!, 0)
    return row.kilos_brutos_1 + row.kilos_brutos_2 - row?.kilos_tara_1 - row?.kilos_tara_2 - kilos_total_envases!;
  })

  const variedad = guia_recepcion?.lotesrecepcionmp.flatMap((row: TLoteGuia) => {
    const variedad_row = row.envases.map((envase) => {
        const variedd = variedadFilter.find(variedad => variedad.value === envase.variedad);
        return variedd?.label;
        });
        return variedad_row;
    }).join(', ')

  const tipo_producto = guia_recepcion?.lotesrecepcionmp.flatMap((row: TLoteGuia) => {
    const variedad_row = row.envases.map((envase) => {
        const producto = tipoFrutaFilter.find(producto => producto.value === envase.tipo_producto);
        return producto?.label;
        });
        return variedad_row;
    }).join(', ')


  const muestrasCompletas = cc_rendimiento?.
    filter(cc_pepa => cc_pepa.cc_recepcionmp = control_calidad?.id!).
    every(cc_pepa => cc_pepa.cc_ok === true )

  const ccPepasCompletas = cc_rendimiento?.some((cc) => cc.cc_calibrespepaok === true)

  const muestra = [...(cc_rendimiento || [])];
  const contra_muestras_limit = cc_rendimiento?.filter(cc => cc.es_contramuestra === true).length
  const contra_muestra_ok = cc_rendimiento?.some(cc => cc.cc_ok === true && cc.es_contramuestra === true)
  const contra_muestra_calibre_ok = cc_rendimiento?.some(cc => cc.cc_calibrespepaok === true && cc.es_contramuestra === true)
  console.log(contra_muestras_limit)
  console.log("Si soy una contra muestra completada", contra_muestra_ok)
  console.log("Si soy una contra muestra calibrada", contra_muestra_calibre_ok)
  

  // console.log(cc_rendimiento)



  return (
    <div className={`flex flex-col md:grid md:grid-rows-6 gap-x-3 h-full w-[95%] mx-auto
        gap-y-5 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-50' } relative px-5 py-6
        place-items-center
        rounded-md`}
    >
      <div className={`w-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } h-full flex items-center justify-center rounded-md`}>
        <h1 className='text-3xl'>Detalle Control De Calidad Materia Prima Lote N° {control_calidad?.numero_lote}</h1>
      </div>

      <article className={`w-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } w-full h-[80%] flex flex-col md:flex-row lg:flex-row justify-between gap-20 row-span-2`}>
        <div className='sm:w-full md:5/12 lg:5/12  h-full flex flex-col rounded-md'>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} rounded-md h-full flex items-center px-2`}>
            <span className='font-semibold text-lg'><span className='mr-4'>Productor:</span> {control_calidad?.productor} </span>
          </div>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} rounded-md h-full flex items-center px-2`}>
            <span className='font-semibold text-lg'><span className='mr-4'>Estado CDC:</span> {control_calidad?.estado_cc_label}</span>
          </div>
          <div className='borderrounded-md h-full flex items-center px-2'>
            {/* <span className='font-semibold text-lg'><span className='mr-4'>Estado Actual:</span> {control_calidad?.estado_cc_label}</span> */}
          </div>
        </div>

        <div className='sm:w-full md:5/12 lg:5/12 h-full flex flex-col rounded-md'>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} rounded-md h-full flex items-center px-2`}>
            <span className='font-semibold text-lg' ><span>Fecha Creación: </span> {format(control_calidad?.fecha_creacion!, {date: 'long', time: 'short'}, 'es')}</span>
          </div>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} rounded-md h-full flex items-center px-2`}>
            <span className='font-semibold text-lg' ><span>Última modificación: </span> {format(control_calidad?.fecha_modificacion!, {date: 'long', time: 'short'}, 'es')}</span>
            
          </div>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} rounded-md h-full flex items-center px-2`}>
            <span className='font-semibold text-lg'><span className='mr-4'>Registrado Por:</span>{userData?.user.username}</span>
          </div>
        </div>
      </article>

      <article className={`w-full h-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } flex flex-col justify-between  gap-5 row-span-3`}>
        <div className='flex lg:flex-row md:flex-row flex-col gap-5'>

          <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col gap-5 rounded-md py-1`}>

            <span className='text-xl h-12'>Información lote</span>
            <div className='h-full'>
              <label htmlFor="rut_productor">Kilos Fruta: </label>
              <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                <span className='text-xl'>{control_calidad?.estado_guia === '4' ? `${kilos_fruta} kgs` : 'Falta terminar la recepcion'}</span>
              </div>
            </div>
            
            <div className='h-full'>
              <label htmlFor="rut_productor">Variedad: </label>
              <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                <span className='text-xl'>{variedad}</span>
              </div>
            </div>

            <div className='h-full'>
              <label htmlFor="rut_productor">Tipo Producto: </label>
              <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                <span className='text-xl'>{tipo_producto}</span>
              </div>
            </div>

          </div>

          <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col gap-5 rounded-md py-1`}>

            <span className='text-lg h-10'>Información Inspección Visual por Control de Calidad</span>
            <div className='h-full'>
              <label htmlFor="rut_productor">Kilos Fruta: </label>
              <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center justify-center h-12 rounded-md`}>
                <span className='text-xl'>{control_calidad?.humedad} %</span>
              </div>
            </div>
            <div className='h-full'>
              <label htmlFor="rut_productor">Observación: </label>
              <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex h-4/6 rounded-md`}>
                <span className='text-lg'>{control_calidad?.observaciones}</span>
              </div>
            </div>


          </div>

          <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col gap-5 rounded-md py-1`}>

            <span className='text-lg h-10'>Imagenes</span>
            
            
            <div className='h-full flex flex-col'>
              <div className='flex justify-between items-center'>
                <label htmlFor="rut_productor">Fotos Control Calidad: </label>
                <span>Fotos registradas {fotoscc?.length}</span>
              </div>

              <div className='flex items-center justify-center h-full'>

                <Image.PreviewGroup
                    items={
                      fotoscc?.flatMap(fotos => fotos.imagen)
                    }
                  >
                    <Image
                        width={200}
                        height={170}
                        src={fotoscc?.flatMap(fotos => fotos.imagen)[0]}
                      />
                  </Image.PreviewGroup>
              </div>
              
              
            </div>

          </div>
          
        </div>
      </article>

      <article className={`w-full h-full border flex flex-col gap-2 ${isDarkTheme ? 'border-zinc-700' : ''}  py-5`}>
        <div className='flex items-center justify-between px-8'>
          <div className='w-72'>
            {
              cc_rendimiento?.length! < 2 && cargolabels(perfilData).includes('CDC Jefatura', 'CDC Operario MP')
                ? (
                    <ModalRegistro
                      open={openModalRegistro}
                      setOpen={setOpenModalRegistro}
                      title={`Muestra Control de Rendimiento del Lote N° ${control_calidad?.numero_lote} `}
                      textTool='Editar'
                      size={900}
                      width={`w-40 px-1 h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                      textButton='Agregar Muestra'
                    >
                      <FormularioCCRendimiento id_lote={control_calidad?.id!} refresh={setRefresh} isOpen={setOpenModalRegistro} control_calidad={control_calidad!}/>
                    </ModalRegistro>
                  )
                : control_calidad?.esta_contramuestra === '1' && contra_muestras_limit! < 1
                    ? (
                      <ModalRegistro
                        open={openModalRegistro}
                        setOpen={setOpenModalRegistro}
                        title={`Contra Muestra Control de Rendimiento del Lote N° ${control_calidad?.numero_lote} `}
                        textTool='Contra Muestra'
                        size={900}
                        width={`w-56 px-1 h-12 ${isDarkTheme ? 'bg-orange-700 hover:bg-orange-600' : 'bg-orange-700 text-white'} hover:scale-105`}
                        textButton='Agregar Contra Muestra'
                      >
                        <FormularioCCRendimiento id_lote={control_calidad?.id!} refresh={setRefresh} isOpen={setOpenModalRegistro} control_calidad={control_calidad!}/>
                      </ModalRegistro>
                      )
                    : null
            }
            
          </div>


          {
            cc_rendimiento?.length! >= 2  && !cc_rendimiento?.some(cc => cc.cc_calibrespepaok === true)
              ? (
                <div className='w-72'>
                  <ModalRegistro
                    open={openModalCPepaCalibre}
                    setOpen={setOpenModalCPepaCalibre}
                    title={`Muestra Control de Rendimiento del Lote N° `}
                    textTool='CC Pepas Muestras'
                    size={800}
                    width={`w-full px-1 h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                    textButton='Calibrar Muestras'
                  >
                    <ModalConfirmacion 
                      formulario={<FormularioCCPepaCalibre  refresh={setRefresh} id_muestra={muestra.shift()?.id} isOpen={setOpenModalCPepaCalibre}/>}
                      mensaje='¿Estas seguro de querer calibrar las muestras?'
                      confirmacion={openConfirmacion}
                      setConfirmacion={setOpenConfirmacion}
                      setOpen={setOpenModalCPepaCalibre}
                      refresh={setRefresh} />
                  </ModalRegistro>
                </div>
              )
              : null
          }

          {
            control_calidad?.esta_contramuestra === '1' && contra_muestras_limit! > 0 && contra_muestra_ok && !contra_muestra_calibre_ok
            ?  (
              <div className='w-72 h-12'>
                <ModalRegistro
                  open={openModalCPepaCalibre}
                  setOpen={setOpenModalCPepaCalibre}
                  title={`Muestra Control de Rendimiento del Lote N° `}
                  textTool='CC Pepas Muestras'
                  size={800}
                  width={`w-full px-1 h-12 ${isDarkTheme ? 'bg-orange-600 hover:bg-orange-500' : 'bg-orange-600 text-white'} hover:scale-105`}
                  textButton='Calibrar Contra Muestra'
                >
                  <ModalConfirmacion 
                    formulario={<FormularioCCPepaCalibre  refresh={setRefresh} id_muestra={muestra.shift()?.id} isOpen={setOpenModalCPepaCalibre}/>}
                    mensaje='¿Estas seguro de querer calibrar las muestras?'
                    confirmacion={openConfirmacion}
                    setConfirmacion={setOpenConfirmacion}
                    setOpen={setOpenModalCPepaCalibre}
                    refresh={setRefresh} />
                </ModalRegistro>
              </div>
            )
            : null
          }
        </div>


        <TablaMuestras id_lote={control_calidad?.id!} data={cc_rendimiento!} refresh={setRefresh} control_calidad={control_calidad!} />
      </article>


    </div>

  )
}

export default DetalleCC
