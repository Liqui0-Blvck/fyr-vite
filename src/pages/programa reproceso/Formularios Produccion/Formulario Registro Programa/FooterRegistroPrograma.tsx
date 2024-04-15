import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { Dispatch, FC, SetStateAction } from 'react'
import useDarkMode from '../../../../hooks/useDarkMode'
import FilaRegistroPrograma from './FilaRegistroPrograma'
import { TBinBodega, TBinEnReproceso, TPatioTechadoEx } from '../../../../types/registros types/registros.types';
import { useLocation } from 'react-router-dom';
import { urlNumeros } from '../../../../services/url_number';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { useAuth } from '../../../../context/authContext';

interface IRegistroProgramaProps {
  bin: TBinBodega[] | []
  refresh: Dispatch<SetStateAction<boolean>>
}

const FooterRegistroPrograma: FC<IRegistroProgramaProps> = ({ bin, refresh }) => {
  const { isDarkTheme} = useDarkMode()
  const { authTokens, validate, perfilData } = useAuth()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)

  const { data: bin_en_reproceso, setRefresh } = useAuthenticatedFetch<TBinEnReproceso[]>(
    authTokens,
    validate,
    `/api/reproceso/${id}/bins_en_reproceso`
  )
  
  console.log(bin_en_reproceso)
  
  return (
    <div>
      <TableContainer className='table-container-registro' sx={{ height: 450 ,overflow: 'hidden', overflowY: 'auto', overflowX: 'auto' }}>
        <Table style={{ background: `${isDarkTheme ? '#09090B' : 'white'}` }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Tarja</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Programa</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Kilos</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Variedad</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Calibre</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Bddega</TableCell>
              <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Añadir</TableCell>
            </TableRow> 
          </TableHead>
          <TableBody className='table-body'>
            {
              bin?.
              filter(row => row.tipo_binbodega_id !== 73 &&
               row.tipo_binbodega_id !== 74 && 
              !bin_en_reproceso?.some(bin => bin.id_bin_bodega === row.id_binbodega) ).
              map((envase: TBinBodega) => {
                console.log(envase.id_binbodega)
                return (
                  <TableRow style={{ height: 50, overflowY: 'auto' }}>
                    <FilaRegistroPrograma row={envase} refresh={setRefresh}/>
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
