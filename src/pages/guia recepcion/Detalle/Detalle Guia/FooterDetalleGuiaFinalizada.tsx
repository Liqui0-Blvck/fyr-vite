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
import { TCamion,TEnvases, TGuia, TLoteGuia } from '../../../../types/registros types/registros.types';
import { ESTADOS_GUIA_MP, ESTADOS_MP, TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../constants/select.constanst';
import Dropdown, { DropdownToggle, DropdownMenu, DropdownItem } from '../../../../components/ui/Dropdown'
import Button from '../../../../components/ui/Button';
import { HeroEye, HeroPencilSquare } from '../../../../components/icon/heroicons';
import ModalRegistro from '../../../../components/ModalRegistro';
import FooterDetalleEnvase from '../Detalle Envases/FooterDetalleEnvase';
import '../../../../styles/index.css'

import { BiCheckDouble } from "react-icons/bi";



interface IFooterProps {
  data: TGuia,
}

const FooterDetalleGuiaFinalizada: FC<IFooterProps> = ({ data }) => {
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

  const estadoRecepcion = ESTADOS_MP?.map((estado) => ({
    value: String(estado.value),
    label: estado.label
  })) ?? []

  const estadoGuiaMP = ESTADOS_GUIA_MP?.map((estado) => ({
    value: String(estado.value),
    label: estado.label
  })) ?? []

  const camionAcoplado = camiones?.find(camion => camion?.id === Number(data?.camion))?.acoplado


  console.log(envases)
  return (
    <div>
      <div
        className='relative'>
        <TableContainer className='table-container'>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                <TableCell className='table-cell-1' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10}}>N° Lote</TableCell>
                <TableCell className='table-cell-2' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Kilos Brutos Camión</TableCell>
                
                {camionAcoplado ? <TableCell className='table-cell-3' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10}}>Kilos Brutos Acoplado</TableCell> : null}
                <TableCell className='table-cell-2' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Kilos Tara</TableCell>
                <TableCell className='table-cell-2' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Kilos Envase</TableCell>
                <TableCell className='table-cell-2' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Kilos Fruta Neto</TableCell>

                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10,}}>Tipo Envase</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, }}>Variedad</TableCell>
                <TableCell className='table-cell-6' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, }}>Tipo Producto</TableCell>
                <TableCell className='table-cell-7' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Acciones</TableCell>
                <TableCell className='table-cell-7' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body'>
              {data && data.lotesrecepcionmp.map((row: TLoteGuia) => { 
                const kilos_total_envases = 
                  row.envases.map((envase_lote) => {
                  const envaseTotal = envases?.filter(envase => envase.id === envase_lote.envase)
                                                 .reduce((acumulador, envase) => acumulador + (envase_lote.cantidad_envases * envase.peso), 0);
                  return envaseTotal; // Retornar el peso total de envases
                  }).reduce((acumulador, pesoTotal) => acumulador! + pesoTotal!, 0);

                  const kilos_netos_fruta = row.kilos_brutos_1 + row.kilos_brutos_2 - data?.tara_camion_1 - data?.tara_camion_2 - kilos_total_envases!;
                  

              
          
              

              
              


                return (
                  <TableRow key={row.id} className='table-row-body'>
                    <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote}</span>
                      </div>
                    </TableCell>
                    <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_brutos_1}.0 kgs</span>
                      </div>
                    </TableCell>
                    {
                      camionAcoplado
                        ? (
                          <TableCell className='table-cell-row-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                            <div className=' h-full w-full flex items-center justify-center'>
                              <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_brutos_2}.0 kgs</span>
                            </div>
                          </TableCell>
                        )
                        : null
                    }
                    <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{data?.tara_camion_1}.0 kgs</span>
                      </div>
                    </TableCell>

                    {
                      camionAcoplado
                        ? (
                          <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                            <div className=' h-full w-full flex items-center justify-center'>
                              <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{data?.tara_camion_2}.0 kgs</span>
                            </div>
                          </TableCell>
                        )
                        : null
                    }

                    <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{kilos_total_envases?.toFixed(2)} kgs</span>
                      </div>
                    </TableCell>

                    <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{kilos_netos_fruta?.toFixed(2)} kgs</span>
                      </div>
                    </TableCell>

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
              
                      </div>
                   </TableCell >

                   <TableCell className='table-cell-row-8' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
                      {data.estado_recepcion === '4' ? <BiCheckDouble className='text-4xl text-green-700'/> : 'Veremos' }
                   </TableCell>
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
