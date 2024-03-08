import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import { TEnvases } from "../../types/registros types/registros.types"
import TablaEnvases from "./Tabla/TablaEnvases"

const ListaCamiones = () => {
  const { authTokens, validate } = useAuth()
  const { data: envases, setRefresh } = useAuthenticatedFetch<TEnvases[]>(
    authTokens,
    validate,
    `/api/envasesmp/`
  )

  return (
    <div className="h-full">
      <TablaEnvases data={envases ? envases : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaCamiones
