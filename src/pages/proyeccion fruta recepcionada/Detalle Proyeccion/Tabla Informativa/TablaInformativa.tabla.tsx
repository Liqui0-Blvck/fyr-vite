import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/authContext';
import useDarkMode from '../../../../hooks/useDarkMode';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { TControlCalidad, TControlCalidadB, TRendimientoActual, TRendimientoMuestra, TTarjaResultante } from '../../../../types/registros types/registros.types';
import { TablePagination } from '@mui/material';
import FilaTablaInformativa from './FilaTablaInformativa.fila';
import Search from 'antd/es/input/Search';
import SearchPartial from '../../../../templates/layouts/Headers/_partial/Search.partial';


interface IRendimientoMuestra {
  id_lote?: number
  data?: TControlCalidadB[]
  refresh?: Dispatch<SetStateAction<boolean>>
  tarjas_resultantes?: TTarjaResultante[]
  ccLote?: TControlCalidad | null
}

const TablaInformativa: FC<IRendimientoMuestra> = ({ data }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();
  const [filtro, setFiltro]

  console.log(data)


  return (
    <div>
      <div
          className='relative left-[0px] lg:left-0 p-5 '>
        <div className='h-full'>
          <input
            type='text'
            />
        </div>
        <TableContainer sx={{ height: 450 }}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ borderRadius: 5, backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>N° Lote</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Kilos Neto</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Variedad</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Cantidad Muestras</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Pepas Control</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Control Calibre</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body' >
              {
                data?.map((row: TControlCalidadB) => {
                  console.log(row)
                  return (
                    <TableRow>
                      <FilaTablaInformativa muestra={row}/>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div >
  );
};

export default TablaInformativa;
