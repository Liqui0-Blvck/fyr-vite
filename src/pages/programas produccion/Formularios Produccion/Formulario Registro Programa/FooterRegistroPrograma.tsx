import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { FC } from 'react'
import useDarkMode from '../../../../hooks/useDarkMode'
import FilaRegistroPrograma from './FilaRegistroPrograma'
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { TEnvasePatio, TPatioTechadoEx } from '../../../../types/registros types/registros.types';

interface IRegistroProgramaProps {
  lote?: TPatioTechadoEx[] | []
}

const FooterRegistroPrograma: FC<IRegistroProgramaProps> = ({ lote }) => {
  const { isDarkTheme} = useDarkMode()

  console.log(lote)
  return (
    <div>
      <TableContainer className='table-container-registro' sx={{ height: 510 ,overflow: 'hidden', overflowY: 'auto', overflowX: 'auto' }}>
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
              lote?.map((envase: TPatioTechadoEx) => {
                console.log(envase)
                return (
                  <TableRow style={{ height: 50 }}>
                    <FilaRegistroPrograma row={envase.envases}/>
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
