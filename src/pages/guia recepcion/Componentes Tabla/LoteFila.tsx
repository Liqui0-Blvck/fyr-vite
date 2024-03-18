import { TableCell } from '@mui/material'

import useDarkMode from '../../../hooks/useDarkMode'
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../../../components/ui/Dropdown'
import Button from '../../../components/ui/Button'
import ModalRegistro from '../../../components/ModalRegistro'
import FooterDetalleEnvase from '../Detalle/Detalle Envases/FooterDetalleEnvase'
import FooterFormularioEdicionEnvase from '../Formulario Edicion/Edicion Envase/FooterFormularioEdicionEnvase'
import { HeroEye, HeroPencilSquare } from '../../../components/icon/heroicons'
import { Dispatch, FC, SetStateAction } from 'react'
import ModalBodega from '../Formulario Edicion/Edicion Estado Modal/ModalBodega'
import ModalRecepcion from '../Formulario Edicion/Edicion Estado Modal/ModalRecepcion'
import ModalControlCalidad from '../Formulario Edicion/Edicion Estado Modal/ModalControlCalidad'
import { TEnvaseEnGuia, TEnvases, TGuia, TLoteGuia } from '../../../types/registros types/registros.types'
import { ESTADOS_MP, perfilesPermitidos, usuarioRole } from '../../../constants/select.constanst'
import { FaIndustry } from 'react-icons/fa6'
import { FaWeight } from 'react-icons/fa'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'

interface ILoteCompletadoProps {
  lote: TLoteGuia | null
  guia: TGuia | null
  acoplado: boolean
  envases: TEnvases[] | null
  filtro_variedad: any
  filtro_productos: any
  openModalRows: { [key: string]: boolean };
  setOpenModalRows: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  openModalEdicion: { [key: string]: boolean };
  setOpenModalEdicion: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  openModalConfirmacion: { [key: string]: boolean };
  setOpenModalConfirmacion: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  estadoActivo: string | null
  setEstadoActivo: Dispatch<SetStateAction<string | null>>
  refresh: Dispatch<SetStateAction<boolean | null>>
}

const LoteFila: FC<ILoteCompletadoProps> = (
  { lote: row,
    guia,
    acoplado,
    envases,
    filtro_variedad,
    filtro_productos,
    openModalRows,
    setOpenModalRows,
    openModalEdicion,
    setOpenModalEdicion,
    openModalConfirmacion,
    setOpenModalConfirmacion,
    estadoActivo,
    setEstadoActivo,
    refresh
   }
  ) => {
  const { isDarkTheme } = useDarkMode()
  const bodega_estado = 1
  const estadoRecepcion = ESTADOS_MP?.map((estado) => ({
    value: String(estado.value),
    label: estado.label
  })) ?? []
  
  const estadoActivoCoincide = estadoRecepcion.find((estado) => estado.value === (row?.estado_recepcion! ? row?.estado_recepcion! : '1'))


  const modalTitle = perfilesPermitidos.includes(usuarioRole.area) && (
    usuarioRole.area === 'Bodega' ? 
        'Seleccionar Bodega' :
    usuarioRole.area === 'Recepcion' ? 
        'Registrar Tara Camión' :
    usuarioRole.area === 'Control Calidad' ? 
        'Registrar Control de Calidad' :
    ''
  );

  const iconComponent = perfilesPermitidos.includes(usuarioRole.area) && (
    usuarioRole.area === 'Bodega' ? 
        <FaIndustry className='text-2xl'/> :
    usuarioRole.area === 'Recepcion' ? 
        <FaWeight className='text-2xl'/> :
    usuarioRole.area === 'Control Calidad' ? 
        <>
          {
          row?.estado_recepcion! <= '3'
            ? <HiOutlineClipboardDocumentList className='text-3xl'/>
            : null
          }
        </> :
    null
  );


  

  return (
    <>
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
        acoplado
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
              const variedad_nombre = filtro_variedad.find((variedad : any) => variedad.value === variedadId)?.label;
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
              const tipoProductoNombre = filtro_productos.find((producto : any) => producto.value === tipoProductoId)?.label;
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
          open={openModalRows[row?.id!] || false}
          setOpen={(isOpen: Dispatch<SetStateAction<boolean | null>>) => setOpenModalRows(prevState => ({ ...prevState, [row?.id!]: isOpen }))}
          title='Detalle Envases'
          textTool='Detalle'
          size={900}
          width={`w-20 h-16 md:h-16 lg:h-11 px-2 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
          icon={<HeroEye style={{ fontSize: 25 }} 
          />}
        >
          <FooterDetalleEnvase id_lote={row?.id!} id_guia={guia?.id!}/>
        </ModalRegistro>
      
        {
          guia?.estado_recepcion === '4'
            ? null
            : (
              <ModalRegistro
                open={openModalEdicion[row?.id!] || false}
                setOpen={(isOpen: Dispatch<SetStateAction<boolean | null>>) => setOpenModalEdicion(prevState => ({ ...prevState, [row?.id!]: isOpen }))}
                title='Detalle Envases'
                textTool='Detalle'
                size={900}
                width={`w-20 h-16 md:h-16 lg:h-11 px-2 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                icon={<HeroPencilSquare style={{ fontSize: 25 }} 
                />}
                >
                <FooterFormularioEdicionEnvase id_lote={row?.id!} id_guia={guia?.id!}/>
              </ModalRegistro>
            )
        }

        {
          perfilesPermitidos.includes(usuarioRole.area) && (

            <>
              {
                usuarioRole.area == 'Control Calidad' && row?.estado_recepcion! <= '2'
                  ? (
                    <ModalRegistro
                      open={openModalConfirmacion[row?.id!] || false}
                      setOpen={(isOpen: Dispatch<SetStateAction<boolean | null>>) => setOpenModalConfirmacion(prevState => ({ ...prevState, [row?.id!]: isOpen }))}
                      title={modalTitle}
                      textTool='Detalle'
                      size={450}
                      width={`w-full h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                      icon={iconComponent}
                    >
                      {
                        perfilesPermitidos.includes(usuarioRole.area) && (
                            usuarioRole.area === 'Control Calidad' ? 
                              <>
                              {
                                row?.estado_recepcion! <= '3'
                                  ? <ModalControlCalidad id={row?.id!} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row} guia_id={guia?.id!}/>
                                  : null
                      
                              }
                              </> :
                            null
                        )
                      }
                  </ModalRegistro>
                  )
                  : usuarioRole.area === 'Recepcion' &&  row?.estado_recepcion! === '5'
                      ? (
                        <ModalRegistro
                          open={openModalConfirmacion[row?.id!] || false}
                          setOpen={(isOpen: Dispatch<SetStateAction<boolean | null>>) => setOpenModalConfirmacion(prevState => ({ ...prevState, [row?.id!]: isOpen }))}
                          title={modalTitle}
                          textTool='Detalle'
                          size={700}
                          width={`w-full h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                          icon={iconComponent}
                        >
                          {
                            perfilesPermitidos.includes(usuarioRole.area) && (
                                usuarioRole.area === 'Recepcion' 
                                  ? <ModalRecepcion id={row?.id!} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row} guia={guia!}/>  
                                  : null
                            )
                          }
                      </ModalRegistro>
                      )
                      : usuarioRole.area === 'Bodega' && bodega_estado === 1 && row?.estado_recepcion !== '5'
                          ? (
                            <ModalRegistro
                              open={openModalConfirmacion[row?.id!] || false}
                              setOpen={(isOpen: Dispatch<SetStateAction<boolean | null>>) => setOpenModalConfirmacion(prevState => ({ ...prevState, [row?.id!]: isOpen }))}
                              title={modalTitle}
                              textTool='Detalle'
                              size={450}
                              width={`w-full h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                              icon={iconComponent}
                            >
                              {
                                perfilesPermitidos.includes(usuarioRole.area) && (
                                    usuarioRole.area === 'Bodega' 
                                      ? <ModalBodega id={row?.id!} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row}/>
                                      : null  
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
    </>
    
  )
}

export default LoteFila
