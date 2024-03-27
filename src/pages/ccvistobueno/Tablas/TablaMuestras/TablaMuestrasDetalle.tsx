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
import FilaControlRendimientoMuestra from './FilaControlRendimientoMuestra';


interface IRendimientoMuestra {
  id_lote?: number
  data?: TRendimientoMuestra[] | []
  refresh?: Dispatch<SetStateAction<boolean>>
  ccLote?: TControlCalidad | null
}


const TablaMuestrasDetalle: FC<IRendimientoMuestra> = ({ data, refresh, id_lote, ccLote }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();

  return (
    <div>
      <div
        className='relative p-5'>
        <TableContainer sx={{ height: 220 }}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>N° Muestra</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Peso Muestra</TableCell>
                <TableCell className='table-cell-6' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Basura</TableCell>
                <TableCell className='table-cell-7' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Pelón</TableCell>
                <TableCell className='table-cell-7' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Ciegas</TableCell>
                <TableCell className='table-cell-7' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Cascaras</TableCell>
                <TableCell className='table-cell-7' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Pepa Huerto</TableCell>
                <TableCell className='table-cell-4' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Pepa Bruta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              {data?.map((row: TRendimientoMuestra) => {
                return (
                  <TableRow key={row.id} className='table-row-body'>
                    <FilaControlRendimientoMuestra
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

export default TablaMuestrasDetalle;
