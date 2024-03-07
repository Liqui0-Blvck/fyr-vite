import { useAuth } from "../../context/authContext"
import { useAuthenticatedFetch } from "../../hooks/useAxiosFunction"

const Home = () => {
  const { authTokens, validate } = useAuth()

  return (
    <div>
      hola soy el home      
    </div>
  )
}

export default Home
