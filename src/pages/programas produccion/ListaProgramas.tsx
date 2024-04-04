import { useAuth } from '../../context/authContext'
import { useAuthenticatedFetch } from '../../hooks/useAxiosFunction'
import { TProduccion, TProductor } from '../../types/registros types/registros.types'
import TablaProductor from './Tabla/TablaProgramas'




const ListaProgramas = () => {
  const { authTokens, validate } = useAuth()
  const { data: programas_produccion , setData, loading, setRefresh } = useAuthenticatedFetch<TProduccion[]>(
    authTokens,
    validate,
    `/api/produccion/`
  )
  return (
    <div className='h-full'>
      <TablaProductor data={programas_produccion ? programas_produccion : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaProgramas
