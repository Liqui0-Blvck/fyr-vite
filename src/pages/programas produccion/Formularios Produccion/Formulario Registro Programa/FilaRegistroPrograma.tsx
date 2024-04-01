import { Accordion, AccordionDetails, AccordionSummary, TableCell } from '@mui/material'
import React, { FC, useState } from 'react'
import useDarkMode from '../../../../hooks/useDarkMode'
import { TControlCalidadB, TEnvasePatio } from '../../../../types/registros types/registros.types'
import { MdOutlineExpandMore } from 'react-icons/md'
import Checkbox from '../../../../components/form/Checkbox'
import { variedadFilter } from '../../../../constants/options.constants'
import { HeroEye } from '../../../../components/icon/heroicons'
import Tooltip from '../../../../components/ui/Tooltip'
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction'
import { useAuth } from '../../../../context/authContext'
import { Link } from 'react-router-dom'

interface IRegistroPrograma {
  row: TEnvasePatio[]
  id_row: number
  variedad: string
}

const FilaRegistroPrograma: FC<IRegistroPrograma> = ({ row, id_row, variedad }) => {
  const { isDarkTheme } = useDarkMode()
  const { authTokens, validate, perfilData } = useAuth()
  const { data: cc_calidad } = useAuthenticatedFetch<TControlCalidadB>(
    authTokens,
    validate,
    `/api/control-calidad/recepcionmp/${id_row}`
  )

  console.log(cc_calidad)


  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number | false>(false); // State para controlar la expansión del Accordion
  const [infoExpanded, setInfoExpanded] = useState<number | false>(false)

  const handleChange = (panel: number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeExpanded = (panel: number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setInfoExpanded(isExpanded ? panel : false);
  };


  const handleToggleAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allIds = row.map(envase => envase.id);
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

  console.log(row)
  const variedad_nombre = variedadFilter.find(varie => varie.value === variedad)?.label

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
        <div className=' h-full w-full flex items-center justify-center'>
          <Accordion
            expanded={expanded === 1}
            onChange={handleChange(1)}
            className="bg-zinc-800 w-full"
            sx={{
              height: expanded ? 'auto' : '48px', // Establece una altura fija cuando el Accordion está expandido
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
              {row.length} Envases en Bodega
            </AccordionSummary>

            {row.map((envase) => {

              return (
                <AccordionDetails key={envase.id} className={`${isDarkTheme ? 'bg-zinc-400' : 'bg-zinc-100'} w-full h-14`}>
                  <div className={`${isDarkTheme ? 'bg-zinc-400' : 'bg-zinc-100'} rounded-md w-full flex items-center p-3`}>
                    <Checkbox
                      checked={isSelected(envase.id)}
                      onChange={() => handleToggleItem(envase.id)}
                      className='w-10 h-4'
                    />
                    <span className='font-semibold text-lg'>{envase.id} {envase.guia_patio}</span>
                  </div>
                </AccordionDetails>
              )
            })}
          </Accordion>
        </div>
      </TableCell>


      <TableCell className='row-specific' component="th" sx={{backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <Tooltip  text={`Detalle del lote N° ${'algo'}`}>
            <button className={`w-40 py-1 mx-auto flex items-center justify-center bg-blue-700 hover:bg-blue-600 rounded-md`}>
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
                  <span className='text-lg'>{cc_calidad?.humedad} %</span>
                </div>
                <div className='flex flex-col items-center gap-y-2'>
                  <label className='text-md font-semibold'>Muestras CC</label>
                  <span className='text-lg'>{cc_calidad?.control_rendimiento.length}</span>
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
