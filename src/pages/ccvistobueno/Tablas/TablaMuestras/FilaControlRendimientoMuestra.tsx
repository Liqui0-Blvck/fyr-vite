import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { TControlCalidad, TPerfil, TRendimientoMuestra } from "../../../../types/registros types/registros.types"
import { useAuth } from "../../../../context/authContext"
import useDarkMode from "../../../../hooks/useDarkMode"
import { useAuthenticatedFetch } from "../../../../hooks/useAxiosFunction"
import { TableCell } from "@mui/material"
import { BiCheckDouble } from "react-icons/bi"
import ModalRegistro from "../../../../components/ModalForm.modal"
import { format } from "@formkit/tempo"
import useDeviceScreen from "../../../../hooks/useDeviceScreen"


interface ILoteCompletadoProps {
  muestra?: TRendimientoMuestra | null
  refresh?: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  ccLote?: TControlCalidad | null

}

const FilaControlRendimientoMuestra: FC<ILoteCompletadoProps> = ({ muestra: row }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  

  const cargoLabels = perfilData?.cargos.map(cargo => cargo.cargo_label) || [];

  const { data: userData } = useAuthenticatedFetch<TPerfil>(
    authTokens,
    validate,
    `/api/registros/perfil/${row?.registrado_por}`
  )
  const pepaBruta = (row?.peso_muestra ?? 0) - (row?.basura ?? 0) - (row?.pelon ?? 0) - (row?.ciega ?? 0) - (row?.cascara ?? 0) - (row?.pepa_huerto ?? 0)


  return (
    <>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.id}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.peso_muestra)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.basura)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.pelon)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.ciega)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.cascara)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.pepa_huerto)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{pepaBruta.toFixed(1)} grs</span>
        </div>
      </TableCell>
      
      
    </>

  )
}

export default FilaControlRendimientoMuestra
