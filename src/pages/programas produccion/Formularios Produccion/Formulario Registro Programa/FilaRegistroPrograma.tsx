import { Accordion, AccordionDetails, AccordionSummary, TableCell } from '@mui/material'
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import useDarkMode from '../../../../hooks/useDarkMode'
import { TControlCalidadB, TEnvasePatio } from '../../../../types/registros types/registros.types'
import { MdOutlineExpandMore } from 'react-icons/md'
import { variedadFilter } from '../../../../constants/options.constants'
import { HeroEye } from '../../../../components/icon/heroicons'
import Tooltip from '../../../../components/ui/Tooltip'
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction'
import { useAuth } from '../../../../context/authContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { urlNumeros } from '../../../../services/url_number'
import ModalRegistro from '../../../../components/ModalRegistro'
import Checkbox from '../../../../components/form/Checkbox'
import EnvasesEnGuiaList from './ListaEnvasesSeleccionables'
import { preventDefault } from '@fullcalendar/core/internal'
import toast from 'react-hot-toast'


interface IRegistroPrograma {
  row: TEnvasePatio[]
  id_row?: number
  variedad?: string
  ubicacion?: string
  refresh: Dispatch<SetStateAction<boolean>>
}



const FilaRegistroPrograma: FC<IRegistroPrograma> = ({row, id_row, variedad, ubicacion, refresh }) => {
  const { isDarkTheme } = useDarkMode()
  const { authTokens, validate, perfilData, userID } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const base_url = process.env.VITE_BASE_URL_DEV
  const [open, setOpen] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [infoExpanded, setInfoExpanded] = useState<number | false>(false)

  const { data: cc_calidad } = useAuthenticatedFetch<TControlCalidadB>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id_row}`
  )


  const registrarLoteAProduccion = async (envases: string) => {
    const res = await fetch(`${base_url}/api/produccion/${id}/lotes_en_programa/registrar_lotes/${envases}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      }
    })
    if (res.ok){
      refresh(true)
      toast.success('Envases agregados correctamente a producción')
    } else {
      toast.error("Ocurrió un error, vuelve a intentarlo")
    }
  }

  useEffect(() => {
    if (selectAll){
      const lista_seleccionada = selectedItems?.map(id => id)
      const envases = lista_seleccionada ? lista_seleccionada.join(",") : "";

      registrarLoteAProduccion(envases)
    }
  }, [selectedItems, selectAll])
  

  const handleChangeExpanded = (panel: number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    event.preventDefault()
    setInfoExpanded(isExpanded ? panel : false);
  };


  const handleToggleAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allIds = row.filter(envase => envase.estado_envase !== '2').map(envase => envase.id);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  

  const handleToggleItem = (itemId: number) => {
    const selectedIndex = selectedItems.indexOf(itemId);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, itemId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1),
      );
    }

    setSelectedItems(newSelected);
  };

  const isSelected = (itemId: number) => selectedItems.indexOf(itemId) !== -1;
  

  const variedad_nombre = variedadFilter.find(varie => varie.value === variedad)?.label

  // console.log(selectedItems)  

  return (
    <>
      <TableCell className='table-cell-row-4' component="th" sx={{
      backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` 
    }}>
          <div className=' h-full w-full flex gap-2 items-center justify-center'>
            <Checkbox checked={selectAll} onChange={handleToggleAll} />
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{id_row}</span>
          </div>  
      </TableCell>

      <TableCell className='table-cell-row-4' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className='w-full h-full flex gap-2 items-center justify-center'>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>Lote N° {id_row}</span>
          </div>
      </TableCell>

      <TableCell className='table-cell-row-4' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className=' h-full w-full flex items-center justify-center'>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{variedad_nombre}</span>
          </div>
      </TableCell>

      <TableCell className='table-cell-row-3' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center relative top-0'>
          <ModalRegistro
            title='Envases en Lote'
            open={open}
            setOpen={setOpen}
            width={`w-[80%] py-1 h-14 mx-auto flex items-center justify-center bg-blue-700 hover:bg-blue-600 rounded-md`}
            textButton={`${row.filter(envase => envase.estado_envase !== '2').length} Envases en Guía`}
            >
            <EnvasesEnGuiaList isSelected={isSelected} handleToggleItem={handleToggleItem} row={row} ubicacion={ubicacion} refresh={refresh}/>
          </ModalRegistro>
        </div>
      </TableCell>


      <TableCell className='row-specific' component="th" sx={{backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <Tooltip  text={`Detalle del lote N° ${id_row}`}>
            <button
              onClick={() => navigate(`/app/control-calidad/${id_row}`)}
              type='button'
              className={`w-40 py-1 mx-auto flex items-center justify-center bg-blue-700 hover:bg-blue-600 rounded-md`}>
              <HeroEye style={{ fontSize: 35, color: 'white'}} />
            </button>
          </Tooltip>
      </TableCell>

      <TableCell className='table-cell-row-7' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <Accordion
            expanded={infoExpanded === 1}
            onChange={handleChangeExpanded(1)}
            className="bg-zinc-800 w-full"
            sx={{
              height: infoExpanded ? 'auto' : '48px', // Establece una altura fija cuando el Accordion está expandido
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <AccordionSummary
              expandIcon={<MdOutlineExpandMore />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: `${isDarkTheme ? '#838387' : '' }`
              }}
            >
              Información de CC del Lote N° {id_row}
            </AccordionSummary>

            <AccordionDetails className={`${isDarkTheme ? 'bg-zinc-400' : 'bg-zinc-100'} w-full h-full`}>
              <div className={`${isDarkTheme ? 'bg-zinc-400' : 'bg-zinc-100'} rounded-md w-full flex items-center justify-between  p-3`}>
                <div className='flex flex-col items-center gap-y-2'>
                  <label className='text-md font-semibold'>Humedad</label>
                  {/* <span className='text-lg'>{cc_calidad?.humedad} %</span> */}
                </div>
                <div className='flex flex-col items-center gap-y-2'>
                  <label className='text-md font-semibold'>Muestras CC</label>
                  {/* <span className='text-lg'>{cc_calidad?.control_rendimiento.length}</span> */}
                </div>
                <div className='flex flex-col items-center gap-y-2'>
                  <label className='text-md font-semibold'>CDR</label>
                  <Tooltip text='Detalle Control de Rendimiento'>
                    <Link to={`/app/vb_control/${id_row}`}>
                      <button className='bg-blue-700 hover:bg-blue-600 hover:scale-105 p-1 px-5 rounded-md'>
                        <HeroEye style={{ fontSize: 25, color: 'white'}} />
                      </button>
                    </Link>
                  </Tooltip>
                </div>
                <div className='flex flex-col items-center gap-y-2'>
                  <label className='text-md font-semibold'>CCR</label>
                  <Tooltip text='Detalle Control Calidad RecepcionMP'>
                    <Link to={`/app/control-calidad/${id_row}`}>
                      <button className='bg-blue-700 hover:bg-blue-600 hover:scale-105 p-1 px-5 rounded-md'>
                        <HeroEye style={{ fontSize: 25, color: 'white'}} />
                      </button>
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </TableCell>
    </>
  )
}

export default FilaRegistroPrograma
