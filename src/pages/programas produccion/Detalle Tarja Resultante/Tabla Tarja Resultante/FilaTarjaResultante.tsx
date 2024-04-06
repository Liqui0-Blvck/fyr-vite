import { TableCell } from '@mui/material'


import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import toast from 'react-hot-toast'
import { format } from '@formkit/tempo'
import { GiTestTubes } from "react-icons/gi";
import { FaPlus } from "react-icons/fa6";
import { BiCheckDouble, BiPlus } from 'react-icons/bi'

import { Link, useLocation } from 'react-router-dom'
import { RiErrorWarningFill } from 'react-icons/ri'
import { MdOutlineCommentsDisabled } from "react-icons/md";
import { TEnvasesPrograma, TPatioTechadoEx, TProduccion, TTarjaResultante } from '../../../../types/registros types/registros.types'
import { useAuth } from '../../../../context/authContext';
import useDarkMode from '../../../../hooks/useDarkMode';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { variedadFilter } from '../../../../constants/options.constants';
import Tooltip from '../../../../components/ui/Tooltip';
import { FaForward } from "react-icons/fa6";
import { urlNumeros } from '../../../../services/url_number';
import { HeroXMark } from '../../../../components/icon/heroicons';


interface ILoteCompletadoProps {
  envase: TTarjaResultante | null
  refresh: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  setOpen: Dispatch<SetStateAction<boolean>>
  produccion?: TProduccion

}

const FilaTarjaResultante: FC<ILoteCompletadoProps> = ({ envase: row, produccion, refresh }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const [openModalCCPepa, setOpenModalCCPepa] = useState<boolean>(false)
  const [ccPepaConfirmacion, setccPepaConfirmacion] = useState<boolean>(false)
  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const [openConfirmacion, setOpenConfirmacion] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)
  const [confirmacionCCPepa, setConfirmacionCCPepa] = useState<boolean>(false)
  const [isCalibrable, setIsCalibrable] = useState<boolean>(false)

  // const { data: patio_exterior } = useAuthenticatedFetch<TPatioTechadoEx>(
  //   authTokens,
  //   validate,
  //   `/api/patio-exterior/${row?.guia_patio}`
  // )

  const eliminarTarja = async (id_lote: number) => {
    const res = await fetch(`${base_url}/api/produccion/${id}/tarjas_resultantes/${id_lote}/`, {
      method: 'DELETE',
      headers: {  
        'Authorization': `Bearer ${authTokens?.access}`
      },
    })  

    if (res.ok){
      toast.success("Tarja Eliminada Correctamente")
      refresh(true)
    } else {
      toast.error("No se pudo eliminar la tarja, vuelve a intentarlo")
    }
  }


  const actualizarEstadoTarja = async (id_lote: number) => {
    const res = await fetch(`${base_url}/api/produccion/${id}/tarjas_resultantes/${id_lote}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      },
      body: JSON.stringify({
        cc_tarja: true,
        produccion: id[0]
      })
    })

    if (res.ok){
      toast.success("Tarja Procesada Correctamente")
      refresh(true)
    } else {
      toast.error("No se pudo procesar la tarja, vuelve a intentarlo")
    }
  }

  return (
    <>
      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.codigo_tarja}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.peso)?.toFixed(1)} kgs</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.tipo_patineta}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{format(row?.fecha_creacion!, { date: 'short', time: 'short' }, 'es')}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          {
            row?.cc_tarja
              ? (
                <Tooltip text='Envase Procesado en Producción'>
                  <button
                    type='button'
                    onClick={() => {}}
                    className='w-16 rounded-md h-12 bg-green-600 flex items-center justify-center p-2 hover:scale-105'
                    >
                      <BiCheckDouble style={{ fontSize: 35 }}/>
                  </button>
                </Tooltip>
                )
              : (
                <Tooltip text='Envase a Procesar'>
                  <button
                    type='button'
                    onClick={() => actualizarEstadoTarja(row?.id!)}
                    className='w-16 rounded-md h-12 bg-amber-600 flex items-center justify-center p-2 hover:scale-105'
                    >
                      <RiErrorWarningFill style={{ fontSize: 35 }}/>
                  </button>
                </Tooltip>
                )
          }
          <Tooltip text='Envase a Procesar'>
            <button
              type='button'
              onClick={() => eliminarTarja(row?.id!)}
              className='w-16 rounded-md h-12 bg-red-600 flex items-center justify-center p-2 hover:scale-105'
              >
                <HeroXMark style={{ fontSize: 35 }}/>
            </button>
          </Tooltip>

          
        </div>
      </TableCell>
      
    </>

  )
}

export default FilaTarjaResultante
