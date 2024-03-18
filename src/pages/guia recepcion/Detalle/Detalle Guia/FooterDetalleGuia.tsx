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
import { TCamion,TControlCalidad,TEnvases, TGuia, TLoteGuia } from '../../../../types/registros types/registros.types';
import { ESTADOS_GUIA_MP, ESTADOS_MP, TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../constants/select.constanst';
import { useNavigate } from 'react-router-dom';
import '../../../../styles/index.css'
import { usuarioRole,  perfilesPermitidos } from '../../../../constants/select.constanst';
import { FaIndustry } from "react-icons/fa6";
import { FaWeight } from "react-icons/fa";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import LoteFila from '../../Componentes Tabla/LoteFila';
import LoteFilaCompleta from '../../Componentes Tabla/LoteFilaCompleta';


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

const FooterDetalleGuia: FC<IFooterProps> = ({ data, refresh }) => {
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


  const formik = useFormik({
    initialValues: {
      kilos_brutos_1: 0,
      kilos_brutos_2: 0,
      kilos_tara_1: 0,
      kilos_tara_2: 0,
      estado_recepcion: null,
      guiarecepcion: null,
      creado_por: null,
    },
    onSubmit: async (values: any) => {
      const formData = new FormData()
      const lotesData = rows.map((row) => ({
        numero_lote: row.id,
        kilos_brutos_1: values.kilos_brutos_1,
        kilos_brutos_2: values.kilos_brutos_2,
        kilos_tara_1: 0,
        kilos_tara_2: 0,
        estado_recepcion: '1',
        guiarecepcion: data.id,
        creado_por: data.creado_por,
      }))
      formData.append('lotes', JSON.stringify(lotesData))
      const envasesData = rows.map((row) => ({
        envase: row.envase,
        variedad: row.variedad,
        tipo_producto: row.tipo_producto,
        cantidad_envases: row.cantidad_envases,
      }));
      formData.append('envases', JSON.stringify(envasesData));


      try {
        const res = await fetch(`${base_url}/api/recepcionmp/${data.id}/lotes/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: formData
        })
        if (res.ok) {
          toast.success("la guia de recepción fue registrado exitosamente!!", {
            className: 'h-[200px]'
          })
          navigate(`/app/recepciomp`)
        } else {
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const variedadFilter = VARIEDADES_MP?.map((variedad) => ({
    value: String(variedad.value),
    label: variedad.label
  })) ?? []

  const tipoFrutaFilter = TIPO_PRODUCTOS_RECEPCIONMP?.map((producto) => ({
    value: String(producto.value),
    label: producto.label
  })) ?? []

  const { data: control_calidad} = useAuthenticatedFetch<TControlCalidad[]>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp` 
  )

  const camionAcoplado = camiones?.find(camion => camion?.id === Number(data?.camion))?.acoplado

  console.log(data)

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className='relative'>
        <TableContainer className='table-container'>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                <TableCell className='table-cell-1' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10}}>N° Lote</TableCell>
                <TableCell className='table-cell-2' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Kilos Brutos Camión</TableCell>
                {camionAcoplado ? <TableCell className='table-cell-3' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10}}>Kilos Brutos Acoplado</TableCell> : null}
                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Tipo Envase</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, }}>Variedad</TableCell>
                <TableCell className='table-cell-6' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, }}>Tipo Producto</TableCell>
                <TableCell className='table-cell-7' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              {data && data.lotesrecepcionmp.map((row: TLoteGuia) => {
                return (
                  <TableRow key={row.id} className='table-row-body'>
                    {
                      row.estado_recepcion < '7' 
                        ? <LoteFila
                            lote={row}
                            guia={data}
                            acoplado={camionAcoplado!}
                            envases={envases}
                            filtro_variedad={variedadFilter}
                            filtro_productos={tipoFrutaFilter}
                            openModalRows={openModalRows}
                            setOpenModalRows={setOpenModalRows}
                            openModalEdicion={openModalEdicion}
                            setOpenModalEdicion={setOpenModalEdicion}
                            openModalConfirmacion={openModalConfirmacion}
                            setOpenModalConfirmacion={setOpenModalConfirmacion}
                            estadoActivo={estadoActivo}
                            setEstadoActivo={setEstadoActivo}
                            refresh={refresh}
                            />
                        : null 
                    }
                  </TableRow>

                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </div >
  );
};

export default FooterDetalleGuia;
