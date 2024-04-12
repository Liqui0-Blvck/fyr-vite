import React from 'react'
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction'
import { useAuth } from '../../../../context/authContext'
import FooterRegistroPrograma from './FooterRegistroPrograma'
import { TBinEnReproceso, TPatioTechadoEx } from '../../../../types/registros types/registros.types'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../../services/url_number'

const FormularioRegistroPrograma = () => {
  const { authTokens, validate, perfilData } = useAuth()

  const { data: bins, setRefresh } = useAuthenticatedFetch<TBinEnReproceso[]>(
    authTokens,
    validate,
    `/api/bin-bodega/`
  )

  return (
    <div className='w-full flex flex-col my-10  '>
      <div className='w-full flex flex-col gap-y-3'>
        <h1 className='text-center text-4xl'>Registro de Programa Producción Reproceso</h1>
        <h2 className='text-center text-2xl'>Seleccione los Bins a Procesar en este programa desde la lista de Bins en las diferentes bodegas</h2>
      </div>

      <div className='w-[96%] mx-auto h-full'>
        <FooterRegistroPrograma bin={bins || []} refresh={setRefresh} />
      </div>
    </div>
  )
}

export default FormularioRegistroPrograma
