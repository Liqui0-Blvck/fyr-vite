import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { TControlCalidad, TEnvasePatio, TPerfil, TRendimientoMuestra } from "../../../../types/registros types/registros.types"
import { useAuth } from "../../../../context/authContext"
import useDarkMode from "../../../../hooks/useDarkMode"
import { useAuthenticatedFetch } from "../../../../hooks/useAxiosFunction"
import { TableCell } from "@mui/material"
import { BiCheckDouble } from "react-icons/bi"
import ModalRegistro from "../../../../components/ModalRegistro"
import { format } from "@formkit/tempo"
import useDeviceScreen from "../../../../hooks/useDeviceScreen"
import { variedadFilter } from "../../../../constants/options.constants"
import Tooltip from "../../../../components/ui/Tooltip"


interface IEnvasePatioProps {
  muestra?: TEnvasePatio | null
  refresh?: Dispatch<SetStateAction<boolean>>
  id_lote?: number

}

const FilaEnvasesPatio: FC<IEnvasePatioProps> = ({ muestra: row, id_lote }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()

  console.log(row)
  

  return (
    <>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <Tooltip text={`${row?.id!}`}>
            <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote}</span>
          </Tooltip>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <Tooltip text={`${row?.id!}`}>
            <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_bin}</span>
          </Tooltip>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.kilos_fruta)?.toFixed(1)}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.estado_envase_label)}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.guia_patio)}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center py-2'>
          <span className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(variedadFilter.find(variety => variety.value === row?.variedad)?.label)}</span>
        </div>
      </TableCell>
    </>

  )
}

export default FilaEnvasesPatio
