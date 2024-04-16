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
        <div>
            hola soy el home
            {/* <Button onClick={() => {fetch_chris('/api/registros/tractores/', 'GET', {})}}>PRUEBA</Button> */}
            <Button variant="solid" onClick={async () => {
                const configPeticion = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens?.access}`
                    }
                }

                const responsePeticion = await fetch(`${process.env.VITE_BASE_URL_DEV}/api/registros/tractores/`, configPeticion)
                let valido_token = false
                if (responsePeticion.ok) {
                    const dataPeticion = await responsePeticion.json()
                    console.log('token_valido')
                    valido_token = true
                } else if (responsePeticion.status == 401) {
                    console.log(401)
                    const access = await refreshToken()
                    if (access) {
                        console.log('refresco')
                        const responsePeticion_2 = await fetch(`${process.env.VITE_BASE_URL_DEV}/api/registros/tractores/`, {method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access}` }})
                        if (responsePeticion_2.ok) {
                            console.log('salio_2')
                            const dataPeticion_2 = await responsePeticion_2.json()
                            console.log(dataPeticion_2)
                            valido_token = true
                        }
                    }
                }
                if (valido_token) {
                    console.log('valido todo')
                }

            }}>Peticion Prueba</Button>
        </div>
    )
}

export default Home
