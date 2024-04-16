import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TCamion, TControlCalidad, TControlCalidadB, TEnvaseEnGuia, TEnvases, TFotosCC, TGuia, TLoteGuia, TPepaMuestra, TPerfil, TProductor, TRendimiento, TRendimientoMuestra, TTarjaResultante, TUsuario } from '../../../types/registros types/registros.types'
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
import TablaTarjaResultante from './Tabla Tarja Resultante/TablaTarjaResultante'

interface IMuestraProps {
  muestra?: TRendimientoMuestra | null
}

const DetalleTarjaResultante: FC<IMuestraProps> = () => {
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

  const { data: tarja_resultante, setRefresh } = useAuthenticatedFetch<TTarjaResultante[]>(
    authTokens,
    validate,
    `/api/reproceso/${id}/tarjas_resultantes/`
  ) 


  const labels = ['Pepa Calibrada', 'Pepa Borrel', 'Residuos Solidos']
  const pepa_calibrada = tarja_resultante?.filter(tarja => tarja.tipo_resultante === '3').reduce((acc, tarja) => tarja.peso + acc, 0)
  const pepa_borrel = tarja_resultante?.filter(tarja => tarja.tipo_resultante === '1').reduce((acc, tarja) => tarja.peso + acc, 0)
  const residuo_solido = tarja_resultante?.filter(tarja => tarja.tipo_resultante === '2').reduce((acc, tarja) => tarja.peso + acc, 0)


  const valores: number[] = [pepa_calibrada!, pepa_borrel!, residuo_solido!]

  return (
    <div className={`lg:grid lg:grid-rows-10 md:grid md:grid-rows-7 gap-x-3 h-full
         dark:bg-zinc-800 bg-zinc-200 relative px-5 py-10
        place-items-center lg:gap-2 md:gap-2 flex flex-col gap-5
        rounded-md`}
    >
      <div className={`w-full col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } h-20 flex items-center justify-center rounded-md`}>
        <h1 className='text-3xl'>Control de rendimiento para el Lote N° {control_calidad?.recepcionmp}</h1>
      </div>

      <article className={`row-start-4 row-span-4 col-span-3 w-full h-full dark:bg-zinc-800  bg-zinc-100 flex flex-col lg:flex-col  justify-between pb-10 `}>
        {
            loading
              ? <Skeleton variant="rectangular" width='100%' height={350}/>
              : (
                <div className='flex flex-col md:flex-col w-full h-full'>
                  <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
                    <div className='w-7/12 '>
                      <PieChart series={valores ! || []} labels={labels! || []}/>
                      <p className='text-center'>Grafico Generado en promedio de GRM de muestra registrada</p>
                    </div>
                    <div className='w-full h-full flex flex-col justify-center  mt-4 lg:mt-0'> 
                      <TablaTarjaResultante data={tarja_resultante || []} refresh={setRefresh}/>
                    </div>
                  </div>
                </div>
                    )
        }
      </article>
    </div>

  )
}

export default DetalleTarjaResultante
