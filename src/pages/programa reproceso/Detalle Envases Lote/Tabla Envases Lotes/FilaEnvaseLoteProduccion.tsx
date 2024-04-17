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
import { TBinEnReproceso, TEnvasesPrograma, TPatioTechadoEx, TProduccion } from '../../../../types/registros types/registros.types'
import { useAuth } from '../../../../context/authContext';
import useDarkMode from '../../../../hooks/useDarkMode';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { variedadFilter } from '../../../../constants/options.constants';
import Tooltip from '../../../../components/ui/Tooltip';
import { FaForward } from "react-icons/fa6";
import { urlNumeros } from '../../../../services/url_number';
import { HeroXMark } from '../../../../components/icon/heroicons';


interface ILoteCompletadoProps {
  envase: TBinEnReproceso | null
  refresh: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  setOpen: Dispatch<SetStateAction<boolean>>
  produccion?: TProduccion

}

const FilaEnvaseLoteProduccion: FC<ILoteCompletadoProps> = ({ envase: row, refresh }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)

  const path_bodega = row?.tipo_bin_bodega

  console.log(path_bodega)

  const actualizacionEstadoBodega = async () => {
    const res = await fetch(`${base_url}/api/reproceso/${id}/bins_en_reproceso/${row?.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      },
      body: JSON.stringify({
        tipo_bin_bodega: row?.tipo_bin_bodega,
        bin_procesado: true,
        procesado_por: userID?.user_id,
        id_bin_bodega: row?.id_bin_bodega,
        reproceso: id[0],
      })
    })

    if (res.ok){
      toast.success("Lote Procesado Correctamente")
      refresh(true)
    } else {
      toast.error("No se pudo procesar el lote, vuelve a intentarlo")
    }
  }

  const eliminarEnvaseProduccion = async (id_lote: number) => {
    const res = await fetch(`${base_url}/api/reproceso/${id}/bins_en_reproceso/${id_lote}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authTokens?.access}`
      }
    })

    if (res.ok){
      toast.success("Bin devuelto con exito a bodega")
      refresh(true)
    } else {
      toast.error("No se pudo devolver el bin, vuelve a intentarlo")
    }
  }




  return (
    <>
      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.id_bin_bodega}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl text-center ${isDarkTheme ? 'text-white' : 'text-black'}`}>N° Programa {row?.programa_produccion}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_bin} kgs</span>
        </div>
      </TableCell>
      
      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>---</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>---</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          {
            row?.bin_procesado
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
                    onClick={() => {
                      actualizacionEstadoBodega() 
                    }}
                    className='w-16 rounded-md h-12 bg-amber-600 flex items-center justify-center p-2 hover:scale-105'
                    >
                      <FaForward style={{ fontSize: 35 }}/>
                  </button>
                </Tooltip>
                )
          }
          {
            row?.bin_procesado
              ? null
              : (
                <Tooltip text='Envase Procesado en Producción'>
                  <button
                    type='button'
                    onClick={() => eliminarEnvaseProduccion(row?.id!)}
                    className='w-16 rounded-md h-12 bg-red-800 hover:bg-red-700 flex items-center justify-center p-2 hover:scale-105'
                    >
                      <HeroXMark style={{ fontSize: 35 }}/>
                  </button>
                </Tooltip>
              )
          }


          
        </div>
      </TableCell>
      
    </>

  )
}

export default FilaEnvaseLoteProduccion
