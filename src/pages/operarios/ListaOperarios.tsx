import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import { TOperarios } from "../../types/registros types/registros.types"
import TablaOperarios from "./Tabla/TablaOperarios"

const ListaOperarios = () => {
  const { authTokens, validate } = useAuth()
  const { data: operarios, setData, setRefresh } = useAuthenticatedFetch<TOperarios[]>(
    authTokens,
    validate,
    `/api/registros/operarios/`
  )
  return (
    <div className='h-full'>
      <TablaOperarios data={operarios ? operarios : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaOperarios
