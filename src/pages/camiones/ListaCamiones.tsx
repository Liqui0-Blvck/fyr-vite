import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import { TCamion } from "../../types/registros types/registros.types"
import TablaCamion from "./Tabla/TablaCamion"

const ListaCamiones = () => {
  const { authTokens, validate } = useAuth()
  const { data: camiones, setData, setRefresh } = useAuthenticatedFetch<TCamion[]>(
    authTokens,
    validate,
    `/api/registros/camiones/`
  )

  return (
    <div className="h-full">
      <TablaCamion data={camiones ? camiones : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaCamiones
