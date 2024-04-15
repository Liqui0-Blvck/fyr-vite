import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../services/url_number'
import TablaProyeccionRecepcionado from './Tabla Proyeccion Recepcionado/TablaProyectoRecepcionado'
import TablaRendimientoPrograma from './Tabla Rendimiento Programa/TablaRendimientoPrograma'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { useAuth } from '../../../context/authContext'
import { TEnvasesPrograma, TLoteProduccion, TRendimiento, TRendimientoActual, TTarjaResultante } from '../../../types/registros types/registros.types'

const DetalleControlRendimiento = () => {
  const { authTokens, validate, perfilData } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const [cc_rendimiento_proyectado, setCCRendimientoProyectado] = useState<TRendimiento>()
  // const [cc_rendimiento_actual, setCCRendimientoActual] = useState<TRendimientoActual>()

  const { data: lotes_en_programa } = useAuthenticatedFetch<TEnvasesPrograma[]>(
    authTokens,
    validate,
    `/api/produccion/${id}/lotes_en_programa/`
  )

  const { data: tarjas_resultantes } = useAuthenticatedFetch<TTarjaResultante[]>(
    authTokens,
    validate,
    `/api/produccion/${id}/tarjas_resultantes/`
  )

  const { data: cdcTarja } = useAuthenticatedFetch(
    authTokens,
    validate,
    `/api/produccion/cdc-tarjaresultante/todos_los_cdc_produccion/${id}`
  )

  const { data: cc_rendimiento_actual } = useAuthenticatedFetch<TRendimientoActual>(
    authTokens,
    validate,
    `/api/produccion/cdc-tarjaresultante/rendimiento_tarja/${id[0]}/`
  )

  const lista_controles = lotes_en_programa?.map(lote => lote.control_calidad)
  const controles_calidad = lista_controles ? lista_controles.join(",") : "";

  console.log(cc_rendimiento_proyectado)


  useEffect(() => {
    const getRendimientos = async () => {
      const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/rendimiento_lotes/${controles_calidad}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens?.access}`
        }
      })
  
      if (res.ok){
        setCCRendimientoProyectado(await res.json())
      } else {
        console.log("Tuve problemas")
      }
    }
  
    getRendimientos()
  }, [lotes_en_programa])


  const pepa_calibrada = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '3').reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)
  const pepa_borrel = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '1').reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)
  const residuo_solido = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '2').reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0)
  const pepa_resultante = pepa_borrel! + pepa_calibrada!

  console.log(pepa_calibrada)
  console.log(pepa_borrel)
  console.log(residuo_solido)


  console.log("soy el rendimiento actual", cc_rendimiento_actual)





  return (
    <div className='w-[90%] h-full gap-5 mx-auto'>
      <div className='h-10 w-full flex items-center justify-center'>
        <h2 className='mt-10'>Proyección CDC de Programa Producción N° {id}</h2>
      </div>
      <div className='flex flex-col md:flex-row lg:flex-row w-full h-full py-10 mx-auto gap-5'>
        <div className='w-full dark:bg-zinc-800 bg-zinc-200 rounded-md py-2'>
          <h3 className='text-center'>Proyección de Kilos de Fruta Recepcionada</h3>
          <div className='w-full flex items-center justify-around py-3'>
            <div className='flex flex-col items-center justify-center'>
              <span className='text-md font-semibold'>{cc_rendimiento_proyectado?.cc_calculo_final?.kilos_brutos} kgs</span>
              <span>Pepa Bruta</span>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <span className='text-md font-semibold'>{cc_rendimiento_proyectado?.cc_calculo_final?.final_exp} kgs</span>
              <span>Pepa Exportable</span>
            </div>
          </div>
          <TablaProyeccionRecepcionado data={cc_rendimiento_proyectado!}/>
        </div>

        <div className='w-full dark:bg-zinc-800 bg-zinc-200 rounded-md py-2'>
          <h3 className='text-center'>Rendimiento del Programa Produccion N° {id}</h3>
          <div className='w-full flex items-center justify-center py-3 gap-10'>
            <div className='flex flex-col items-center justify-center'>
              <span className='text-md font-semibold'>{residuo_solido} kgs</span>
              <span className='text-center'>Residuo Solido</span>
            </div>
            <div className='flex flex-col items-center justify-center'>
              <span className='text-md font-semibold'>{pepa_borrel} kgs</span>
              <span className='text-center'>Borrel</span>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <span className='text-md font-semibold'>{pepa_calibrada} kgs</span>
              <span className='text-center'>Pepa Calibrada</span>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <span className='text-md font-semibold'>{cc_rendimiento_actual?.pepa_resultante} kgs</span>
              <span className='text-center'>Pepa Resultante</span>
            </div>
          </div>
          <TablaRendimientoPrograma data={cc_rendimiento_actual!} tarjas_resultantes={tarjas_resultantes || []}/>  
        </div>
      </div>
    </div>
  )
}

export default DetalleControlRendimiento
