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
import { TEnvasesPrograma, TPatioTechadoEx, TProduccion } from '../../../../types/registros types/registros.types'
import { useAuth } from '../../../../context/authContext';
import useDarkMode from '../../../../hooks/useDarkMode';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { variedadFilter } from '../../../../constants/options.constants';
import Tooltip from '../../../../components/ui/Tooltip';
import { FaForward } from "react-icons/fa6";
import { urlNumeros } from '../../../../services/url_number';


interface ILoteCompletadoProps {
  envase: TEnvasesPrograma | null
  refresh: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  setOpen: Dispatch<SetStateAction<boolean>>
  produccion?: TProduccion

}

const FilaEnvaseLoteProduccion: FC<ILoteCompletadoProps> = ({ envase: row, produccion, refresh }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)


  const { data: patio_exterior } = useAuthenticatedFetch<TPatioTechadoEx>(
    authTokens,
    validate,
    `/api/patio-exterior/${row?.guia_patio}`
  )


  console.log(row)


  const actualizarEstadoEnvase = async (id_lote: number, bodega_ext: number) => {
    const res = await fetch(`${base_url}/api/produccion/${id}/lotes_en_programa/${id_lote}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      },
      body: JSON.stringify({
        bin_procesado: true,
        bodega_techado_ext: bodega_ext,
        produccion: id[0]
      })
    })

    if (res.ok){
      toast.success("Lote Procesado Correctamente")
      refresh(true)
    } else {
      toast.error("No se pudo procesar el lote, vuelve a intentarlo")
    }
  }




  return (
    <>
      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{patio_exterior?.ubicacion_label}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_bin} / {patio_exterior?.envases.length}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{variedadFilter.find(variety => variety.value === patio_exterior?.variedad)?.label}</span>
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
                    onClick={() => actualizarEstadoEnvase(row?.id!, row?.bodega_techado_ext!)}
                    className='w-16 rounded-md h-12 bg-amber-600 flex items-center justify-center p-2 hover:scale-105'
                    >
                      <FaForward style={{ fontSize: 35 }}/>
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
