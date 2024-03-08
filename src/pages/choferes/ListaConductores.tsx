import { useAuth } from '../../context/authContext'
import { useAuthenticatedFetch } from '../../hooks/useAxiosFunction'
import { TConductor } from '../../types/registros types/registros.types'
import TablaConductor from './Tabla/TablaConductor'

const ListaConductores = () => {
  const { authTokens, validate } = useAuth()
  const { data: conductores, setRefresh } = useAuthenticatedFetch<TConductor[]>(
    authTokens,
    validate,
    `/api/registros/choferes`
  )

  return (
    <div className='h-full'>
      <TablaConductor data={conductores ? conductores : []} refresh={setRefresh}/>
    </div>
  )
}

export default ListaConductores
