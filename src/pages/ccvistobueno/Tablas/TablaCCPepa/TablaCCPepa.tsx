import { Dispatch, FC, SetStateAction, useState } from 'react';
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
import { TControlCalidad, TRendimientoMuestra } from '../../../../types/registros types/registros.types';
import FilaControlRendimientoPepa from './FilaControlRendimientoPepa';
import useDeviceScreen from '../../../../hooks/useDeviceScreen';


interface IRendimientoMuestra {
  id_lote?: number
  data?: TRendimientoMuestra[] | []
  refresh?: Dispatch<SetStateAction<boolean>>
  ccLote?: TControlCalidad | null
}


const TablaMuestrasDetallePepa: FC<IRendimientoMuestra> = ({ data, refresh, id_lote, ccLote }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();
  const { width } = useDeviceScreen()

  console.log(width)
 
  return (
    <div>
      <div
          className='relative left-[0px] lg:left-0 p-5 h-full'>
        <TableContainer sx={{ height: `${width! < 1280 ? 400 : 500}`, overflowY: 'scroll', width: `${width! < 1280 ? 400 : 500}` }}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>N° Muestra</TableCell>
                <TableCell className='table-cell-3' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Pepa Bruta</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Pepa Exportable</TableCell>
                <TableCell className='table-cell-1' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Mezcla Variedad</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Daño Insecto</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Hongo</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Doble</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Fuera Color</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Vana</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Punto Goma</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Goma</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              {data?.map((row: TRendimientoMuestra) => {
                return (
                  <TableRow key={row.id} className='table-row-body'>
                    <FilaControlRendimientoPepa
                      ccLote={ccLote}
                      id_lote={id_lote}
                      muestra={row}
                      refresh={refresh}
                    />
                      
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div >
  );
};

export default TablaMuestrasDetallePepa;
