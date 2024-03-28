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

const FilaControlRendimientoCalibre: FC<ILoteCompletadoProps> = ({ muestra: row, ccLote }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const [rendimiento, setRendimiento] = useState<TRendimiento | null>(null)
  const { isDarkTheme } = useDarkMode()

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

  return (
    <>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, padding: 5 }}>
        <div className=' h-full w-full flex items-center justify-center p-5'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.id}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(rendimiento?.cc_pepa_calibre[0].precalibre)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(rendimiento?.cc_pepa_calibre[0].calibre_18_20)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(rendimiento?.cc_pepa_calibre[0].calibre_20_22)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(rendimiento?.cc_pepa_calibre[0].calibre_23_25)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(rendimiento?.cc_pepa_calibre[0].calibre_25_27)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(rendimiento?.cc_pepa_calibre[0].calibre_27_30)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{rendimiento?.cc_pepa_calibre[0].calibre_30_32} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{rendimiento?.cc_pepa_calibre[0].calibre_32_34} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{rendimiento?.cc_pepa_calibre[0].calibre_34_36} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{rendimiento?.cc_pepa_calibre[0].calibre_36_40} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-md ${isDarkTheme ? 'text-white text-center' : 'text-black text-center'}`}>{rendimiento?.cc_pepa_calibre[0].calibre_40_mas} grs</span>
        </div>
      </TableCell>
      
      
    </>

  )
}

export default FilaControlRendimientoCalibre
