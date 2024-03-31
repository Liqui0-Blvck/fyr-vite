import { Accordion, AccordionDetails, AccordionSummary, TableCell } from '@mui/material'
import React, { FC, useState } from 'react'
import useDarkMode from '../../../../hooks/useDarkMode'
import { TEnvasePatio } from '../../../../types/registros types/registros.types'
import { MdOutlineExpandMore } from 'react-icons/md'
import Checkbox from '../../../../components/form/Checkbox'

interface IRegistroPrograma {
  row: TEnvasePatio[]
}

const FilaRegistroPrograma: FC<IRegistroPrograma> = ({ row }) => {
  const { isDarkTheme } = useDarkMode()

  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number | false>(false); // State para controlar la expansión del Accordion

  const handleChange = (panel: number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
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
  return (
    <>
      <TableCell className='table-cell-row-pro-1' component="th" sx={{backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className=' h-full w-full flex items-center justify-center'>
            <Checkbox checked={selectAll} onChange={handleToggleAll} />
            <span>{1}</span>
          </div>
      </TableCell>

      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className=' h-full w-full flex items-center justify-center'>
            1
            {/* <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote}</span> */}
          </div>
      </TableCell>

      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className=' h-full w-full flex items-center justify-center'>
            1
            {/* <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote}</span> */}
          </div>
      </TableCell>

      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
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

            {row.map((envase) => (
              <AccordionDetails key={envase.id} className='w-full h-10'>
                <div className='border border-black flex items-center p-2'>
                  <Checkbox
                    checked={isSelected(envase.id)}
                    onChange={() => handleToggleItem(envase.id)}
                    className='w-10 h-4'
                  />
                  <span>{envase.id} {envase.guia_patio}</span>
                </div>
              </AccordionDetails>
            ))}
          </Accordion>
        </div>
      </TableCell>


      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className=' h-full w-full flex items-center justify-center'>
            1
            {/* <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote}</span> */}
          </div>
      </TableCell>

      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
          <div className=' h-full w-full flex items-center justify-center'>
            1
            {/* <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.numero_lote}</span> */}
          </div>
      </TableCell>
    </>
  )
}

export default FilaRegistroPrograma
