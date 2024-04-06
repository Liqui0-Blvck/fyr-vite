import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { TControlCalidad, TPerfil, TRendimiento, TRendimientoMuestra } from "../../../../types/registros types/registros.types"
import { useAuth } from "../../../../context/authContext"
import useDarkMode from "../../../../hooks/useDarkMode"
import { useAuthenticatedFetch } from "../../../../hooks/useAxiosFunction"
import { TableCell } from "@mui/material"
import { BiCheckDouble } from "react-icons/bi"
import ModalRegistro from "../../../../components/ModalRegistro"
import { format } from "@formkit/tempo"


interface ILoteCompletadoProps {
  muestra?: TRendimientoMuestra | null
  refresh?: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  ccLote?: TControlCalidad | null

}

const FilaControlDetalleDescuento_1: FC<ILoteCompletadoProps> = ({ muestra: row, ccLote }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const [rendimiento, setRendimiento] = useState<TRendimiento | null>(null)
  const { isDarkTheme } = useDarkMode()

  console.log(rendimiento)

  console.log(ccLote?.recepcionmp)
  useEffect(() => {
    const getRendimientos = async () => {
      const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/rendimiento_lotes/${ccLote?.recepcionmp}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens?.access}`
        }
      })
  
      if (res.ok){
        setRendimiento(await res.json())
      } else {
        console.log("Tuve problemas")
      }
    }
  
    getRendimientos()
  }, [ccLote])

  

  const pepaBruta = (row?.peso_muestra ?? 0) - (row?.basura ?? 0) - (row?.pelon ?? 0) - (row?.ciega ?? 0) - (row?.cascara ?? 0) - (row?.pepa_huerto ?? 0)
  const pepaExport = (row?.pepa ?? 0) - ((row?.cc_rendimiento.muestra_variedad ?? 0) + (row?.cc_rendimiento.daño_insecto ?? 0) + (row?.cc_rendimiento.hongo ?? 0) + (row?.cc_rendimiento.doble ?? 0) + (row?.cc_rendimiento.fuera_color ?? 0) + (row?.cc_rendimiento.vana_deshidratada ?? 0) + (row?.cc_rendimiento.punto_goma ?? 0) + (row?.cc_rendimiento.goma ?? 0))
  return (
    <>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{(rendimiento?.cc_aportes_pex[0].exportable)?.toFixed(1)} %</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{(rendimiento?.cc_descuentos[0].pepa_exp)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{(rendimiento?.cc_kilos_des_merma[0].exportable)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{(rendimiento?.cc_porcentaje_liquidar[0].exportable)?.toFixed(1)} %</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{(rendimiento?.cc_calculo_final.merma_exp)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{(rendimiento?.cc_merma_porc[0].exportable)?.toFixed(1)} %</span>
        </div>
      </TableCell>
      
      
      
    </>

  )
}

export default FilaControlDetalleDescuento_1
