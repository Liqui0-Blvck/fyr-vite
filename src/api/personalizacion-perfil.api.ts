

export async function putPersonalizacionPerfil(values: { iot_balanza_recepcionmp: any; estilo: string; cabecera: string; anio: string; }, token: string | undefined,user_id: number) {
    const configPutPersonalizacion = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            estilo: values.estilo,
            cabecera: values.cabecera,
            anio: values.anio,
            iot_balanza_recepcionmp: values.iot_balanza_recepcionmp
        })
    }
    const responsePutPersonalizacion = await fetch(`${process.env.VITE_BASE_URL_DEV}/api/registros/personalizacion-perfil/${user_id}/`, configPutPersonalizacion)
    if (responsePutPersonalizacion.ok) {
        return true
    } else {
        return responsePutPersonalizacion.status
    }
}