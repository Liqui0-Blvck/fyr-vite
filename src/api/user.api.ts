

export async function putUser(values: { username: any; email: any; first_name: any; last_name: any; sexo?: "F" | "M" | "O"; estilo?: any; fnacimiento?: string; celular?: string; cabecera?: any; anio?: any; direccion?: string; comuna?: string },  token: string | undefined, user_id: number) {
    const configPut = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            username: values.username
          })
    }
    const response = await fetch(`${process.env.VITE_BASE_URL_DEV}/api/users/${user_id}`, configPut)
    if (response.ok) {
        return true
    } else {
        return response.status
    }
}