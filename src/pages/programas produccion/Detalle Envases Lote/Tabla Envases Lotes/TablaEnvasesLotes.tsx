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
import { TControlCalidad, TEnvasesPrograma, TProduccion, TRendimientoMuestra } from '../../../../types/registros types/registros.types';
import FilaEnvaseLote from './FilaEnvaseLoteProduccion';
import LoteFila from '../../../guia recepcion/Componentes Tabla/LoteFila';


interface IProduccionProps {
  id_lote?: number
  data?: TEnvasesPrograma[] | []
  refresh?: Dispatch<SetStateAction<boolean>>
  produccion?: TProduccion | null
}


const TablaEnvasesLotes: FC<IProduccionProps> = ({ data, refresh, id_lote, produccion }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();


  return (
    <div>
      <div
          className='relative left-[0px] lg:left-0 p-5 '>
        <TableContainer sx={{ height: 600, borderRadius: 3 }}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ borderRadius: 5, backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>N° Lote</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Ubicación</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>N° Envases del Lote</TableCell>
                <TableCell className='table-cell-3' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Variedad</TableCell>
                <TableCell className='table-cell-3' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body' >
              {data?.map((row: TEnvasesPrograma) => {
                return (
                  <TableRow key={row.id} className='table-row-body' style={{ overflowX: 'auto', height: 40 }}>
                    <FilaEnvaseLote envase={row} refresh={refresh!} setOpen={() => {}} produccion={produccion!}/>
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

export default TablaEnvasesLotes;
