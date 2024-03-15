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
import { TCamion,TEnvases, TGuia, TLoteGuia } from '../../../../types/registros types/registros.types';
import { ESTADOS_GUIA_MP, ESTADOS_MP, TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../constants/select.constanst';
import { useNavigate } from 'react-router-dom';
import Dropdown, { DropdownToggle, DropdownMenu, DropdownItem } from '../../../../components/ui/Dropdown'
import Button from '../../../../components/ui/Button';
import { HeroEye, HeroPencilSquare } from '../../../../components/icon/heroicons';
import ModalRegistro from '../../../../components/ModalRegistro';
import DetalleEnvase from '../Detalle Envases/DetalleEnvase';
import FooterDetalleEnvase from '../Detalle Envases/FooterDetalleEnvase';
import FooterFormularioEdicionEnvase from '../../Formulario Edicion/Edicion Envase/FooterFormularioEdicionEnvase';
import ModalBasicText from '../../Formulario Edicion/Edicion Estado Modal/ModalControlCalidad';
import '../../../../styles/index.css'
import { usuarioRole,  perfilesPermitidos } from '../../../../constants/select.constanst';
import ModalBodega from '../../Formulario Edicion/Edicion Estado Modal/ModalBodega';
import ModalRecepcion from '../../Formulario Edicion/Edicion Estado Modal/ModalRecepcion';
import ModalControlCalidad from '../../Formulario Edicion/Edicion Estado Modal/ModalControlCalidad';
import { FaIndustry } from "react-icons/fa6";
import { FaWeight } from "react-icons/fa";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";


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
  const [lotes, setLotes] = useState<TLoteGuia | null>(null)
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

  const estadoRecepcion = ESTADOS_MP?.map((estado) => ({
    value: String(estado.value),
    label: estado.label
  })) ?? []

  const estadoGuiaMP = ESTADOS_GUIA_MP?.map((estado) => ({
    value: String(estado.value),
    label: estado.label
  })) ?? []

  const camionAcoplado = camiones?.find(camion => camion?.id === Number(data?.camion))?.acoplado

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
                const estadoActivoCoincide = estadoRecepcion.find((estado) => estado.value === (row.estado_recepcion ? row.estado_recepcion : '1'))
                console.log(row)
                const bodega_estado = 1

                const iconComponent = perfilesPermitidos.includes(usuarioRole.area) && (
                  usuarioRole.area === 'Bodega' ? 
                      <FaIndustry className='text-2xl'/> :
                  usuarioRole.area === 'Recepcion' ? 
                      <FaWeight className='text-2xl'/> :
                  usuarioRole.area === 'Control Calidad' ? 
                      <>
                        {
                        row.estado_recepcion >= '3'
                          ? null
                          : <HiOutlineClipboardDocumentList className='text-3xl'/>
                        }
                      </> :
                  null
                );
              
                const modalTitle = perfilesPermitidos.includes(usuarioRole.area) && (
                  usuarioRole.area === 'Bodega' ? 
                      'Seleccionar Bodega' :
                  usuarioRole.area === 'Recepcion' ? 
                      'Registrar Tara Camión' :
                  usuarioRole.area === 'Control Calidad' ? 
                      'Registrar Control de Calidad' :
                  ''
                );

                return (
                  <TableRow key={row.id} className='table-row-body'>
                    <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote}</span>
                      </div>
                    </TableCell>
                    <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_brutos_1}</span>
                      </div>
                    </TableCell>
                    {
                      camionAcoplado
                        ? (
                          <TableCell className='table-cell-row-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                            <div className=' h-full w-full flex items-center justify-center'>
                              <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_brutos_2}</span>
                            </div>
                          </TableCell>
                        )
                        : null
                    }
                    <TableCell className='table-cell-row-4' component="th" scope="row"sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <Dropdown>
                        <DropdownToggle>
                          <Button className='w-64 h-full px-12 text-white justify-around text-xl'>
                            Envases
                          </Button>
                        </DropdownToggle>
                        <DropdownMenu className='w-64'>
                          {
                            row?.envases.map((envase) => {
                              const envasesList = envases?.find(envaseList => envaseList.id == envase.envase)
                              return (
                                <DropdownItem icon='HeroFolderOpen' className={`text-md ${isDarkTheme ? 'text-white' : 'text-black'}`}>{envasesList?.nombre}</DropdownItem>
                              )
                            })
                          }

                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>

                    <TableCell className='table-cell-row-5'sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        {
                          [...new Set(row?.envases.map(envase => envase.variedad))].map(variedadId => {
                            const variedad_nombre = variedadFilter.find(variedad => variedad.value === variedadId)?.label;
                            return (
                              <span key={variedadId} className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{variedad_nombre}</span>
                            );
                          })
                        }
                      </div>
                    </TableCell>

                    <TableCell className='table-cell-row-6' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <div className='h-full w-full flex items-center justify-center'>
                        {
                          [...new Set(row?.envases.map(envase => envase.tipo_producto))].map(tipoProductoId => {
                            const tipoProductoNombre = tipoFrutaFilter.find(producto => producto.value === tipoProductoId)?.label;
                            return (
                              <span key={tipoProductoId} className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{tipoProductoNombre}</span>
                            );
                          })
                        }
                      </div>
                    </TableCell>
                    <TableCell className='table-cell-row-7' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <div className='flex gap-5 items-center justify-center w-full h-full'>
                      <ModalRegistro
                        open={openModalRows[row.id] || false}
                        setOpen={(isOpen: Dispatch<SetStateAction<boolean>>) => setOpenModalRows(prevState => ({ ...prevState, [row.id]: isOpen }))}
                        title='Detalle Envases'
                        textTool='Detalle'
                        size={900}
                        width={`w-20 h-16 md:h-16 lg:h-11 px-2 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                        icon={<HeroEye style={{ fontSize: 25 }} 
                        />}
                      >
                        <FooterDetalleEnvase id_lote={row.id} id_guia={data?.id!}/>
                      </ModalRegistro>
                    
                      {
                        data.estado_recepcion === '4'
                          ? null
                          : (
                            <ModalRegistro
                              open={openModalEdicion[row.id] || false}
                              setOpen={(isOpen: Dispatch<SetStateAction<boolean>>) => setOpenModalEdicion(prevState => ({ ...prevState, [row.id]: isOpen }))}
                              title='Detalle Envases'
                              textTool='Detalle'
                              size={900}
                              width={`w-20 h-16 md:h-16 lg:h-11 px-2 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                              icon={<HeroPencilSquare style={{ fontSize: 25 }} 
                              />}
                              >
                              <FooterFormularioEdicionEnvase id_lote={row.id} id_guia={data?.id!}/>
                            </ModalRegistro>
                          )
                      }

                      {
                        perfilesPermitidos.includes(usuarioRole.area) && (

                          <>
                            {
                              row.estado_recepcion < '3' && usuarioRole.area == 'Control Calidad'
                                ? (
                                  <ModalRegistro
                                    open={openModalConfirmacion[row.id] || false}
                                    setOpen={(isOpen: Dispatch<SetStateAction<boolean>>) => setOpenModalConfirmacion(prevState => ({ ...prevState, [row.id]: isOpen }))}
                                    title={modalTitle}
                                    textTool='Detalle'
                                    size={450}
                                    width={`w-full h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                                    icon={iconComponent}
                                  >
                                    {
                                      perfilesPermitidos.includes(usuarioRole.area) && (
                                          usuarioRole.area === 'Bodega' ? 
                                              <ModalBodega id={row.id} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row}/> :
                                          usuarioRole.area === 'Recepcion' ? 
                                              <ModalRecepcion id={row.id} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row}/> :
                                          usuarioRole.area === 'Control Calidad' ? 
                                            <>
                                            {
                                              row.estado_recepcion >= '3'
                                                ? null
                                                : (
                                                  (
                                                    <ModalControlCalidad id={row.id} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row} guia_id={data?.id}/>
                                                  )
                                                )
                                            }
                                            </> :
                                          null
                                      )
                                    }
                                </ModalRegistro>
                                )
                                : usuarioRole.area === 'Recepcion' &&  data.estado_recepcion === '2'
                                    ? (
                                      <ModalRegistro
                                        open={openModalConfirmacion[row.id] || false}
                                        setOpen={(isOpen: Dispatch<SetStateAction<boolean>>) => setOpenModalConfirmacion(prevState => ({ ...prevState, [row.id]: isOpen }))}
                                        title={modalTitle}
                                        textTool='Detalle'
                                        size={700}
                                        width={`w-full h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                                        icon={iconComponent}
                                      >
                                        {
                                          perfilesPermitidos.includes(usuarioRole.area) && (
                                              usuarioRole.area === 'Bodega' ? 
                                                  <ModalBodega id={row.id} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row}/> :
                                              usuarioRole.area === 'Recepcion' ? 
                                                  <ModalRecepcion id={row.id} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row}/> :
                                              usuarioRole.area === 'Control Calidad' ? 
                                                <>
                                                {
                                                  row.estado_recepcion >= '3'
                                                    ? null
                                                    : (
                                                      (
                                                        <ModalControlCalidad id={row.id} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row}/>
                                                      )
                                                    )
                                                }
                                                </> :
                                              null
                                          )
                                        }
                                    </ModalRegistro>
                                    )
                                    : usuarioRole.area === 'Bodega' && bodega_estado === 1 
                                        ? (
                                          <ModalRegistro
                                        open={openModalConfirmacion[row.id] || false}
                                        setOpen={(isOpen: Dispatch<SetStateAction<boolean>>) => setOpenModalConfirmacion(prevState => ({ ...prevState, [row.id]: isOpen }))}
                                        title={modalTitle}
                                        textTool='Detalle'
                                        size={450}
                                        width={`w-full h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                                        icon={iconComponent}
                                      >
                                        {
                                          perfilesPermitidos.includes(usuarioRole.area) && (
                                              usuarioRole.area === 'Bodega' ? 
                                                  <ModalBodega id={row.id} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row}/> :
                                              usuarioRole.area === 'Recepcion' ? 
                                                  <ModalRecepcion id={row.id} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row}/> :
                                              usuarioRole.area === 'Control Calidad' ? 
                                                <>
                                                {
                                                  row.estado_recepcion >= '3'
                                                    ? null
                                                    : (
                                                      (
                                                        <ModalControlCalidad id={row.id} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row}/>
                                                      )
                                                    )
                                                }
                                                </> :
                                              null
                                          )
                                        }
                                    </ModalRegistro>
                                        )
                                        : null
                            }
                          </>
                        )
                      }
                    
                      </div>
                   </TableCell>
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
