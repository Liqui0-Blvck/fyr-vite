import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import TablaComercializadores from "./Tabla/TablaComercializador"


interface IComercializador {
  id: number,
  nombre: string,
  razon_social: string,
  giro: string,
  direccion: string,
  zip_code: string,
  email_comercializador: string
}

const ListaComercializadores = () => {
  const { authTokens, validate } = useAuth()
  const { data: comercializador, setData, loading } = useAuthenticatedFetch<IComercializador[]>(
    authTokens,
    validate,
    `/api/comercializador/`
  )


  return (
    <div className='h-full'>
      <TablaComercializadores data={comercializador ? comercializador : []} />
    </div>
  )
}

export default ListaComercializadores
