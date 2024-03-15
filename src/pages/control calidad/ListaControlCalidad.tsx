import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import { TControlCalidad, TGuia } from "../../types/registros types/registros.types"
import TablaControlCalidad from "./Tabla/TablaControlCalidad"
// import TablaGuiaRecepcion from "./Tabla/TablaGuiaRecepcion"


const ListaControlCalidad = () => {
  const { authTokens, validate } = useAuth()
  const { data: control_calidad, setData, loading, setRefresh } = useAuthenticatedFetch<TControlCalidad[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp`
  )

  console.log(control_calidad)

  return (
    <div className="h-full">
      <TablaControlCalidad data={control_calidad ? control_calidad : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaControlCalidad
