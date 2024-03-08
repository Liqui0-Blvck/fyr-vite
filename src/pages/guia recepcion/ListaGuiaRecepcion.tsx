import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import { TGuia } from "../../types/registros types/registros.types"
import TablaGuiaRecepcion from "./Tabla/TablaGuiaRecepcion"


const ListaGuiaRecepcion = () => {
  const { authTokens, validate } = useAuth()
  const { data: guia_recepcion, setData, loading } = useAuthenticatedFetch<TGuia[]>(
    authTokens,
    validate,
    `/api/recepcionmp/`
  )

  return (
    <div className="h-full">
      <TablaGuiaRecepcion data={guia_recepcion ? guia_recepcion : []}/>
    </div>
  )
}

export default ListaGuiaRecepcion
