import { TableCell } from '@mui/material'

import useDarkMode from '../../../hooks/useDarkMode'
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../../../components/ui/Dropdown'
import Button from '../../../components/ui/Button'
import ModalRegistro from '../../../components/ModalForm.modal'
import FooterDetalleEnvase from '../Detalle/Detalle Envases/FooterDetalleEnvase'
import FooterFormularioEdicionEnvase from '../Formulario Edicion/Edicion Envase/FooterFormularioEdicionEnvase'
import { HeroEye, HeroPencilSquare } from '../../../components/icon/heroicons'
import { Dispatch, FC, SetStateAction } from 'react'
import ModalBodega from '../Formulario Edicion/Edicion Estado Modal/ModalBodega'
import ModalRecepcion from '../Formulario Edicion/Edicion Estado Modal/ModalRecepcion'
import ModalControlCalidad from '../Formulario Edicion/Edicion Estado Modal/ModalControlCalidad'
import { TEnvaseEnGuia, TEnvases, TGuia, TLoteGuia } from '../../../types/registros types/registros.types'
import { ESTADOS_MP, perfilesPermitidos, usuarioRole } from '../../../utils/select.constanst'
import { FaIndustry } from 'react-icons/fa6'
import { FaWeight } from 'react-icons/fa'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import { BiCheckDouble } from 'react-icons/bi'
import { DuoDoubleCheck } from '../../../components/icon/duotone'

interface ILoteCompletadoProps {
  lote: TLoteGuia | null
  guia: TGuia | null
  acoplado: boolean
  envases: TEnvases[] | null
  filtro_variedad: any
  filtro_productos: any
  openModalRows: { [key: string]: boolean };
  setOpenModalRows: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  kilos_total_envases: number | null
  kilos_netos_fruta: number | null
  refresh: Dispatch<SetStateAction<boolean>>
}

const LoteFilaCompleta: FC<ILoteCompletadoProps> = (
  { lote: row,
    guia,
    acoplado,
    envases,
    filtro_variedad,
    filtro_productos,
    openModalRows,
    setOpenModalRows,
    kilos_total_envases,
    kilos_netos_fruta,
   }
  ) => {
  const { isDarkTheme } = useDarkMode()

  return (
    <>
      <TableCell className='table-cell-row-final-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-final-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
        <div className=' h-full w-full flex items-center justify-center text-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_brutos_1}.0 kgs</span>
        </div>
      </TableCell>
      {
        acoplado
          ? (
            <TableCell className='table-cell-row-final-3' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
              <div className=' h-full w-full flex items-center justify-center text-center'>
                <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_brutos_2}.0 kgs</span>
              </div>
            </TableCell>
          )
          : null
      }
      <TableCell className='table-cell-row-final-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
        <div className=' h-full w-full flex items-center justify-center text-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_tara_1 + row?.kilos_tara_2}.0 kgs</span>
        </div>
      </TableCell>

      {/* {
        acoplado
          ? (
            <TableCell className='table-cell-row-final-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
              <div className=' h-full w-full flex items-center justify-center text-center'>
                <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.kilos_tara_2}.0 kgs</span>
              </div>
            </TableCell>
          )
          : null
      } */}

      <TableCell className='table-cell-row-final-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
        <div className=' h-full w-full flex items-center justify-center text-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{kilos_total_envases?.toFixed(2)} kgs</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-final-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
        <div className=' h-full w-full flex items-center justify-center text-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{kilos_netos_fruta?.toFixed(2)} kgs</span>
        </div>
      </TableCell>

      <TableCell className='table-cell-row-final-4' component="th" scope="row"sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
        <Dropdown>
          <DropdownToggle>
            <Button className='w-54 h-full px-12 text-white justify-around text-xl text-center'>
              Envases
            </Button>
          </DropdownToggle>
          <DropdownMenu className='w-54'>
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

      <TableCell className='table-cell-row-final-5'sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
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

      <TableCell className='table-cell-row-final-6' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
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
      <TableCell className='table-cell-row-final-7' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
        <div className='flex gap-5 items-center justify-center w-full h-full'>
          <ModalRegistro
            open={openModalRows[row?.id!] || false}
            setOpen={(isOpen: Dispatch<SetStateAction<boolean>>) => setOpenModalRows(prevState => ({ ...prevState, [row?.id!]: isOpen }))}
            title='Detalle Envases'
            textTool='Detalle'
            size={900}
            width={`w-20 h-16 md:h-16 lg:h-11 px-2 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
            icon={<HeroEye style={{ fontSize: 25 }} 
            />}
          >
            <FooterDetalleEnvase id_lote={row?.id!} id_guia={guia?.id!}/>
          </ModalRegistro>

        </div>
      </TableCell >

      <TableCell className='table-cell-row-final-8' sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}`}}>
        {row?.estado_recepcion === '7' ? <BiCheckDouble className='text-4xl text-green-700'/> : <DuoDoubleCheck style={{ color: 'green', fontSize: 30 }}/> }
      </TableCell>
    </>
  )
}

export default LoteFilaCompleta
