import { Dispatch, FC, SetStateAction, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useAuth } from '../../../../context/authContext';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import useDarkMode from '../../../../hooks/useDarkMode';
import { TCamion, TControlCalidad, TEnvases, TGuia, TLoteGuia, TLoteRechazado } from '../../../../types/registros types/registros.types';
import { ESTADOS_GUIA_MP, ESTADOS_MP, TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../utils/select.constanst';
import { useNavigate } from 'react-router-dom';
import '../../../../styles/index.css'
import { usuarioRole, perfilesPermitidos } from '../../../../utils/select.constanst';
import { FaIndustry } from "react-icons/fa6";
import { FaWeight } from "react-icons/fa";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import LoteFila from '../../Componentes Tabla/LoteFila';
import LoteFilaCompleta from '../../Componentes Tabla/LoteFilaCompleta';
import LoteRechazadoFila from '../../Componentes Tabla/LoteRechazado';


interface Row {
  kilos_brutos_1: null,
  kilos_brutos_2: null,
  kilos_tara_1: null,
  kilos_tara_2: null,
  estado_recepcion: null,
  guiarecepcion: null,
  creado_por: null
}

interface IFooterProps {
  data: TGuia,
  refresh: Dispatch<SetStateAction<boolean>>
}

const FooterDetalleRechazado: FC<IFooterProps> = ({ data, refresh }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();
  // const base_url = process.env.VITE_BASE_URL_DEV
  // const navigate = useNavigate()
  // const [estadoActivo, setEstadoActivo] = useState<string | null>(null)
  // const [openModalRows, setOpenModalRows] = useState<{ [key: string]: boolean }>({});
  // const [openModalEdicion, setOpenModalEdicion] = useState<{ [key: string]: boolean }>({});
  // const [openModalConfirmacion, setOpenModalConfirmacion] = useState<{ [key: string]: boolean }>({});

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

  const { data: lotes_rechazados, setRefresh } = useAuthenticatedFetch<TLoteRechazado[]>(
    authTokens,
    validate,
    `/api/lotes-rechazados/`
  )


  console.log(lotes_rechazados)


  // const camionAcoplado = camiones?.find(camion => camion?.id === Number(data?.camion))?.acoplado


  return (
    <div>
      <div className='relative'>
        <TableContainer className='table-container'>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                <TableCell className='table-cell-1' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10 }}>N° Lote</TableCell>
                <TableCell className='table-cell-2' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10, }}>Rechazado por</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, }}>Motivo de rechazo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              {
                lotes_rechazados?.
                filter(lote_rechazado => 
                  data?.lotesrecepcionmp.some((lote: TLoteGuia) => lote.id === lote_rechazado.recepcionmp))
                .map((lote_rechazado) => {
                  return (
                    <TableRow key={lote_rechazado.id} className='table-row-body'>
                      {
                          <LoteRechazadoFila
                            lote={lote_rechazado}
                            refresh={setRefresh}
                          />
                      }
                    </TableRow>
              
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div >
  );
};

export default FooterDetalleRechazado;

{/* {data?.lotesrecepcionmp
    .filter((lote: TLoteGuia) => lotes_rechazados?.some(lote_rechazado => lote_rechazado.recepcionmp === lote.id))
    .map((row: TLoteGuia) => {
    console.log(row)
    return (
      <TableRow key={row.id} className='table-row-body'>
        {
          row.estado_recepcion === '3'
            ? <LoteRechazadoFila
              lote={row}
            />
            : null
        }
      </TableRow>

    )
  })} */}