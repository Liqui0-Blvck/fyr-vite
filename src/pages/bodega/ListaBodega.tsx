import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import { TCamion, TPatioTechadoEx } from "../../types/registros types/registros.types"
import TablaBodega from "./Tabla Bodega/TablaBodega"

const ListaCamiones = () => {
  const { authTokens, validate } = useAuth()
  const { data: patio_techado, setData, setRefresh } = useAuthenticatedFetch<TPatioTechadoEx[]>(
    authTokens,
    validate,
    `/api/patio-techado-ex/`
  )


  return (
    <div className="h-full">
      <TablaBodega data={patio_techado ? patio_techado : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaCamiones
