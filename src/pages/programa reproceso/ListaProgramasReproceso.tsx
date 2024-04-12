import { useAuth } from '../../context/authContext'
import { useAuthenticatedFetch } from '../../hooks/useAxiosFunction'
import { TProduccion, TProductor, TReprocesoProduccion } from '../../types/registros types/registros.types'
import TablaProgramasReproceso from './Tabla/TablaProgramas'
import TablaProgramas from './Tabla/TablaProgramas'
import TablaProductor from './Tabla/TablaProgramas'




const ListaProgramas = () => {
  const { authTokens, validate } = useAuth()
  const { data: programas_reproceso , setData, loading, setRefresh } = useAuthenticatedFetch<TReprocesoProduccion[]>(
    authTokens,
    validate,
    `/api/reproceso/`
  )

  console.log(programas_reproceso)

  return (
    <div className='h-full'>
      <TablaProgramasReproceso data={programas_reproceso ? programas_reproceso : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaProgramas
