import { useAuth } from '../../context/authContext'
import { useAuthenticatedFetch } from '../../hooks/useAxiosFunction'
import TablaProductores from './Tabla/TablaProductores'



const ListaProductores = () => {
  const { authTokens, validate } = useAuth()
  const { data: productores, setData, loading } = useAuthenticatedFetch(
    authTokens,
    validate,
    `/api/productores/`
  )
  
  console.log(productores)

  return (
    <div>
        <div className='flex justify-center mt-10'>
            Hola ya esto en tabla productores
            {/* <TablaProductores data={productores} setData={setData} token={authTokens?.access} loading={loading}/> */}
        </div>
    </div>
  )
}

export default ListaProductores
