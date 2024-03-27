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
import { CCMuestrasLoteFunction, CCPepaLote, TCamion, TControlCalidad, TControlCalidadB, TEnvaseEnGuia, TEnvases, TFotosCC, TGuia, TLoteGuia, TPepaMuestra, TPerfil, TProductor, TRendimientoMuestra, TUsuario } from '../../../types/registros types/registros.types'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../services/url_number'
import { format } from '@formkit/tempo'
import { tipoFrutaFilter, variedadFilter } from '../../../constants/options.constants'
import { Image } from 'antd';
import ModalRegistro from '../../../components/ModalRegistro'
import FormularioCCRendimiento from '../../control calidad/Formulario CC Rendimiento/FormularioCCRendimiento'
import ModalConfirmacion from '../../../components/ModalConfirmacion'
import FormularioCCPepaCalibre from '../../control calidad/Formulario Calibres/FormularioCalibres'
import { FaPlus } from 'react-icons/fa6'
import PieChart from '../../../components/charts/PieChart'
import TablaMuestrasDetalle from '../Tablas/TablaMuestras/TablaMuestrasDetalle'

interface IMuestraProps {
  muestra: TRendimientoMuestra | null
}

const DetalleCCRendimiento: FC<IMuestraProps> = ({ muestra }) => {
  const { isDarkTheme } = useDarkMode();
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate } = useAuth()
  const [openModalRegistro, setOpenModalRegistro] = useState<boolean>(false)
  const [openModalCPepaCalibre, setOpenModalCPepaCalibre] = useState<boolean>(false)
  const [openConfirmacion, setOpenConfirmacion] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)


  const { data: control_calidad, setRefresh } = useAuthenticatedFetch<TControlCalidadB>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id}`
  ) 

  console.log(control_calidad?.control_rendimiento)


  const { data: usuario } = useAuthenticatedFetch<TPerfil>(
    authTokens,
    validate,
    `/api/registros/perfil/${muestra?.registrado_por}`
    
  )

  type Elemento = {
    peso_muestra: number,
    basura: number,
    pelon: number,
    cascara: number,
    pepa_huerto: number,
    pepa: number,
    ciega: number
  };

  let valores: number[]
  let labels: string[]


  const { data: cc_muestra_lote } = useAuthenticatedFetch<CCMuestrasLoteFunction[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id[0]}/cc_muestras_lotes`
  );

  const muestra_lote = cc_muestra_lote ? [...cc_muestra_lote] : [];

  if (muestra_lote.length > 0) {
    const { cc_lote, pepa_bruta, ...restoMuestraLote } = muestra_lote[0];

    const labels_pre = Object.keys(restoMuestraLote || {});
    valores = Object.values(restoMuestraLote || {});

    const total = valores.reduce((acc, curr) => acc + curr, 0);

    labels = labels_pre.map((label, index) => {
      const porcentaje = (valores[index] / total) * 100;
      return `${label}: ${porcentaje.toFixed(1)}%`;
    });
  } else {
    console.log('El array muestra_lote está vacío.');
  }

  let valores_pepa: number[]
  let labels_pepa: string[]

  const { data: cc_pepa_lote } = useAuthenticatedFetch<CCPepaLote[]>(
    authTokens,
    validate,
     `/api/control-calidad/recepcionmp/${id[0]}/cc_pepa_lote`
  )

  const pepa_lote = cc_pepa_lote ? [...cc_pepa_lote] : [];

  if (pepa_lote.length > 0) {
    const {...restoMuestraLote } = pepa_lote[0];

    const labels_pre_pepa = Object.keys(restoMuestraLote || {});
    valores_pepa = Object.values(restoMuestraLote || {});

    const total = valores_pepa.reduce((acc, curr) => acc + curr, 0);

    labels = labels_pre_pepa.map((label, index) => {
      const porcentaje = (valores[index] / total) * 100;
      return `${label}: ${porcentaje.toFixed(1)}%`;
    });
  } else {
    console.log('El array muestra_lote está vacío.');
  }

  return (
    <div className={`grid grid-rows-10 md:grid md:grid-rows-7 gap-x-3 h-full w-[95%] mx-auto
         ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-50' } relative px-5 py-2
        place-items-center gap-2
        rounded-md`}
    >
      <div className={`w-full col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } h-20 flex items-center justify-center rounded-md`}>
        <h1 className='text-3xl'>Control de rendimiento para el Lote N° { muestra?.cc_recepcionmp}</h1>
      </div>

      <article className={`row-start-2 col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } w-full h-full flex md:flex-row lg:flex-row justify-between items-center gap-x-10 mx-auto`}>
        <div className='sm:w-full md:5/12 lg:5/12 justify-between h-20 flex rounded-md gap-x-4'>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4 font-semibold'>Muestra Registrada por:</span> 
            <span className='font-semibold text-xl'>{usuario?.user.username} | {usuario?.cargos.map((cargo) => cargo.cargo_label)}</span>
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

      <article className={`row-start-4 row-span-4 col-span-3 w-full h-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } flex  justify-between `}>
        <div className='flex flex-col gap-5 w-full'>

          <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex items-center justify-between rounded-md py-1`}>
            <div className='w-6/12'>
              <PieChart  series={valores! || []} labels={labels! || []}/>
            </div>
            <div className='w-full'>
              <TablaMuestrasDetalle data={control_calidad?.control_rendimiento! || []}/>
            </div>
          </div>

          <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex items-center justify-between rounded-md py-1`}>
            <div className='w-6/12'>
              <PieChart  series={valores || []} labels={labels || []}/>
            </div>
            <div className='w-full'>
              <TablaMuestrasDetalle data={control_calidad?.control_rendimiento! || []}/>
            </div>
          </div>

          <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex items-center justify-between rounded-md py-1`}>
            <div className='w-6/12'>
              <PieChart  series={valores || []} labels={labels || []}/>
            </div>
            <div className='w-full'>
              <TablaMuestrasDetalle data={control_calidad?.control_rendimiento! || []}/>
            </div>
          </div>

          {/* <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col rounded-md py-1`}>

            <span className='text-xl h-12'>Control de Pepa</span>
            {
              muestra?.cc_ok === true
                ? (
                  <>
                  <div className='w-full flex gap-2'>
    
                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Mezcla variedades: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.muestra_variedad} = {`${(cc_rendimiento_c?.muestra_variedad! / muestra?.peso_muestra! * 100).toFixed(2)} %`} </span>
                      </div>
                    </div>
                    
                    <div className='w-full h-full'>
                      <label htmlFor="rut_productor">Daño Insecto: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.daño_insecto} = {`${(cc_rendimiento_c?.daño_insecto! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full'>
                      <label htmlFor="rut_productor">Hongo: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.hongo} = {`${(cc_rendimiento_c?.hongo! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Dobles: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.doble} = {`${(cc_rendimiento_c?.doble! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>
                  </div>

                  <div className='w-full flex gap-2'>
                    
                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Cascara: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.fuera_color} = {`${(cc_rendimiento_c?.fuera_color! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Cascara: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.vana_deshidratada} = {`${(cc_rendimiento_c?.vana_deshidratada! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>

                    <div className='w-full h-full flex flex-col '>
                      <label htmlFor="rut_productor">Cascara: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.punto_goma} = {`${(cc_rendimiento_c?.punto_goma! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
                      </div>
                    </div>
                    
                    <div className='w-full h-full'>
                      <label htmlFor="rut_productor">Pepa Huerto: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.goma} = {`${(cc_rendimiento_c?.goma! / muestra?.peso_muestra! * 100).toFixed(2)} %`}</span>
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
                      <label htmlFor="rut_productor">Peso Muestra Calibrar: </label>
                      <div className={`${isDarkTheme ? 'bg-zinc-700 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                        <span className='text-xl'>{cc_rendimiento_c?.peso_muestra_calibre} </span>
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
          </div> */}
          
        </div>
      </article>
    </div>

  )
}

export default DetalleCCRendimiento
