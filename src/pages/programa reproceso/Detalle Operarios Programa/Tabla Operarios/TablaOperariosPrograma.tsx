import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
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
import { TControlCalidad, TOperarioProduccion, TProduccion, TRendimientoMuestra, TReprocesoProduccion } from '../../../../types/registros types/registros.types';
import Modal from '../../../../components/ui/Modal';
import ModalRecordatorio from '../../../../components/utils/ModalWarning';
import ModalConfirmacion from '../../../../components/ModalConfirmacion';
import { GoQuestion } from 'react-icons/go';
import ModalForm from '../../../../components/ModalRegistro';
import FilaOperarioPrograma from './FilaOperariosPrograma';
import { TablePagination } from '@mui/material';
import FormularioRegistroOperarioPrograma from '../../../programas produccion/Formularios Produccion/Formulario Registro Operario/FormularioRegistroOperario';
import FormularioRegistroOperarioProgramaReproceso from '../../Formularios Produccion/Formulario Registro Operario/FormularioRegistroOperario';


interface ITablaOperariosProps {
  operarios: TOperarioProduccion[] | []
  programa_produccion: TReprocesoProduccion
  refresh: Dispatch<SetStateAction<boolean>>
}




const TablaOperariosPrograma: FC<ITablaOperariosProps> = ({ operarios, refresh, programa_produccion }) => {
  const { isDarkTheme } = useDarkMode();
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false)
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

  const verificarOperariosEnPrograma = () => {
    if (operarios?.length === 0 ) {
      setShowWarning(true);
    }
  };

  useEffect(() => {
    verificarOperariosEnPrograma();
  }, [operarios]); // Solo se ejecuta una vez al montar el componente


  return (
    <div>
      {
        showWarning
          ? (
            <div className='w-full h-full py-10 flex items-center justify-center flex-col gap-10'>
              <h1 className='text-center'>Advertencia, ¡No podrá cerrar el programa sin operarios dentro!</h1>
              <GoQuestion className=" text-9xl text-yellow-500" />


              <div className=''>
                <ModalForm
                  open={open}
                  setOpen={setOpen}
                  width='bg-blue-800 hover:bg-blue-700 hover:scale-105 px-7 py-4 text-lg'
                  textButton={`Registrar Operarios al programa`}
                  >
                  <FormularioRegistroOperarioProgramaReproceso refresh={refresh} setOpen={setOpen}/>
                </ModalForm>
              </div>
            </div>
          )
          : (
            <div
                className='relative left-[0px] lg:left-0 p-5 '>
              <div className='w-full h-20 flex items-center justify-between'>
                <div className='w-8/12 h-full'>
                  <div className='w-full h-full mb-5 flex gap-5 items-center'>
                    <span>Buscar Tarja de Producción MP: </span>
                    <input type="text" onChange={handleChange} className='w-5/12 dark:bg-zinc-600 bg-zinc-300 px-4 py-2 rounded-md '/>
                  </div>
                </div>

                {
                  showWarning
                    ? null
                    : programa_produccion.estado === '5'
                      ? null
                      : (
                        <div className=''>
                          <ModalForm
                            title={`Registro Operario al Programa `}
                            open={open}
                            setOpen={setOpen}
                            width='bg-blue-800 hover:bg-blue-700 hover:scale-105 px-7 py-4 text-lg text-white'
                            textButton={`Registrar Operarios al programa`}
                            >
                            <FormularioRegistroOperarioPrograma refresh={refresh} setOpen={setOpen}/>
                          </ModalForm>
                        </div>
                      )
                }
              </div>

              <TableContainer sx={{ height: 320, borderRadius: 3 }}>
                <Table className='table' aria-label="simple table">
                  <TableHead className='table-header'>
                    <TableRow className='table-row' sx={{ borderRadius: 5, backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                      <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Nombre</TableCell>
                      <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Rut</TableCell>
                      <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Tipo Operario</TableCell>
                      <TableCell className='table-cell-3' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Kilos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className='table-body' >
                    {operarios?.
                      slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).
                      filter(operario => 
                        operario.nombres.toString().toLowerCase().includes(search) ||
                        operario.rut_operario.toString().toLowerCase().includes(search) ||
                        operario.tipo_operario.toString().toLowerCase().includes(search)
                      ).
                      map((row: TOperarioProduccion) => {
                      console.log(row)
                      return (
                        <TableRow key={row.id} className='table-row-body' style={{ overflowX: 'auto', height: 44}}>
                            <FilaOperarioPrograma operario={row!}/>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                <TablePagination
                  sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, color: `${isDarkTheme ? 'white' : 'black'}` }}
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={operarios?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </div>
          )
      }
      
    </div >
  );
};

export default TablaOperariosPrograma;
