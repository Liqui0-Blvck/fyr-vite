import { Accordion, AccordionDetails, AccordionSummary, TableCell } from '@mui/material'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import useDarkMode from '../../../../hooks/useDarkMode'
import { TBinEnReproceso, TControlCalidadB, TEnvasePatio } from '../../../../types/registros types/registros.types'
import { MdOutlineExpandMore } from 'react-icons/md'
import { variedadFilter } from '../../../../constants/options.constants'
import { HeroEye } from '../../../../components/icon/heroicons'
import Tooltip from '../../../../components/ui/Tooltip'
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction'
import { useAuth } from '../../../../context/authContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { urlNumeros } from '../../../../services/url_number'
import ModalRegistro from '../../../../components/ModalRegistro'
import Checkbox from '../../../../components/form/Checkbox'
import EnvasesEnGuiaList from './ListaEnvasesSeleccionables'
import { preventDefault } from '@fullcalendar/core/internal'
import toast from 'react-hot-toast'


interface IRegistroPrograma {
  row: TBinEnReproceso
  id_row?: number
  variedad?: string
  ubicacion?: string
  refresh: Dispatch<SetStateAction<boolean>>
}


const bodegas = [
  { value: 69, label: 'Bodega G1'},
  { value: 71, label: 'Bodega G2'},
  { value: 73, label: 'Bodega Residuos'},
]



const FilaRegistroPrograma: FC<IRegistroPrograma> = ({row, id_row, variedad, refresh }) => {
  const { isDarkTheme } = useDarkMode()
  const { authTokens, validate, perfilData, userID } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const base_url = process.env.VITE_BASE_URL_DEV
  const [open, setOpen] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState(false);

  const { data: cc_calidad } = useAuthenticatedFetch<TControlCalidadB>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id_row}`
  )

  const registrarLoteAProduccion = async (id_bin: number, tipo_bin: number) => {
    const res = await fetch(`${base_url}/api/reproceso/${id}/bins_en_reproceso/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      },
      body: JSON.stringify({
        reproceso: id[0],
        tipo_bin_bodega: tipo_bin,
        id_bin_bodega: id_bin
      })
    })

    if (res.ok){
      refresh(true)
      toast.success('Envase agregado correctamente a producción')
    } else {
      toast.error("Ocurrió un error, vuelve a intentarlo")
    }
  }

  const handleChange = () => {
    setSelectAll(!selectAll);
  }


  return (
    <>
      <TableCell className='table-cell-row-4' component="th" sx={{
      backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` 
    }}>
          <div className=' h-full w-full flex gap-2 items-center justify-center'>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.binbodega}</span>
          </div>  
      </TableCell>

      <TableCell className='table-cell-row-4' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className='w-full h-full flex gap-2 items-center justify-center'>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>N° Programa {row?.programa_produccion}</span>
          </div>
      </TableCell>

      <TableCell className='table-cell-row-4' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className=' h-full w-full flex items-center justify-center'>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(row?.kilos_bin)} kgs</span>
          </div>
      </TableCell>

      <TableCell className='table-cell-row-4' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className=' h-full w-full flex items-center justify-center'>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>---</span>
          </div>
      </TableCell>

      <TableCell className='table-cell-row-4' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className=' h-full w-full flex items-center justify-center'>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>Sin Calibre</span>
          </div>
      </TableCell>

      <TableCell className='table-cell-row-4' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className=' h-full w-full flex items-center justify-center'>
            <span className={`text-lg text-center ${isDarkTheme ? 'text-white' : 'text-black'}`}>
              {
                row.binbodega.includes('G1')
                  ? 'Bodega G1'
                  : row.binbodega.includes('G2')
                    ? 'Bodega G2'
                    : row.binbodega.includes('RS')
                      ? 'Residuos Solidos Reproceso'
                      : null
              }
            </span>
          </div>
      </TableCell>

      <TableCell className='row-specific' component="th" sx={{backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className='flex items-center justify-center'>
          <Checkbox checked={selectAll} onChange={() => {
            handleChange
            registrarLoteAProduccion(row?.id!, 
                row.binbodega.includes('G1')
                  ? 69!
                  : row.binbodega.includes('G2')
                    ? 71!
                    : row.binbodega.includes('RS')
                      ? 73!
                      : 0
            )
          }} />
        </div>
      </TableCell>

    </>
  )
}

export default FilaRegistroPrograma
