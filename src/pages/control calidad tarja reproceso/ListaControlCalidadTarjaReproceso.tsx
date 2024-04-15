import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import { TControlCalidad, TControlCalidadTarja, TGuia } from "../../types/registros types/registros.types"
import TablaControlCalidadTarja from "./Tabla/TablaControlCalidadTarja"


const ListaControlCalidadReproceso = () => {
  const { authTokens, validate } = useAuth()
  const { data: control_calidad_tarja, setData, loading, setRefresh } = useAuthenticatedFetch<TControlCalidadTarja[]>(
    authTokens,
    validate,
    `/api/reproceso/cdc-tarjaresultante`
  )

  return (
    <div className="h-full">
      <TablaControlCalidadTarja data={control_calidad_tarja ? control_calidad_tarja : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaControlCalidadReproceso
