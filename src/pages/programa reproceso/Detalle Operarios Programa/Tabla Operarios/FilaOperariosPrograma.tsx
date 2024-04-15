import { TableCell } from '@mui/material'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BiCheckDouble, BiPlus } from 'react-icons/bi'
import { Link, useLocation } from 'react-router-dom'
import { RiErrorWarningFill } from 'react-icons/ri'
import { MdOutlineCommentsDisabled } from "react-icons/md";
import { TEnvasesPrograma, TOperarioProduccion, TOperarios, TPatioTechadoEx, TProduccion } from '../../../../types/registros types/registros.types'
import { useAuth } from '../../../../context/authContext';
import useDarkMode from '../../../../hooks/useDarkMode';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { variedadFilter } from '../../../../constants/options.constants';
import Tooltip from '../../../../components/ui/Tooltip';
import { FaForward } from "react-icons/fa6";
import { urlNumeros } from '../../../../services/url_number';
import { HeroXMark } from '../../../../components/icon/heroicons';


interface IFilaOperarioProgramaProps {
  operario: TOperarioProduccion
}

const FilaOperarioPrograma: FC<IFilaOperarioProgramaProps> = ({ operario: row }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)


  // const { data: patio_exterior } = useAuthenticatedFetch<TPatioTechadoEx>(
  //   authTokens,
  //   validate,
  //   `/api/patio-exterior/${row?.guia_patio}`
  // )


  console.log(row)


  // const actualizarEstadoEnvase = async (id_lote: number, bodega_ext: number) => {
  //   const res = await fetch(`${base_url}/api/produccion/${id}/lotes_en_programa/${id_lote}/`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${authTokens?.access}`
  //     },
  //     body: JSON.stringify({
  //       bin_procesado: true,
  //       bodega_techado_ext: bodega_ext,
  //       produccion: id[0]
  //     })
  //   })

  //   if (res.ok){
  //     toast.success("Lote Procesado Correctamente")
  //     refresh(true)
  //   } else {
  //     toast.error("No se pudo procesar el lote, vuelve a intentarlo")
  //   }
  // }

  // const eliminarEnvaseProduccion = async (id_lote: number) => {
  //   const res = await fetch(`${base_url}/api/produccion/${id}/lotes_en_programa/${id_lote}/`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Authorization': `Bearer ${authTokens?.access}`
  //     }
  //   })

  //   if (res.ok){
  //     toast.success("Envase devuelto con exito a bodega")
  //     refresh(true)
  //   } else {
  //     toast.error("No se pudo devolver el envase, vuelve a intentarlo")
  //   }
  // }


  console.log(row)

  return (
    <>
      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.nombres}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.rut_operario}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.tipo_operario}</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos}</span>
        </div>
      </TableCell>

     
      
    </>

  )
}

export default FilaOperarioPrograma
