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
import { TEnvasesPrograma, TPatioTechadoEx, TProduccion, TRendimiento, TTarjaResultante } from '../../../../types/registros types/registros.types'
import { useAuth } from '../../../../context/authContext';
import useDarkMode from '../../../../hooks/useDarkMode';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { variedadFilter } from '../../../../constants/options.constants';
import Tooltip from '../../../../components/ui/Tooltip';
import { FaForward } from "react-icons/fa6";
import { urlNumeros } from '../../../../services/url_number';
import { HeroXMark } from '../../../../components/icon/heroicons';
import ModalForm from '../../../../components/ModalRegistro';
import FormularioControlCalidadTarja from '../../Formularios Produccion/Formulario Control Calidad Tarja/FormularioControlCalidadTarja';


interface ILoteCompletadoProps {
  lote: TRendimiento
  refresh?: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  setOpen?: Dispatch<SetStateAction<boolean>>
  produccion?: TProduccion

}

const FilaProyeccionRecepcionado: FC<ILoteCompletadoProps> = ({ lote: row}) => {
  const { isDarkTheme } = useDarkMode()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)

  return (
    <>
      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Pre Calibre</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          {/* <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.peso)?.toFixed(1)} kgs</span> */}
        </div>
      </TableCell>

      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          {/* <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.tipo_patineta}</span> */}
        </div>
      </TableCell>

      
    </>

  )
}

export default FilaProyeccionRecepcionado
