import { useAuth } from '../../context/authContext'
import { useAuthenticatedFetch } from '../../hooks/useAxiosFunction'
import TablaProductor from './Tabla/TablaProductor'
import CustomerListPage from './Tabla/TablaProductor'


interface IProductor {
  id: number,
  rut_productor: string,
  nombre: string,
  telefono: string,
  region: number,
  provincia: number,
  comuna: number,
  direccion: string,
  movil: string,
  pagina_web: string,
  email: string,
  fecha_creacion: string,
  numero_contrato: number,
  usuarios: []
}


const ListaProductores = () => {
  const { authTokens, validate } = useAuth()
  const { data: productores, setData, loading, setRefresh } = useAuthenticatedFetch<IProductor[]>(
    authTokens,
    validate,
    `/api/productores/`
  )

  return (
    <div className=''>
      <TablaProductor data={productores ? productores : []} refresh={setRefresh} />
    </div>
  )
}

export default ListaProductores