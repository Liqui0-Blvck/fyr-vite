import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { Dispatch, FC, SetStateAction } from 'react'
import useDarkMode from '../../../../hooks/useDarkMode'
import FilaRegistroPrograma from './FilaRegistroPrograma'
import { TPatioTechadoEx } from '../../../../types/registros types/registros.types';

interface IRegistroProgramaProps {
  lote: TPatioTechadoEx[] | []
  refresh: Dispatch<SetStateAction<boolean>>
}

const FooterRegistroPrograma: FC<IRegistroProgramaProps> = ({ lote, refresh }) => {
  const { isDarkTheme} = useDarkMode()

  
  return (
    <div>
      <TableContainer className='table-container-registro' sx={{ height: 450 ,overflow: 'hidden', overflowY: 'auto', overflowX: 'auto' }}>
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
              lote?.filter(lote => lote.envases.length > 0 && lote.envases.some(envase => envase.estado_envase !== '2')).map((envase: TPatioTechadoEx) => {
                return (
                  <TableRow style={{ height: 50, overflowY: 'auto' }}>
                    <FilaRegistroPrograma ubicacion={envase.ubicacion_label} row={envase.envases} id_row={envase.id} variedad={envase.variedad} refresh={refresh}/>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default FooterRegistroPrograma
