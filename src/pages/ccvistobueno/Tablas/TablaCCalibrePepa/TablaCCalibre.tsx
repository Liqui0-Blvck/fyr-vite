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
import FilaControlRendimientoPepa from './FilaControlRendimientoCalibre';
import FilaControlRendimientoCalibre from './FilaControlRendimientoCalibre';
import FilaControlRendimientoCalibreFinal from './FilaControlRendimientoFinal';


interface IRendimientoMuestra {
  id_lote?: number
  data?: TRendimientoMuestra[] | []
  refresh?: Dispatch<SetStateAction<boolean>>
  ccLote?: TControlCalidad | null
}


const TablaCCalibrePepa: FC<IRendimientoMuestra> = ({ refresh, id_lote, ccLote }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();

  return (
    <div>
      <div
        className='relative left-[0px] lg:left-0 p-5'>
        <TableContainer sx={{ height: 200}}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
              <TableCell align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '3%' }}>N° Muestra</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '8%' }}>Pre Calibre</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '8%' }}>18/20</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '8%' }}>20/22</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '8%' }}>23/25</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '8%' }}>25/27</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '8%' }}>27/30</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '6%' }}>30/32</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '8%' }}>32/34</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '8%' }}>34/36</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '8%' }}>36/40</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: '10%' }}>40/+</TableCell>


              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              <TableRow className='table-row-body'>
                <FilaControlRendimientoCalibre
                  ccLote={ccLote}
                  id_lote={id_lote}
                  refresh={refresh}
                />
              </TableRow>
              <TableRow className='table-row-body'>
                <FilaControlRendimientoCalibreFinal
                  ccLote={ccLote}
                  id_lote={id_lote}
                  refresh={refresh}
                />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div >
  );
};

export default TablaCCalibrePepa;
