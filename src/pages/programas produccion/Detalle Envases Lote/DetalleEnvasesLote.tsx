import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TCamion, TControlCalidad, TControlCalidadB, TEnvaseEnGuia, TEnvases, TEnvasesPrograma, TFotosCC, TGuia, TLoteGuia, TPepaMuestra, TPerfil, TProductor, TRendimiento, TRendimientoMuestra, TUsuario } from '../../../types/registros types/registros.types'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../services/url_number'
import { format } from '@formkit/tempo'
import { tipoFrutaFilter, variedadFilter } from '../../../constants/options.constants'
import { Skeleton } from '@mui/material'
import ModalRegistro from '../../../components/ModalRegistro'
import FormularioCCRendimiento from '../../control calidad/Formulario CC Rendimiento/FormularioCCRendimiento'
import ModalConfirmacion from '../../../components/ModalConfirmacion'
import FormularioCCPepaCalibre from '../../control calidad/Formulario Calibres/FormularioCalibres'
import { FaPlus } from 'react-icons/fa6'
import PieChart from '../../../components/charts/PieChart'
import { chartData } from '../../../utils/ChartsData'
import TablaMuestrasDetalle from '../../ccvistobueno/Tablas/TablaMuestras/TablaMuestrasDetalle'
import TablaEnvasesLotes from './Tabla Envases Lotes/TablaEnvasesLotes'

interface IMuestraProps {
  muestra?: TRendimientoMuestra | null
}

const DetalleEnvasesLote: FC<IMuestraProps> = () => {
  const { isDarkTheme } = useDarkMode();
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const [rendimientos, setRendimientos] = useState<TRendimiento | null>(null)

  const { data: control_calidad, loading } = useAuthenticatedFetch<TControlCalidadB>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id}`
  ) 

  const { data: envases_produccion, setRefresh } = useAuthenticatedFetch<TEnvasesPrograma[]>(
    authTokens,
    validate,
    `/api/produccion/${id}/lotes_en_programa/`
  ) 

  const labels = ['Envases procesados', 'Envases Por Procesar']
  const totalEnvases = envases_produccion?.length;
  const envasesProcesados = envases_produccion?.filter(envase => envase.bin_procesado === true).length;
  const envasesPorProcesar = totalEnvases! - envasesProcesados!;
  
  const porcentajeProcesados = ((envasesProcesados! / totalEnvases!) * 100)
  const porcentajePorProcesar = ((envasesPorProcesar / totalEnvases!) * 100)
  
  const valores = [porcentajeProcesados, porcentajePorProcesar];

  return (
    <div className={`lg:grid lg:grid-rows-10 md:grid md:grid-rows-7 gap-x-3 h-full relative px-5
        place-items-center lg:gap-2 md:gap-2 flex flex-col gap-5 w-full overflow-auto dark:bg-zinc-800 bg-zinc-200 py-10
        rounded-md`}
    >
      <div className={`w-full col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } h-20 flex items-center justify-center rounded-md`}>
        <h1 className='text-3xl'>Envases de Lotes por procesar del programa N° {control_calidad?.recepcionmp}</h1>
      </div>

      <article className={`row-start-4 row-span-4 col-span-3 w-full h-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } flex flex-col lg:flex-col justify-between pb-10`}>
        {
            loading
              ? <Skeleton variant="rectangular" width='100%' height={320}/>
              : (
                <div className='flex flex-col md:flex-col w-full h-full'>
                  <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
                    <div className='w-7/12 ]'>
                      <PieChart series={valores! || []} labels={labels! || []}/>
                      <p className='text-center'>Grafico Generado en promedio de GRM de muestra registrada</p>
                    </div>
                    <div className='w-full flex flex-col justify-center  mt-4 lg:mt-0'> {/* Ajusta el margen superior y las clases de posicionamiento */}
                      <TablaEnvasesLotes data={envases_produccion || []} refresh={setRefresh}/>
                    </div>
                  </div>
                </div>
                    )
        }
      </article>
    </div>

  )
}

export default DetalleEnvasesLote
