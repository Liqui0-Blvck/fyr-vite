import { Dispatch, FC, SetStateAction, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/authContext';
import useDarkMode from '../../../hooks/useDarkMode';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { TControlCalidad, TRendimientoMuestra } from '../../../types/registros types/registros.types';
import FilaControlMuestra from './FilaControlMuestra';


interface IRendimientoMuestra {
  id_lote: number
  data: TRendimientoMuestra [] | []
  refresh: Dispatch<SetStateAction<boolean>>
  ccLote?: TControlCalidad | null
}


const TablaMuestras: FC<IRendimientoMuestra> = ({ data, refresh, id_lote, ccLote }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();
  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()
  const [estadoActivo, setEstadoActivo] = useState<string | null>(null)
  const [openModalRows, setOpenModalRows] = useState<{ [key: string]: boolean }>({});
  const [openModalEdicion, setOpenModalEdicion] = useState<{ [key: string]: boolean }>({});
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState<{ [key: string]: boolean }>({});

  const initialRows = [
    {
      envase: null,
      variedad: null,
      tipo_producto: '1',
      cantidad_envases: null
    },
  ]

  const [rows, setRows] = useState(
    initialRows.map((row, index) => ({ ...row, id: index }))
  );



  return (
    <div>
      <div
        className='relative p-5'>
        <TableContainer sx={{ height: 150 }}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10, }}>ID</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, }}>Fecha Registro</TableCell>
                <TableCell className='table-cell-6' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, }}>Registrado Por</TableCell>
                <TableCell className='table-cell-7' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              {data?.map((row: TRendimientoMuestra) => {
                return (
                  <TableRow key={row.id} className='table-row-body'>
                    <FilaControlMuestra
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

export default TablaMuestras;
