import { useAuth } from '../../context/authContext'
import { useAuthenticatedFetch } from '../../hooks/useAxiosFunction'
import TablaConductor from './Tabla/TablaConductor'


interface IConductor {
  id: number
  nombre: string,
  apellido: string,
  rut: string,
  telefono: string
}


const ListaConductores = () => {
  const { authTokens, validate } = useAuth()
  const { data: conductores, setData, loading } = useAuthenticatedFetch<IConductor[]>(
    authTokens,
    validate,
    `/api/conductores/`
  )

  return (
    <div className=''>
      <TablaConductor data={conductores ? conductores : []} />
    </div>
  )
}

export default ListaConductores
