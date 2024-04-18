import { useEffect, useState } from "react"
import Button from "../../components/ui/Button"
import { useAuth } from "../../context/authContext"
// import { fetch_chris } from "../../functions/fetch_chris"

const Home = () => {
    const { refreshToken, authTokens, perfilData } = useAuth()
    const [refresh, setRefresh] = useState(false)

    return (
        <div className="h-full">
            <div className="w-full h-full flex items-center justify-center gap-10">
                <h1 className="text-7xl">Usuario {perfilData?.user.username} </h1>
                <img src={perfilData?.fotoperfil} alt="" width={100} height={100} className="rounded-full"/>
            </div>
            <h2>{perfilData?.cargos.shift()?.cargo_label}</h2>
        </div>
    )
}

export default Home
