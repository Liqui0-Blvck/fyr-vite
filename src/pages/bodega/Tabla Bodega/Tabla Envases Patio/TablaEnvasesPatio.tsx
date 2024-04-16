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
import { TControlCalidad, TEnvasePatio, TRendimientoMuestra } from '../../../../types/registros types/registros.types';
import FilaControlRendimientoMuestra from './FilaEnvasesPatio';
import FilaEnvasesPatio from './FilaEnvasesPatio';


interface IRendimientoMuestra {
  id_lote?: number
  data?: TEnvasePatio[] | []
  refresh?: Dispatch<SetStateAction<boolean>>

}


const TablaEnvasesPatio: FC<IRendimientoMuestra> = ({ data, refresh, id_lote }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();

  return (
    <div>
      <div
          className='relative left-[0px] lg:left-0 p-5'>
        <TableContainer sx={{ height: 450 }}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>N° Lote</TableCell>
                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>N° Bin</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Kilos Fruta</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Estado</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Guia Patio</TableCell>
                <TableCell className='table-cell-3' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Variedad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body' >
              {data?.map((row: TEnvasePatio) => {
                console.log(row)
                return (
                  <TableRow key={row.id} className='table-row-body' style={{ overflowX: 'auto'}}>
                    <FilaEnvasesPatio
                      muestra={row}
                      id_lote={id_lote}
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

export default TablaEnvasesPatio;
