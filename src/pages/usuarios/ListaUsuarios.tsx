import { useAuth } from '../../context/authContext'
import { useAuthenticatedFetch } from '../../hooks/useAxiosFunction'
import { TPerfil, TProductor } from '../../types/registros types/registros.types'
import TablaProductor from './Tabla/TablaProgramas'




const ListaProgramas = () => {
  const { authTokens, validate } = useAuth()
  const { data: perfiles, setData, loading, setRefresh } = useAuthenticatedFetch<TPerfil[]>(
    authTokens,
    validate,
    `/api/registros/perfil`
  )

  console.log(perfiles)

  return (
    <div className='h-full'>
      {/* <TablaProductor data={productores ? productores : []} refresh={() => setRefresh} /> */}
    </div>
  )
}

export default ListaProgramas
