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
import ModalForm from '../../../../components/ModalForm.modal';
import FormularioControlCalidadTarja from '../../Formularios Produccion/Formulario Control Calidad Tarja/FormularioControlCalidadTarja';
import { optionTipoPatineta } from '../../../../utils/generalUtils';


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
  const [openModalCCTarja, setOpenModalCCTarja] = useState<boolean>(false)


  const eliminarTarja = async (id_lote: number) => {
    const res = await fetch(`${base_url}/api/produccion/${id}/tarjas_resultantes/${id_lote}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      },
      body: JSON.stringify({
        produccion: id[0],
        esta_eliminado: true
      })
    })  

    if (res.ok){
      toast.success("Tarja Eliminada Correctamente")
      refresh(true)
    } else {
      toast.error("No se pudo eliminar la tarja, vuelve a intentarlo")
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
          <span className={`text-xl text-center ${isDarkTheme ? 'text-white' : 'text-black'}`}>{optionTipoPatineta.find(tipo => tipo?.value! === String(row?.tipo_patineta))?.label}</span>
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
                <ModalForm
                  open={openModalCCTarja}
                  setOpen={setOpenModalCCTarja}
                  textTool='CC Tarja Resultante'
                  title='Control Calidad Tarja Resultante'
                  icon={<RiErrorWarningFill style={{ fontSize: 35 }}/>}
                  size={900}
                  width={`w-16 rounded-md h-12 bg-amber-600 flex items-center justify-center p-2 hover:scale-105`}
                  >
                    <FormularioControlCalidadTarja id_lote={row?.id} refresh={refresh} isOpen={setOpenModalCCTarja}/>
                </ModalForm>
                )
          }
          {
            produccion?.estado === '5'
              ? null
              : (
                <Tooltip text='Envase a Procesar'>
                  <button
                    type='button'
                    onClick={() => eliminarTarja(row?.id!)}
                    className='w-16 rounded-md h-12 bg-red-600 flex items-center justify-center p-2 hover:scale-105'
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

export default FilaTarjaResultante
