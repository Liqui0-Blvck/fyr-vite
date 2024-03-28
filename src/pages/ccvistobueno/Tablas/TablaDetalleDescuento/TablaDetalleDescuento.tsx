import { Dispatch, FC, SetStateAction } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import useDarkMode from '../../../../hooks/useDarkMode';
import { TControlCalidad, TRendimientoMuestra } from '../../../../types/registros types/registros.types';
import FilaControlDetalleDescuento_1 from './FilaControlDetalleDescuento_1';
import FilaControlDetalleDescuento_2 from './FilaControlDetalleDescuento_2';
import FilaControlDetalleDescuento_total from './FilaControlDetalleDescuento_total';
import useDeviceScreen from '../../../../hooks/useDeviceScreen';


interface IRendimientoMuestra {
  id_lote?: number
  data?: TRendimientoMuestra[] | []
  refresh?: Dispatch<SetStateAction<boolean>>
  ccLote?: TControlCalidad | null
}


const TablaDetalleDescuento: FC<IRendimientoMuestra> = ({ refresh, id_lote, ccLote }) => {
  const { isDarkTheme } = useDarkMode();
  const { width } = useDeviceScreen()

  return (
    <div>
      <div
        className='relative left-[80px] md:left-[0px] lg:left-0 p-5 h-full'>
        <TableContainer sx={{ height: `${width! < 1280 ? 250 : 200 }`}}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                <TableCell className='table-cell-5' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Aporte Proporcional PEX más Desechos</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Pepa Exp más Desechos Kilos</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Kilos a Lid Descontando la Merma</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>% A Liquidar Descontando la Merma</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Merma en Kilos</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Merma Porcentual</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              <TableRow className='table-col-body'>
                    <FilaControlDetalleDescuento_1
                      ccLote={ccLote}
                      id_lote={id_lote}
                      refresh={refresh}
                    />
              </TableRow>
              <TableRow>
                <FilaControlDetalleDescuento_2
                      ccLote={ccLote}
                      id_lote={id_lote}
                      refresh={refresh}
                    />
              </TableRow>
                <FilaControlDetalleDescuento_total
                      ccLote={ccLote}
                      id_lote={id_lote}
                      refresh={refresh}
                    />
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div >
  );
};

export default TablaDetalleDescuento;
