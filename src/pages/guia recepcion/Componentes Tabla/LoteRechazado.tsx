import { TableCell } from '@mui/material'

import useDarkMode from '../../../hooks/useDarkMode'

import { useAuth } from '../../../context/authContext'
import { TLoteRechazado } from '../../../types/registros types/registros.types'
import { Dispatch, FC, SetStateAction } from 'react'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { RESULTADO_RECHAZO, checkCargoPerfil } from '../../../constants/select.constanst'
import toast from 'react-hot-toast'
import { optionResultados } from '../../../constants/options.constants'


interface ILoteCompletadoProps {
  lote: TLoteRechazado | null
  refresh: Dispatch<SetStateAction<boolean>>

}

const LoteRechazadoFila: FC<ILoteCompletadoProps> = ({ lote: row, refresh }) => {
  const { authTokens, validate, perfilData } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()

  const updateResultado = async (value: string, id: number) => {
    const res = await fetch(`${base_url}/api/lotes-rechazados/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...row,
        resultado_rechazo: value
      })
    })

    if (res.ok) {
      refresh(true)
    } else {
      toast.error('No se pudo actualizar el resultado de rechazo')
    }
  } 

  const handleResultadoChange = (e: any) => {
    updateResultado(e, row?.id!)
  }

  const cargoLabels = perfilData?.cargos.map(cargo => cargo.cargo_label) || [];





  return (
    <>
      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote_rechazado}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.rechazado_por}</span>
        </div>
      </TableCell>
      {
        cargoLabels.includes('CDC Jefatura')
          ? (
            <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
              <SelectReact
                options={optionResultados}
                id='camion'
                name='camion' 
                placeholder='Selecciona un envase'
                value={optionResultados.find(option => option?.value === row?.resultado_rechazo)}
                className='h-14 w-full absolute'
                onChange={(value: any) => handleResultadoChange(value.value)}
              />
            </TableCell>
            )
          : (
            <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
              <div className=' h-full w-full flex items-center justify-center'>
                <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.resultado_rechazo_label}</span>
              </div>
            </TableCell>
          )
      }
      
    </>

  )
}

export default LoteRechazadoFila
