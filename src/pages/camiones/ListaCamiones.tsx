import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"
import TablaCamion from "./Tabla/TablaCamion"

interface ICamion {
  id: number,
  fecha_creacion: string,
  fecha_modificacion: string,
  patente: string,
  acoplado: boolean,
  observaciones: string
}

const ListaCamiones = () => {
  const { authTokens, validate } = useAuth()
  const { data: camiones, setData, loading } = useAuthenticatedFetch<ICamion[]>(
    authTokens,
    validate,
    `/api/registros/camiones/`
  )

  console.log(camiones)

  return (
    <div className="h-full">
      <TablaCamion data={camiones ? camiones : []} />
    </div>
  )
}

export default ListaCamiones
