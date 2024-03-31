import { useAuth } from '../../context/authContext'
import { useAuthenticatedFetch } from '../../hooks/useAxiosFunction'
import { TProductor } from '../../types/registros types/registros.types'
import TablaProductor from './Tabla/TablaProgramas'




const ListaProgramas = () => {
  const { authTokens, validate } = useAuth()
  const { data: productores, setData, loading, setRefresh } = useAuthenticatedFetch<TProductor[]>(
    authTokens,
    validate,
    `/api/productores/`
  )

  return (
    <div className='h-full'>
      <TablaProductor data={productores ? productores : []} refresh={() => setRefresh} />
    </div>
  )
}

export default ListaProgramas
