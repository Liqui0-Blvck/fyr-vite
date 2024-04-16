

export async function putPerfil(values: { username: string; email: string; first_name: string; last_name: string; sexo: string; fnacimiento: string; celular: string; direccion: string; comuna: string }, token: string | undefined, user_id: number) {
    const configPutPerfil = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            // fotoperfil: values.fotoperfil,
            sexo: values.sexo,
            fnacimiento: values.fnacimiento,
            celular: values.celular,
            direccion: values.direccion,
            comuna: values.comuna
        })
    }
    const responsePutPerfil = await fetch(`${process.env.VITE_BASE_URL_DEV}/api/registros/perfil/${user_id}/`, configPutPerfil)
    if (responsePutPerfil.ok) {
        return true
    } else {
        return responsePutPerfil.status
    }
}

export async function putFotoPerfil(fotoperfil: File, token: string | undefined, user_id: number) {
    const form = new FormData
    form.append('fotoperfil', fotoperfil)

    const configPutFoto = {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: form
        
    }
    const responsePutFoto = await fetch(`${process.env.VITE_BASE_URL_DEV}/api/registros/perfil/${user_id}/`, configPutFoto)
    if (responsePutFoto.ok) {
        return true
    } else {
        return responsePutFoto.status
    }
}