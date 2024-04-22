import Input from '../../../components/form/Input'
import { useState } from 'react'
import toast from 'react-hot-toast'
import SelectReact from '../../../components/form/SelectReact'
import Textarea from '../../../components/form/Textarea'
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TControlCalidad, TGuia, TPepaMuestra, TPerfil, TRendimientoMuestra } from '../../../types/registros types/registros.types'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../services/url_number'
import TablaMuestras from '../Tabla Muestra/TablaMuestras'
import ModalRegistro from '../../../components/ModalForm.modal'
import FormularioCCRendimiento from '../Formulario CC Rendimiento/FormularioCCRendimiento'
import ModalConfirmacion from '../../../components/ModalConfirmacion'
import FormularioCCPepaCalibre from '../Formulario Calibres/FormularioCalibres'


const DetalleCCPepa = () => {
  const { isDarkTheme } = useDarkMode();
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate } = useAuth()
  const [openModalRegistro, setOpenModalRegistro] = useState<boolean>(false)
  const [openModalCPepaCalibre, setOpenModalCPepaCalibre] = useState<boolean>(false)
  const [openConfirmacion, setOpenConfirmacion] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)


  const { data: control_calidad } = useAuthenticatedFetch<TControlCalidad>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id[0]}`
  )

  const { data: guia_recepcion } = useAuthenticatedFetch<TGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${control_calidad?.guia_recepcion}`
  )

  const { data: muestra } = useAuthenticatedFetch<TRendimientoMuestra>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${control_calidad?.id!}/muestras/${id[1]}`
  )

  const { data: cc_rendimiento, setRefresh } = useAuthenticatedFetch<TPepaMuestra[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${control_calidad?.id!}/muestras/${id[1]}/cdcpepa/`
  )

  const muestraa = cc_rendimiento ? [...cc_rendimiento] : []


  const muestrasCompletas = cc_rendimiento?.
    filter(cc_pepa => cc_pepa.cc_recepcionmp = control_calidad?.id!).
    every(cc_pepa => cc_pepa.cc_ok === true )



  const { data: usuario } = useAuthenticatedFetch<TPerfil>(
    authTokens,
    validate,
    `/api/registros/perfil/${muestra?.registrado_por}`
  )

  const cc_rendimiento_c = [...(cc_rendimiento || [])].shift()


  console.log("Soy la muestra que buscas", muestra)
  



  return (
    <div className={`grid grid-rows-7 md:grid md:grid-rows-7 gap-x-3 h-full w-[95%] mx-auto
         ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-50' } relative px-5 py-2
        place-items-center gap-2
        rounded-md`}
    >
      <div className={`w-full col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } h-20 flex items-center justify-center rounded-md`}>
        <h1 className='text-3xl'>Detalle Muestra N° {muestra?.id} para el Lote N° { muestra?.cc_recepcionmp}</h1>
      </div>

      <article className={`row-start-2 col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } w-full h-full flex md:flex-row lg:flex-row justify-between items-center gap-x-10 mx-auto`}>
        <div className='sm:w-full md:5/12 lg:5/12 justify-between h-20 flex rounded-md gap-x-4'>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4 font-semibold'>Muestra Registrada por:</span> 
            <span className='font-semibold text-xl truncate w-40'>{usuario?.user.username} | {usuario?.cargos.map((cargo) => cargo.cargo_label)}</span>
          </div>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full  rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4'>Muestra del lote:</span> 
            <span className='font-semibold text-xl ml-2'>N° {muestra?.id}</span>
          </div>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full  rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4'>Peso Total de Muestra:</span>
            <span className='font-semibold text-xl'>{muestra?.peso_muestra.toFixed(1)} grs</span>
          </div>
        </div>
      </article>

      <article className={`row-start-4 row-span-5 col-span-3 w-full h-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } flex  justify-between `}>
        <div className='flex flex-col gap-5 w-full'>

          <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col rounded-md py-1`}>

            <span className='text-xl h-12'>Información Muestra</span>
            <div className='w-full flex gap-2'>
              
              <div className='w-full h-full flex flex-col '>
                <label htmlFor="rut_productor">Basura: </label>
                <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                  <span className='text-xl'>{muestra?.basura} = {`${(muestra?.basura! / muestra?.peso_muestra! * 100).toFixed(2)} %`} </span>
                </div>
              </div>
              
              <div className='w-full h-full'>
                <label htmlFor="rut_productor">Pelón: </label>
                <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                  <span className='text-xl'>{muestra?.pelon} = {`${(muestra?.pelon! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                </div>
              </div>

              <div className='w-full h-full'>
                <label htmlFor="rut_productor">Ciega: </label>
                <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                  <span className='text-xl'>{muestra?.ciega} = {`${(muestra?.ciega! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                </div>
              </div>
            </div>

            <div className='w-full flex gap-2'>
              
              <div className='w-full h-full flex flex-col '>
                <label htmlFor="rut_productor">Cascara: </label>
                <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                  <span className='text-xl'>{muestra?.cascara} = {`${(muestra?.cascara! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                </div>
              </div>
              
              <div className='w-full h-full'>
                <label htmlFor="rut_productor">Pepa Huerto: </label>
                <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                  <span className='text-xl'>{muestra?.pepa_huerto} = {`${(muestra?.pepa_huerto! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                </div>
              </div>

              

            </div>
          </div>

          <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col rounded-md py-1`}>

            <div className='flex justify-between items-center'>
              <span className='text-xl h-12 w-full '>Control de Pepa</span>
              <div className='w-full h-20 flex flex-col '>
                <label htmlFor="rut_productor">Pepa Bruta: </label>
                <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                  <span className='text-xl'>{muestra?.pepa} grs</span>
                </div>
              </div>
            </div>
            {
              muestra?.cc_ok === true
                ? (
                  <>
                  <div className='w-full flex gap-2'>
    
                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Mezcla variedades: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.muestra_variedad} = {`${(cc_rendimiento_c?.muestra_variedad! / muestra?.pepa! * 100).toFixed(2)} %`} </span>
                      </div>
                    </div>
                    
                    <div className='w-full h-full'>
                      <label htmlFor="rut_productor">Daño Insecto: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.daño_insecto} = {`${(cc_rendimiento_c?.daño_insecto! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full'>
                      <label htmlFor="rut_productor">Hongo: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.hongo} = {`${(cc_rendimiento_c?.hongo! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Dobles: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.doble} = {`${(cc_rendimiento_c?.doble! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>
                  </div>

                  <div className='w-full flex gap-2'>
                    
                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Color: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.fuera_color} = {`${(cc_rendimiento_c?.fuera_color! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Vana Deshidratada: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.vana_deshidratada} = {`${(cc_rendimiento_c?.vana_deshidratada! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Punto Goma: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.punto_goma} = {`${(cc_rendimiento_c?.punto_goma! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>
                    
                    <div className='w-full h-full'>
                      <label htmlFor="rut_productor">Goma: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.goma} = {`${(cc_rendimiento_c?.goma! / muestra?.pepa! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                </div>
                  </>
                )
                : <span className='text-2xl text-center'>{muestra?.cc_ok!}</span>
            }
          </div>

          <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col rounded-md py-1`}>

            <div className='flex justify-between w-full items-center'>
              <span className='text-xl h-12 w-full '>Calibres de Pepa Sana</span>
              {muestra?.cc_calibrespepaok === true 
                ? (
                  <div className='w-full h-20 flex flex-col '>
                      <label htmlFor="rut_productor">Pepa Sana: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.peso_muestra_calibre} grs</span>
                      </div>
                    </div>
                  ) 
                : null
                }
            </div>
            {
              muestra?.cc_calibrespepaok === true
                ? (
                  <>
                  <div className='w-full flex gap-2'>
    
                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Pre Calibre: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.pre_calibre} = {`${(cc_rendimiento_c?.pre_calibre! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`} </span>
                      </div>
                    </div>
                    
                    <div className='w-full h-full'>
                      <label htmlFor="rut_productor">Calibre 18/20: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.calibre_18_20} = {`${(cc_rendimiento_c?.calibre_18_20! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full'>
                      <label htmlFor="rut_productor">Calibre 20/22: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.calibre_20_22} = {`${(cc_rendimiento_c?.calibre_20_22! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                      </div>  
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Calibre 23/25: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.calibre_23_25} = {`${(cc_rendimiento_c?.calibre_23_25! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>
                  </div>

                  <div className='w-full flex gap-2'>
                    
                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Calibre 25/27: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.calibre_25_27} = {`${(cc_rendimiento_c?.calibre_25_27! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Calibre 27/30: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.calibre_27_30} = {`${(cc_rendimiento_c?.calibre_27_30! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Calibre 30/32: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.calibre_30_32} = {`${(cc_rendimiento_c?.calibre_30_32! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>
                    
                    <div className='w-full h-full'>
                      <label htmlFor="rut_productor">Calibre 34/36: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.calibre_34_36} = {`${(cc_rendimiento_c?.calibre_34_36! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                </div>

                <div className='w-full flex gap-2'>
                    
                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Calibre 36/40: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.calibre_36_40} = {`${(cc_rendimiento_c?.calibre_36_40! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Calibre 40/Más: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.calibre_40_mas} = {`${(cc_rendimiento_c?.calibre_40_mas! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Calibre 30/32: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.calibre_30_32} = {`${(cc_rendimiento_c?.calibre_30_32! / cc_rendimiento_c?.peso_muestra_calibre! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>
                    
                  
                </div>
                  </>
                )
                : <span className='text-2xl text-center'>Aun no se ha creado la muestra de pepa</span>
            }
          </div>
          
        </div>
      </article>
    </div>

  )
}

export default DetalleCCPepa
