import { useEffect, useState } from "react"
import Button from "../../components/ui/Button"
import { useAuth } from "../../context/authContext"
// import { fetch_chris } from "../../functions/fetch_chris"

const Home = () => {
    const { refreshToken, authTokens } = useAuth()
    const [refresh, setRefresh] = useState(false)
    // const data = useAuthenticatedFetch('/api/registros/tractores/', 'GET', {})
    // console.log(data)
    return (
        <div className="h-full">
            <div className="w-full h-full flex items-center justify-center">
                <h1 className="text-7xl">Proximamente tendra informacion</h1>
            </div>
        </div>
    )
}

export default Home
