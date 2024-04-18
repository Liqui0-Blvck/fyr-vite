import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import { TGuia } from "../../types/registros types/registros.types"
import TablaGuiaRecepcion from "./Tabla/TablaGuiaRecepcion"


const ListaGuiaRecepcion = () => {
  const { authTokens, validate, perfilData } = useAuth()
  const { data: guia_recepcion, setData, loading, setRefresh } = useAuthenticatedFetch<TGuia[]>(
    authTokens,
    validate,
    `/api/recepcionmp/`
  )

  console.log(perfilData)

  return (
    <div className="h-full">
      <TablaGuiaRecepcion data={guia_recepcion ? guia_recepcion : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaGuiaRecepcion
