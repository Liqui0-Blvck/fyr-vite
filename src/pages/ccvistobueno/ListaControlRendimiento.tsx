import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import { TControlCalidad, TControlCalidadB, TGuia, TRendimientoMuestra } from "../../types/registros types/registros.types"
import TablaControlRendimiento from "./Tablas/TablaControlRendimiento"
import TablaControlCalidad from "./Tablas/TablaControlRendimiento"
// import TablaGuiaRecepcion from "./Tabla/TablaGuiaRecepcion"


const ListaControlRendimiento = () => {
  const { authTokens, validate } = useAuth()
  const { data: control_calidad, setData, loading, setRefresh } = useAuthenticatedFetch<TControlCalidadB[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/`
  )

  console.log("control_Calidad", control_calidad)

  return (
    <div className="h-full">
      <TablaControlRendimiento data={control_calidad ? control_calidad : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaControlRendimiento
