import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { TControlCalidad, TControlCalidadB, TPerfil, TRendimientoMuestra } from "../../../../types/registros types/registros.types"
import { useAuth } from "../../../../context/authContext"
import useDarkMode from "../../../../hooks/useDarkMode"
import { useAuthenticatedFetch } from "../../../../hooks/useAxiosFunction"
import { TableCell } from "@mui/material"
import { BiCheckDouble } from "react-icons/bi"
import ModalRegistro from "../../../../components/ModalForm.modal"
import { format } from "@formkit/tempo"
import { IoWarning } from "react-icons/io5"


interface ILoteCompletadoProps {
  muestra?: TControlCalidadB | null
  refresh?: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  ccLote?: TControlCalidad | null

}

const FilaTablaInformativa: FC<ILoteCompletadoProps> = ({ muestra: row }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()

  // const { data: userData } = useAuthenticatedFetch<TPerfil>(
  //   authTokens,
  //   validate,
  //   `/api/registros/perfil/${row?.registrado_por}`
  // )


  return (
    <>
      <TableCell className='table-cell-row-detail-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{row?.numero_lote}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{(row?.kilos_totales_recepcion)?.toFixed(1)} grs</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{row?.variedad}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'} py-2`}>{(row?.control_rendimiento.length)}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <div className={`p-2 rounded-full ${row?.control_rendimiento.some(cc => cc.cc_ok === true) ? 'bg-green-800' : 'bg-orange-400'}`}>
            {
              row?.control_rendimiento.some(cc => cc.cc_ok === true)
                ? <BiCheckDouble style={{ fontSize: 25 }}/>
                : <IoWarning />
            }
          </div>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-detail-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
      <div className=' h-full w-full flex items-center justify-center'>
          <div className={`p-2 rounded-full ${row?.control_rendimiento.some(cc => cc.cc_ok === true) ? 'bg-green-800' : 'bg-orange-400'}`}>
            {
              row?.control_rendimiento.some(cc => cc.cc_calibrespepaok === true)
                ? <BiCheckDouble style={{ fontSize: 25 }}/>
                : <IoWarning />
            }
          </div>
        </div>
      </TableCell>
    </>

  )
}

export default FilaTablaInformativa
