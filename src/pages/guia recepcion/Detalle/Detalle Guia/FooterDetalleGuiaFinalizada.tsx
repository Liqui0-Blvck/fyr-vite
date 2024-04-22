import { Dispatch, FC, SetStateAction, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useAuth } from '../../../../context/authContext';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import useDarkMode from '../../../../hooks/useDarkMode';
import { TCamion,TControlCalidad,TEnvases, TGuia, TLoteGuia } from '../../../../types/registros types/registros.types';
import { ESTADOS_GUIA_MP, ESTADOS_MP, TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../utils/select.constanst';
import Dropdown, { DropdownToggle, DropdownMenu, DropdownItem } from '../../../../components/ui/Dropdown'
import Button from '../../../../components/ui/Button';
import { HeroEye, HeroPencilSquare } from '../../../../components/icon/heroicons';
import ModalRegistro from '../../../../components/ModalForm.modal';
import FooterDetalleEnvase from '../Detalle Envases/FooterDetalleEnvase';
import '../../../../styles/index.css'

import { BiCheckDouble } from "react-icons/bi";
import LoteFilaCompleta from '../../Componentes Tabla/LoteFilaCompleta';



interface IFooterProps {
  data: TGuia,
  refresh: Dispatch<SetStateAction<boolean>>
}

const FooterDetalleGuiaFinalizada: FC<IFooterProps> = ({ data, refresh }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();
  const [openModalRows, setOpenModalRows] = useState<{ [key: string]: boolean }>({});

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

  const { data: envases } = useAuthenticatedFetch<TEnvases[]>(
    authTokens,
    validate,
    `/api/envasesmp/`
  )

  const { data: camiones } = useAuthenticatedFetch<TCamion[]>(
    authTokens,
    validate,
    `/api/registros/camiones/`
  )

  const variedadFilter = VARIEDADES_MP?.map((variedad) => ({
    value: String(variedad.value),
    label: variedad.label
  })) ?? []

  const tipoFrutaFilter = TIPO_PRODUCTOS_RECEPCIONMP?.map((producto) => ({
    value: String(producto.value),
    label: producto.label
  })) ?? []


  const camionAcoplado = camiones?.find(camion => camion?.id === Number(data?.camion))?.acoplado

  const { data: control_calidad} = useAuthenticatedFetch<TControlCalidad[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp` 
  )


  return (
    <div>
      <div
        className='relative'>
        <TableContainer className='table-container'>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                <TableCell className='table-cell-final-1' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10}}>N° Lote</TableCell>
                <TableCell className='table-cell-final-2' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Kilos Brutos Camión</TableCell>
                
                {camionAcoplado ? <TableCell className='table-cell-3' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10}}>Kilos Brutos Acoplado</TableCell> : null}
                <TableCell className='table-cell-final-2' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Kilos Tara</TableCell>
                <TableCell className='table-cell-final-2' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Kilos Envase</TableCell>
                <TableCell className='table-cell-final-2' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Kilos Fruta Neto</TableCell>

                <TableCell className='table-cell-final-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Tipo Envase</TableCell>
                <TableCell className='table-cell-final-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, }}>Variedad</TableCell>
                <TableCell className='table-cell-final-6' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, }}>Tipo Producto</TableCell>
                <TableCell className='table-cell-final-7' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Acciones</TableCell>
                <TableCell className='table-cell-final-7' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              {data?.lotesrecepcionmp.filter(row => row.estado_recepcion === '7' || row.estado_recepcion === '6').map((row: TLoteGuia) => {
                const control_calidad_filtro = control_calidad?.find(control => control.recepcionmp === row.id)?.estado_cc

                const kilos_total_envases = 
                  row.envases.map((envase_lote) => {
                  const envaseTotal = envases?.filter(envase => envase.id === envase_lote.envase)
                                                 .reduce((acumulador, envase) => acumulador + (envase_lote.cantidad_envases * envase.peso), 0);
                  return envaseTotal; 
                  }).reduce((acumulador, pesoTotal) => acumulador! + pesoTotal!, 0);

                  const kilos_netos_fruta = row.kilos_brutos_1 + row.kilos_brutos_2 - row?.kilos_tara_1 - row?.kilos_tara_2 - kilos_total_envases!;


                  console.log(row)
                return (
                  <TableRow key={row.id} className='table-row-body'>
                    <LoteFilaCompleta
                      lote={row}
                      guia={data}
                      acoplado={camionAcoplado!}
                      envases={envases}
                      filtro_variedad={variedadFilter}
                      filtro_productos={tipoFrutaFilter}
                      openModalRows={openModalRows}
                      setOpenModalRows={setOpenModalRows}
                      kilos_netos_fruta={kilos_netos_fruta}
                      kilos_total_envases={kilos_total_envases!}
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

export default FooterDetalleGuiaFinalizada;
