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
import ModalRegistro from '../../../components/ModalRegistro'
import FormularioCCRendimiento from '../../control calidad/Formulario CC Rendimiento/FormularioCCRendimiento'
import ModalConfirmacion from '../../../components/ModalConfirmacion'
import FormularioCCPepaCalibre from '../../control calidad/Formulario Calibres/FormularioCalibres'
import { FaPlus } from 'react-icons/fa6'
import PieChart from '../../../components/charts/PieChart'
import { chartData } from '../../../utils/ChartsData'
import TablaMuestrasDetalle from '../../ccvistobueno/Tablas/TablaMuestras/TablaMuestrasDetalle'
import TablaOperariosPrograma from './Tabla Operarios/TablaOperariosPrograma'

interface IMuestraProps {
  muestra?: TRendimientoMuestra | null
}

const DetalleOperarioPrograma: FC<IMuestraProps> = () => {
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

  const cc_rendimiento = control_calidad && control_calidad.control_rendimiento && control_calidad.control_rendimiento.length > 0
  ? [...control_calidad.control_rendimiento].shift()
  : [];


  const { labels, valores } = chartData(rendimientos?.cc_muestra || [])
  const { labels: labels_cc_pepa, valores: valores_cc_pepa } = chartData(rendimientos?.cc_pepa || [])
  const { labels: labels_cc_calibre, valores: valores_cc_calibre } = chartData(rendimientos?.cc_pepa_calibre || [])


  return (
    <div className={`lg:grid lg:grid-rows-10 md:grid md:grid-rows-7 gap-x-3 h-full mx-auto
         ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-50' } relative px-5
        place-items-center lg:gap-2 md:gap-2 flex flex-col gap-5 pb-40 w-full overflow-auto
        rounded-md`}
    >
      <div className={`w-full col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } h-full flex items-center justify-center rounded-md`}>
        <h1 className='text-3xl'>Operarios en Programa {control_calidad?.recepcionmp}</h1>
      </div>

      <article className={`row-start-4 row-span-4 col-span-3 w-full h-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } flex flex-col lg:flex-col  justify-between `}>
        {
            loading
              ? <Skeleton variant="rectengular" width='100%' height={200}/>
              : (
                <div className='flex flex-col md:flex-col w-full h-full'>
                  <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} flex flex-col lg:flex-row items-center justify-center rounded-md`}>
                    <div className='w-full flex flex-col justify-center  mt-4 lg:mt-0'> {/* Ajusta el margen superior y las clases de posicionamiento */}
                      <TablaOperariosPrograma data={control_calidad?.control_rendimiento || []}/>
                    </div>
                  </div>
                </div>
                    )
        }
      </article>
    </div>

  )
}

export default DetalleOperarioPrograma
