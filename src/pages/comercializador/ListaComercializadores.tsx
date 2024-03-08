import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import { TComercializador } from "../../types/registros types/registros.types"
import TablaComercializadores from "./Tabla/TablaComercializador"


const ListaComercializadores = () => {
  const { authTokens, validate } = useAuth()
  const { data: comercializador, setData, setRefresh } = useAuthenticatedFetch<TComercializador[]>(
    authTokens,
    validate,
    `/api/comercializador/`
  )


  return (
    <div className='h-full'>
      <TablaComercializadores data={comercializador ? comercializador : []} refresh={setRefresh}/>
    </div>
  )
}

export default ListaComercializadores
