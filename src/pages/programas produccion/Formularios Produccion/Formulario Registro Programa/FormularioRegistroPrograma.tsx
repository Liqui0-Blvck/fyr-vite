import React from 'react'
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction'
import { useAuth } from '../../../../context/authContext'
import FooterRegistroPrograma from './FooterRegistroPrograma'
import { TPatioTechadoEx } from '../../../../types/registros types/registros.types'

const FormularioRegistroPrograma = () => {
  const { authTokens, validate, perfilData } = useAuth()
  const { data: envases_lote } = useAuthenticatedFetch<TPatioTechadoEx>(
    authTokens,
    validate,
    `/api/patio-techado-ex/`
  )

  console.log(envases_lote)

  return (
    <div className='w-full flex flex-col'>
      <div className='w-full flex flex-col'>
        <h1 className='text-center text-xl'>Registro de Programa Producción</h1>
        <h2 className='text-center text-xl'>Seleccione los Lotes a Procesar en este programa desde la lista de Lotes en Patio Techado Disponibles</h2>
      </div>

      <div className='w-full h-full border border-black'>
        <FooterRegistroPrograma lote={envases_lote! || []}/>
      </div>
    </div>
  )
}

export default FormularioRegistroPrograma
