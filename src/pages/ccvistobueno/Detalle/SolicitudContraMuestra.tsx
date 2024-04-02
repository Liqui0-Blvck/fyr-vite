import React, { Dispatch, FC, SetStateAction } from 'react'
import { TControlCalidadB, TRendimientoMuestra } from '../../../types/registros types/registros.types'
import { useAuth } from '../../../context/authContext'
import TablaMuestras from '../../control calidad/Tabla Muestra/TablaMuestras'

interface IContraMuestraProps {
  cc_rendimiento: TRendimientoMuestra[]
  setOpen: Dispatch<SetStateAction<boolean>>
  cc_calidad: TControlCalidadB
  refresh: Dispatch<SetStateAction<boolean>>
}

const SolicitudContraMuestra: FC<IContraMuestraProps> = ({ cc_rendimiento, setOpen, cc_calidad, refresh }) => {
  const { authTokens, validate, perfilData } = useAuth()
	const base_url = process.env.VITE_BASE_URL_DEV
  const control_rendimiento: TRendimientoMuestra[] = cc_calidad.control_rendimiento 

  console.log(cc_rendimiento)

  console.log(cc_calidad)


  
  return (
    <div className='flex flex-col w-full h-96'>
      <div className='flex w-full items-center justify-center'>
        <h1>Muestras</h1>
      </div>

      <TablaMuestras id_lote={cc_calidad.id} data={control_rendimiento || []} refresh={refresh} setOpen={setOpen}/>
    </div>
  )
}

export default SolicitudContraMuestra
