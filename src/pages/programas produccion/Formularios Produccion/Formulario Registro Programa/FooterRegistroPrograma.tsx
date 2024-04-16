import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react'
import useDarkMode from '../../../../hooks/useDarkMode'
import FilaRegistroPrograma from './FilaRegistroPrograma'
import { TPatioTechadoEx } from '../../../../types/registros types/registros.types';
import { TablePagination } from '@mui/material';

interface IRegistroProgramaProps {
  lote: TPatioTechadoEx[] | []
  refresh: Dispatch<SetStateAction<boolean>>
}

const FooterRegistroPrograma: FC<IRegistroProgramaProps> = ({ lote, refresh }) => {
  const { isDarkTheme} = useDarkMode()
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  return (
    <div>
      <TableContainer className='table-container-registro' sx={{ height: 575 ,overflow: 'hidden', overflowY: 'auto', overflowX: 'auto' }}>
        <Table style={{ background: `${isDarkTheme ? '#09090B' : 'white'}` }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Guia Patio</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>N° Lote</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Variedad</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Cantidad Envases</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Detalles</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Info CDC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className='table-body'>
            {
              lote?.filter(lote => lote.envases.length > 0 && lote.envases.some(envase => envase.estado_envase !== '2')).
              slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).
              map((envase: TPatioTechadoEx) => {
                return (
                  <TableRow style={{ height: 50, overflowY: 'auto' }}>
                    <FilaRegistroPrograma ubicacion={envase.ubicacion_label} row={envase.envases} id_row={envase.id} variedad={envase.variedad} refresh={refresh}/>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <TablePagination
            sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`, color: `${isDarkTheme ? 'white' : 'black'}` }}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={lote?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
      </TableContainer>
    </div>
  )
}

export default FooterRegistroPrograma
