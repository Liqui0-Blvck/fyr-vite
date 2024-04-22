import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TCamion, TControlCalidad, TControlCalidadB, TEnvaseEnGuia, TEnvases, TFotosCC, TGuia, TLoteGuia, TPepaMuestra, TPerfil, TProductor, TRendimiento, TRendimientoMuestra, TUsuario } from '../../../types/registros types/registros.types'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../services/url_number'
import { format } from '@formkit/tempo'
import { tipoFrutaFilter, variedadFilter } from '../../../constants/options.constants'
import { Skeleton } from '@mui/material'
import ModalRegistro from '../../../components/ModalForm.modal'
import FormularioCCRendimiento from '../../control calidad/Formulario CC Rendimiento/FormularioCCRendimiento'
import ModalConfirmacion from '../../../components/ModalConfirmacion'
import FormularioCCPepaCalibre from '../../control calidad/Formulario Calibres/FormularioCalibres'
import { FaPlus } from 'react-icons/fa6'
import PieChart from '../../../components/charts/PieChart'
import TablaMuestrasDetalle from '../Tablas/TablaMuestras/TablaMuestrasDetalle'
import { chartData } from '../../../utils/ChartsData'
import TablaMuestrasDetallePepa from '../Tablas/TablaCCPepa/TablaCCPepa'
import TablaCCalibrePepa from '../Tablas/TablaCCalibrePepa/TablaCCalibre'
import TablaDetalleDescuento from '../Tablas/TablaDetalleDescuento/TablaDetalleDescuento'


const DetalleCCRendimiento = () => {
  const { isDarkTheme } = useDarkMode();
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const [rendimientos, setRendimientos] = useState<TRendimiento | null>(null)

  const { data: control_calidad, loading, setRefresh } = useAuthenticatedFetch<TControlCalidadB>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id}`
  ) 

  const { data: usuario } = useAuthenticatedFetch<TPerfil>(
    authTokens,
    validate,
    `/api/registros/perfil/${control_calidad?.control_rendimiento[0].registrado_por}`
    
  )


  useEffect(() => {
    const getRendimientos = async () => {
      const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/rendimiento_lotes/${control_calidad?.recepcionmp}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens?.access}`
        }
      })
  
      if (res.ok){
        setRendimientos(await res.json())
      } else {
        console.log("Tuve problemas")
      }
    }
  
    getRendimientos()
  }, [control_calidad])

  const { labels, valores } = chartData(rendimientos?.cc_muestra || [])
  const { labels: labels_cc_pepa, valores: valores_cc_pepa } = chartData(rendimientos?.cc_pepa || [])
  const { labels: labels_cc_calibre, valores: valores_cc_calibre } = chartData(rendimientos?.cc_pepa_calibre || [])


  return (
    <div className={`lg:grid lg:grid-rows-10 md:grid md:grid-rows-7 gap-x-3 h-full w-[90%] mx-auto
         ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-50' } relative px-5 py-2
        place-items-center lg:gap-2 md:gap-2 flex flex-col gap-10 pb-40 w-full overflow-auto
        rounded-md`}
    >
      <div className={`w-full col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } h-20 flex items-center justify-center rounded-md`}>
        <h1 className='text-3xl'>Control de rendimiento para el Lote N° {control_calidad?.recepcionmp}</h1>
      </div>

      <article className={`row-start-2 col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } w-full h-full flex md:flex-row lg:flex-row justify-between items-center gap-x-10 mx-auto`}>
        <div className='w-full md:5/12 lg:5/12 justify-between lg:h-20 flex flex-col lg:flex-row rounded-md lg:gap-x-4 gap-y-4 p-2'>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4 font-semibold'>Muestra Registrada por:</span> 
            <span className='font-semibold text-xl'>{usuario?.user.username} | {usuario?.cargos.map((cargo) => cargo.cargo_label)}</span>
          </div>
          
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full  rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4'>Muestra del lote:</span> 
            <span className='font-semibold text-xl ml-2'>N° {control_calidad?.recepcionmp}</span>
          </div>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full  rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4'>Peso Total de Muestra:</span>
            {/* <span className='font-semibold text-xl'>{cc_rendimiento?.peso_muestra} grs</span> */}
          </div>
        </div>
      </article>

      <article className={`row-start-4 row-span-4 col-span-3 w-full h-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } flex flex-col lg:flex-col  justify-between `}>
        <div className='flex flex-col gap-5 w-full'>

          {
            loading
              ? <Skeleton variant="rectengular" width='100%' height={200}/>
              : (
                <div className='flex flex-col md:flex-col w-full h-full '>
                  <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
                    <div className='lg:w-7/12 relative -top-2'>
                      <PieChart series={valores! || []} labels={labels! || []}/>
                      <p className='text-center'>Grafico Generado en promedio de GRM de muestra registrada</p>
                    </div>
                    <div className='w-full flex flex-col justify-center  mt-4 lg:mt-0'> {/* Ajusta el margen superior y las clases de posicionamiento */}
                      <h1 className='text-2xl text-center lg:text-left'>Detalle CC Pepa Bruta</h1> {/* Ajusta la alineación del texto */}
                      <TablaMuestrasDetalle data={control_calidad?.control_rendimiento || []}/>
                    </div>
                  </div>
                </div>
                    )
          }
          
          {
            loading
              ? <Skeleton variant="rectangular" width='100%' height={200}/>
              : (
                <div className='flex flex-col h-full '>
                  <h1 className='text-3xl text-center text-gray-700'>Control de Calidad Pepa Bruta </h1>
                  <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
                    <div className='w-full lg:w-7/12 relative lg:-top-2'>
                      <PieChart  series={valores_cc_pepa || []} labels={labels_cc_pepa || []}/>
                      <p className='text-center'>Grafico Generado en promedio de GRM de muestra registrada</p>
                    </div>
                    <div className='w-full flex flex-col justify-center '>
                      <h1 className='text-2xl text-center'>Detalle CC Pepa Bruta</h1>
                      <TablaMuestrasDetallePepa data={control_calidad?.control_rendimiento! || []}/>
                    </div>
                  </div>
                </div>
                )
          }
          
          {
            loading
              ? <Skeleton variant="rectangular" width='100%' height={400}/>
              : (
                  <div className='flex flex-col h-full'>
                    <h1 className='text-3xl text-center text-gray-700'>Control de Calidad Calibres Pepa</h1>
                    <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col items-center justify-center rounded-md py-2 gap-y-5`}>
                      <div className='w-full h-full flex flex-col lg:flex-row gap-y-10 py-10'>
                        <div className='w-full h-full flex flex-col items-center overflow-x-auto'>
                          <h1 className='text-2xl'>Calculo Descuento</h1>
                          <TablaDetalleDescuento data={control_calidad?.control_rendimiento! || []} ccLote={control_calidad}/>
                        </div>
                      </div>
                      <div className='w-full h-full flex flex-col  gap-y-10 py-10'>

                        <div className='w-7/12 flex flex-col gap-y-5'>
                          <PieChart series={valores_cc_calibre || []} labels={labels_cc_calibre || []}/>
                          <p className='text-center'>Grafico Generado en promedio de GRM de muestra registrada</p>
                        </div>
                        <div className='w-full flex flex-col'>
                          <h1 className='text-2xl text-center'>Detalle Calibres Pepa</h1>
                          <TablaCCalibrePepa data={control_calidad?.control_rendimiento! || []} ccLote={control_calidad}/>
                        </div>
                      </div>
                    </div>
                  </div>
                )
          }
          
        </div>
      </article>
    </div>

  )
}

export default DetalleCCRendimiento
