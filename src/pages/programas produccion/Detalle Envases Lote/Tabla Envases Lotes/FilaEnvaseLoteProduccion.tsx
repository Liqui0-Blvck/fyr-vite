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


interface ILoteCompletadoProps {
  envase: TEnvasesPrograma | null
  refresh?: Dispatch<SetStateAction<boolean>>
  id_lote?: number
  setOpen: Dispatch<SetStateAction<boolean>>
  produccion?: TProduccion

}

const FilaEnvaseLoteProduccion: FC<ILoteCompletadoProps> = ({ envase: row, produccion }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  const { pathname } = useLocation()
  const [openModalCCPepa, setOpenModalCCPepa] = useState<boolean>(false)
  const [ccPepaConfirmacion, setccPepaConfirmacion] = useState<boolean>(false)
  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const [openConfirmacion, setOpenConfirmacion] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)
  const [confirmacionCCPepa, setConfirmacionCCPepa] = useState<boolean>(false)
  const [isCalibrable, setIsCalibrable] = useState<boolean>(false)

  const { data: patio_exterior } = useAuthenticatedFetch<TPatioTechadoEx>(
    authTokens,
    validate,
    `/api/patio-exterior/${row?.guia_patio}`
  )




  // const cargoLabels = perfilData?.cargos.map(cargo => cargo.cargo_label) || [];

  // const { data: userData } = useAuthenticatedFetch<TPerfil>(
  //   authTokens,
  //   validate,
  //   `/api/registros/perfil/${row?.registrado_por}`
  // )

  

  // const deleteMuestra = async () => {
  //   const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/${row?.cc_recepcionmp}/muestras/${row?.id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${authTokens?.access}`
  //     }
  //   })

  //   if (res.ok){
  //     refresh(true)
  //   } else {
  //     console.log("Confirmame porfavor")
  //   }
  // }

  // useEffect(() => {
  //   let isMounted = true

  //   if (isMounted && confirmacion){
  //     deleteMuestra()
  //   }
  //   return () => {
  //     isMounted = false
  //   }
  // }, [confirmacion])


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
                <Tooltip text='Mensaje criptico'>
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
                <Tooltip text='Mensaje criptico'>
                  <button
                    type='button'
                    onClick={() => {}}
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
