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
import { TCargo, TEnvaseEnGuia, TEnvases, TGuia, TLoteGuia } from '../../../types/registros types/registros.types'
import { CARGOS_PERFILES, ESTADOS_MP, checkCargoPerfil, perfilesPermitidos } from '../../../constants/select.constanst'
import { FaIndustry } from 'react-icons/fa6'
import { FaWeight } from 'react-icons/fa'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import { estadoRecepcion } from '../../../utils/estadosConstantes'
import { useAuth } from '../../../context/authContext'

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
    setEstadoActivo,
    refresh
  }
) => {
  const { perfilData } = useAuth()
  const { isDarkTheme } = useDarkMode()


  const estadoActivoCoincide = estadoRecepcion.find((estado) => estado.value === (row?.estado_recepcion! ? row?.estado_recepcion! : '1'))


  const cargoLabels = perfilData?.cargos.map(cargo => cargo.cargo_label) || [];
  const modalTitle = cargoLabels.some(label => CARGOS_PERFILES.includes(label)) ?
    (cargoLabels.includes('Bodega Patio Exterior') ? 'Seleccionar Bodega' :
    cargoLabels.includes('RecepcionMP') ? 'Registrar Tara Camión' :
    cargoLabels.includes('CDC Jefatura') ? 'Registrar Control de Calidad' : '') : '';

  const iconComponent = cargoLabels.some(label => CARGOS_PERFILES.includes(label)) ?
    (cargoLabels.includes('Bodega Patio Exterior') ?  <FaIndustry className='text-2xl' /> :
    cargoLabels.includes('RecepcionMP') && row?.estado_recepcion === '5' ? <FaWeight className='text-2xl' /> :
    cargoLabels.includes('CDC Jefatura')  ? <HiOutlineClipboardDocumentList className='text-3xl'/>: '' ) : ''
    

    console.log(cargoLabels.includes('RecepcionMP'))


  return (
    <>
      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_brutos_1}</span>
        </div>
      </TableCell>
      {
        acoplado
          ? (
            <TableCell className='table-cell-row-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
              <div className=' h-full w-full flex items-center justify-center'>
                <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_brutos_2}</span>
              </div>
            </TableCell>
          )
          : null
      }
      <TableCell className='table-cell-row-4' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
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

      <TableCell className='table-cell-row-5' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          {
            [...new Set(row?.envases.map(envase => envase.variedad))].map(variedadId => {
              const variedad_nombre = filtro_variedad.find((variedad: any) => variedad.value === variedadId)?.label;
              return (
                <span key={variedadId} className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{variedad_nombre}</span>
              );
            })
          }
        </div>
      </TableCell>

      <TableCell className='table-cell-row-6' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className='h-full w-full flex items-center justify-center'>
          {
            [...new Set(row?.envases.map(envase => envase.tipo_producto))].map(tipoProductoId => {
              const tipoProductoNombre = filtro_productos.find((producto: any) => producto.value === tipoProductoId)?.label;
              return (
                <span key={tipoProductoId} className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{tipoProductoNombre}</span>
              );
            })
          }
        </div>
      </TableCell>
      <TableCell className='table-cell-row-7' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
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
            <FooterDetalleEnvase id_lote={row?.id!} id_guia={guia?.id!} />
          </ModalRegistro>

          {
            checkCargoPerfil(perfilData.cargos) && row?.estado_recepcion! >= '2'
              ? null
              : cargoLabels.includes('RecepcionMP')
                ? (
                  <ModalRegistro
                    open={openModalEdicion[row?.id!] || false}
                    setOpen={(isOpen: Dispatch<SetStateAction<boolean | null>>) => setOpenModalEdicion(prevState => ({ ...prevState, [row?.id!]: isOpen }))}
                    title='Detalle Envases'
                    textTool='Edicion'
                    size={900}
                    width={`w-20 h-16 md:h-16 lg:h-11 px-2 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                    icon={<HeroPencilSquare style={{ fontSize: 25 }}
                    />}
                  >
                    <FooterFormularioEdicionEnvase id_lote={row?.id!} id_guia={guia?.id!} />
                  </ModalRegistro>
                )
                : null
          }

          {
            checkCargoPerfil(perfilData.cargos) && (

              <>
                {
                  cargoLabels.includes('CDC Jefatura') && row?.estado_recepcion! <= '2'
                    ? (
                      <ModalRegistro
                        open={openModalConfirmacion[row?.id!] || false}
                        setOpen={(isOpen: Dispatch<SetStateAction<boolean | null>>) => setOpenModalConfirmacion(prevState => ({ ...prevState, [row?.id!]: isOpen }))}
                        title={modalTitle}
                        textTool='Accion'
                        size={450}
                        width={`w-20 h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                        icon={iconComponent}
                      >
                        {
                          checkCargoPerfil(perfilData.cargos)
                            ?
                              <>
                                {
                                  row?.estado_recepcion! <= '3'
                                    ? <ModalControlCalidad id={row?.id!} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row} guia_id={guia?.id!} />
                                    : null

                                }
                              </> 
                            : null
                        }
                      </ModalRegistro>
                    )
                    : cargoLabels.includes('RecepcionMP') && row?.estado_recepcion! === '5'
                      ? (
                        <ModalRegistro
                          open={openModalConfirmacion[row?.id!] || false}
                          setOpen={(isOpen: Dispatch<SetStateAction<boolean | null>>) => setOpenModalConfirmacion(prevState => ({ ...prevState, [row?.id!]: isOpen }))}
                          title={modalTitle}
                          textTool='Accion'
                          size={700}
                          width={`w-20 h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                          icon={iconComponent}
                        >
                          {
                            row?.estado_recepcion === '5'
                                ? <ModalRecepcion id={row?.id!} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row} guia={guia!} />
                                : null
                          
                          }
                        </ModalRegistro>
                      )
                      : cargoLabels.includes('Bodega Patio Exterior') && row?.estado_recepcion !== '5' && row?.estado_recepcion === '3'
                        ? (
                          <ModalRegistro
                            open={openModalConfirmacion[row?.id!] || false}
                            setOpen={(isOpen: Dispatch<SetStateAction<boolean | null>>) => setOpenModalConfirmacion(prevState => ({ ...prevState, [row?.id!]: isOpen }))}
                            title={modalTitle}
                            textTool='Accion'
                            size={450}
                            width={`w-20 h-16 md:h-16 lg:h-11 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                            icon={iconComponent}
                          >
                            {
                              checkCargoPerfil(perfilData.cargos)
                                  ? <ModalBodega id={row?.id!} estadoActivo={setEstadoActivo!} setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} refresh={refresh} lote={row} />
                                  : null
                              
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
