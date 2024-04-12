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
import { TControlCalidad, TEnvasesPrograma, TProduccion, TRendimientoMuestra } from '../../../../types/registros types/registros.types';
import FilaEnvaseLote from './FilaEnvaseLoteProduccion';
import LoteFila from '../../../guia recepcion/Componentes Tabla/LoteFila';
import { TablePagination } from '@mui/material';


interface IProduccionProps {
  id_lote?: number
  data?: TEnvasesPrograma[] | []
  refresh: Dispatch<SetStateAction<boolean>>
  produccion?: TProduccion | null
}


const TablaEnvasesLotes: FC<IProduccionProps> = ({ data, refresh, id_lote, produccion }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch]: [string, (search: string) => void] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

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
        <div className='w-full h-full mb-5 flex gap-5 items-center'>
          <span>Buscar Tarja de Producción MP: </span>
          <input type="text" onChange={handleChange} className='dark:bg-zinc-600 bg-zinc-300 px-4 py-2 rounded-md '/>
        </div>
        <TableContainer sx={{ height: 345, borderRadius: 3 }}>
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
              {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).
                filter((row) => 
                  row.numero_lote.toString().toLocaleLowerCase().includes(search) ||
                  row.variedad.toString().toLocaleLowerCase().includes(search)
              ).
                map((row: TEnvasesPrograma) => {
                return (
                  <TableRow key={row.id} className='table-row-body' style={{ overflowX: 'auto', height: 40 }}>
                    <FilaEnvaseLote envase={row} refresh={refresh} setOpen={() => {}} produccion={produccion!}/>
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

export default TablaEnvasesLotes;
