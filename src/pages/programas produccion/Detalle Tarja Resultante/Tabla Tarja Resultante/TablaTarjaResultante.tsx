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
import { TControlCalidad, TRendimientoMuestra, TTarjaResultante } from '../../../../types/registros types/registros.types';
import FilaTarjaResultante from './FilaTarjaResultante';
import { TablePagination } from '@mui/material';


interface IRendimientoMuestra {
  id_lote?: number
  data?: TTarjaResultante[] | []
  refresh: Dispatch<SetStateAction<boolean>>
  ccLote?: TControlCalidad | null
}


const TablaTarjaResultante: FC<IRendimientoMuestra> = ({ data, refresh, id_lote, ccLote }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <div
          className='relative left-[0px] lg:left-0 p-5 '>
        <TableContainer sx={{ height: 320, borderRadius: 3 }}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ borderRadius: 5, backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>N° Tarja</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Fruta Neta</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Patineta</TableCell>
                <TableCell className='table-cell-3' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Fecha Registro</TableCell>
                <TableCell className='table-cell-3' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Estado Tarja</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body' >
              {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: TTarjaResultante) => {
                return (
                  <TableRow key={row.id} className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                    <FilaTarjaResultante envase={row || []} refresh={refresh} setOpen={() => {}}/>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <TablePagination
            sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, color: `${isDarkTheme ? 'white' : 'black'}` }}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.length || 0} 
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
    </div >
  );
};

export default TablaTarjaResultante;
