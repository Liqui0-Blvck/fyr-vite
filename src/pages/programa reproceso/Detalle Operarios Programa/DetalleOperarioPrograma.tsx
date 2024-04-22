import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TCamion, TControlCalidad, TControlCalidadB, TEnvaseEnGuia, TEnvases, TFotosCC, TGuia, TLoteGuia, TPepaMuestra, TPerfil, TProduccion, TProductor, TRendimiento, TRendimientoMuestra, TReprocesoProduccion, TUsuario } from '../../../types/registros types/registros.types'
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
import { chartData } from '../../../utils/ChartsData'
import TablaMuestrasDetalle from '../../ccvistobueno/Tablas/TablaMuestras/TablaMuestrasDetalle'
import TablaOperariosPrograma from './Tabla Operarios/TablaOperariosPrograma'

interface ITablaOperariosProduccionProps {
  programa_produccion?: TReprocesoProduccion | null
  loading: boolean
  refresh: Dispatch<SetStateAction<boolean>>
}

const DetalleOperarioPrograma: FC<ITablaOperariosProduccionProps> = ({ programa_produccion, loading, refresh }) => {
  const { isDarkTheme } = useDarkMode();


  return (
    <div className={`lg:grid lg:grid-rows-10 md:grid md:grid-rows-7 gap-x-3 h-full mx-auto
         ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-50' } relative px-5
        place-items-center lg:gap-2 md:gap-2 flex flex-col gap-5 w-full overflow-auto py-5
        rounded-md`}
    >
      <div className={`w-full col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } h-full flex items-center justify-center rounded-md`}>
        <h1 className='text-3xl'>Operarios en Programa {programa_produccion?.id}</h1>
      </div>

      <article className={`row-start-4 row-span-4 col-span-3 w-full h-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } flex flex-col lg:flex-col  justify-between pb-10`}>
        {
            loading
              ? <Skeleton variant='rectangular' width='100%' height={370}/>
              : (
                <div className='flex flex-col md:flex-col w-full h-full'>
                  <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} flex flex-col lg:flex-row items-center justify-center rounded-md`}>
                    <div className='w-full flex flex-col justify-center  mt-4 lg:mt-0'>
                      <TablaOperariosPrograma operarios={programa_produccion!.operarios || []} refresh={refresh} programa_produccion={programa_produccion!}/>
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
