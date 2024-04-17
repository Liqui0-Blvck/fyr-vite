// import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
// import { Checkbox, CheckboxProps } from "antd";
// import { MdOutlineExpandMore } from "react-icons/md";
// import useDarkMode from "../../../hooks/useDarkMode";
// import { TLoteProduccion, TProduccion, TReprocesoProduccion } from "../../../types/registros types/registros.types";
// import { FC } from "react";

// interface IDetalleEnvasesMasivosLotesProps {
//   programa_reproceso: TReprocesoProduccion
// }

// const DetalleEnvasesMasivosLotes: FC<IDetalleEnvasesMasivosLotesProps> = ({ programa_reproceso }) => {
//   const { isDarkTheme } = useDarkMode();
//   const onChange: CheckboxProps['onChange'] = (e) => {
//     console.log(`checked = ${e.target.checked}`);
//   };

//   console.log(programa_reproceso)


//   return (
//     <article className="w-full min-h-full gap-y-10 py-5 px-10flex flex-col rounded-md dark:bg-zinc-700 mt-10 overflow-auto">
//       {
//         programa_reproceso.bins.every(lote => lote.bin_procesado !== true)
//           ? (
//             <>      
//               <div className="mx-auto">
//                   <h1>Procesar Masivamente Envases de Lotes</h1>
//                 </div>

//                 //  ESTO SE UTILIZARA PARA UN LOOP DE ITEMS *
                      
//                 <div className="w-full h-full flex flex-col items-center py-2 gap-2 px-10 border border-zinc-700 relative">
//                   <div className="flex items-center py-2 justify-between w-full">
//                     <div className="w-3/12 p-2 elative top-0 flex items-center gap-3">
//                       <Checkbox />
//                       Lote N° 67
//                     </div>
//                     <button className="w-5/12 bg-red-700 hover:bg-red-500 rounded-md p-3 font-semibold hover:scale-105">
//                       Eliminar lote N° 67 del programa de producción
//                     </button>
//                   </div>

//                   <div className="w-full h-full">
//                     <div className="bg-zinc-800">
//                       <Accordion className="bg-zinc-800">
//                         <AccordionSummary
//                           expandIcon={<MdOutlineExpandMore />}
//                           aria-controls="panel1-content"
//                           id="panel1-header"
//                           sx={{
//                             backgroundColor: `${isDarkTheme ? '#838387' : '' }`
//                           }}
//                         >
//                           {programa_reproceso.bins.length} Envases
//                         </AccordionSummary>
//                         {
//                           programa_reproceso.bins.filter(est => est.bin_procesado !== true).map((item) => (
//                             <AccordionDetails
//                               className="bg-zinc-300 h-10 !p-0 border border-zinc-400 cursor-pointer"
//                               onChange={() => onChange}
//                             >
//                               <div className="px-2 py-2 flex items-center gap-2">
//                                 <Checkbox />
//                                 <span className="text-black ">{item.id}</span>
//                               </div>
//                             </AccordionDetails>
//                           ))
//                         }
//                       </Accordion>
//                     </div>
                    
//                   </div>
//                 </div>
//                 //* FIN DEL LOOP*/

            

//               <button className="w-96 bg-blue-700 hover:bg-blue-600 rounded-md p-3 font-semibold hover:scale-105">
//                 Procesar Masivamente los Bins Seleccionados
//               </button>
//             </>
//             )
//           : null
//       }
//     </article>
//   )
// }

// export default DetalleEnvasesMasivosLotes;


import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { MdOutlineExpandMore } from "react-icons/md";
import useDarkMode from "../../../hooks/useDarkMode";
import { TBinEnReproceso, TLoteProduccion, TProduccion, TReprocesoProduccion } from "../../../types/registros types/registros.types";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { urlNumeros } from "../../../services/url_number";
import Checkbox from "../../../components/form/Checkbox";
import { PiChecksBold } from "react-icons/pi";


interface IDetalleBinsMasivosProps {
  programa_reproceso: TReprocesoProduccion
  refresh: Dispatch<SetStateAction<boolean>>
}

const DetalleBinsMasivosReproceso: FC<IDetalleBinsMasivosProps> = ({ programa_reproceso, refresh }) => {
  const { isDarkTheme } = useDarkMode();
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate, perfilData } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [eliminadoMasivo, setEliminadoMasivo] = useState<boolean>(false)
  const [registroMasivo, setRegistroMasivo] = useState<boolean>(false)

  
  const isSelected = (itemId: number) => selectedItems.indexOf(itemId) !== -1;
  const handleToggleAll = (row: TBinEnReproceso[]) => {
    setSelectAll(!selectAll)
    if (!selectAll) {
      const allIds = row.map(envase => envase.id_bin_bodega);
      console.log(allIds)
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

  //  programa_produccion?.bins.every(bin => bin.bin_procesado !== true)

  console.log("soy del programa reproceso", programa_reproceso)

  const registrarLoteAProduccion = async (envases: string) => {
    const res = await fetch(`${base_url}/api/produccion/${id}/lotes_en_programa/actualizar_estados_lotes/${envases}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      }
    })
    if (res.ok){
      refresh(true)
      toast.success('Envases procesados correctamente a producción')
    } else {
      toast.error("Ocurrió un error, vuelve a intentarlo")
    }
  }


  useEffect(() => {
    if (registroMasivo){
      const lista_seleccionada = selectedItems?.map(id => id)
      const envases = lista_seleccionada ? lista_seleccionada.join(",") : "";

      registrarLoteAProduccion(envases)
    }
  }, [selectedItems, registroMasivo])



  const binesPorNumeroDePrograma = programa_reproceso.bins.reduce((acc, bin) => {
    if (!acc[bin.programa_produccion]) {
      acc[bin.programa_produccion] = [];
    }
    acc[bin.programa_produccion].push(bin);   
    return acc;
  }, {} as Record<number, TBinEnReproceso[]>);


  console.log("soy una huea diferente", binesPorNumeroDePrograma)


  const eliminarLoteProduccion = async (bins: string) => {
    const res = await fetch(`${base_url}/api/reproceso/${id}/bins_en_reproceso/eliminar_bines/${bins}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authTokens?.access}`
      }
    })

    if (res.ok){
      toast.success("Bin devuelto con exito a bodega")
      refresh(true)
    } else {
      toast.error("No se pudo devolver el bin, vuelve a intentarlo")
    }
  }

  const programa_produccion = Object.entries(binesPorNumeroDePrograma).map(([numeroLote]) => numeroLote)?.shift()
  const lotes = Object.entries(binesPorNumeroDePrograma).map(([numeroLotes,lotes]) => lotes)?.shift()?.filter((bin: TBinEnReproceso) => Number(bin.programa_produccion) === Number(programa_produccion) && bin.bin_procesado !== true).map((bin: TBinEnReproceso) => bin.id_bin_bodega)
  const envases = lotes ? lotes.join(",") : "";

  console.log("envases a considerar", envases)



  useEffect(() => {
    if (eliminadoMasivo){
      const programa_produccion = Object.entries(eliminarLoteProduccion).map(([numeroLote]) => numeroLote)?.shift()
      const lotes = Object.entries(eliminarLoteProduccion).map(([numeroLotes,lotes]) => lotes)?.shift()?.filter((bin: TBinEnReproceso) => Number(bin.programa_produccion) === Number(programa_produccion) && bin.bin_procesado !== true).map((bin: TBinEnReproceso) => bin.binbodega)
      const envases = lotes ? lotes.join(",") : "";
      eliminarLoteProduccion(envases)
    }
  }, [eliminadoMasivo])

  programa_produccion?.lotes.some(lote => lote.bin_procesado !== true)

  return (
    <div className={`lg:grid lg:grid-rows-10 md:grid md:grid-rows-7 gap-x-3 h-full mx-auto
        dark:bg-zinc-800 bg-zinc-200 relative px-5
        place-items-center lg:gap-2 md:gap-2 flex flex-col gap-5 w-full overflow-auto py-10
        rounded-md`}
    >
      {
        programa_reproceso?.bins.filter(bin => bin.bin_procesado !== true).length <= 0
          ? (
            <div className="w-full h-96 flex items-center flex-col py-10 gap-y-10">
              <h1>No hay ningun lote pendiente</h1>
              <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center">
                <PiChecksBold style={{ fontSize: 45, color: 'white' }}/>
              </div>
            </div>
            )
          : (
            <article className="w-full h-full gap-y-10 px-10 py-5 flex flex-col rounded-md dark:bg-zinc-700 overflow-auto">
                {Object.entries(binesPorNumeroDePrograma).map(([numeroLote, lotes]) => {
                  const lotes_no_procesados = lotes.filter(lote => lote.bin_procesado !== true)
                  return (
                    <div key={numeroLote} className="w-full h-full flex flex-col items-center py-2 gap-2 px-10 border border-zinc-700 relative">
                      <div className="flex items-center py-2 justify-between w-full">
                        <div className="w-3/12 p-2 elative top-0 flex items-center gap-3">
                          <Checkbox checked={selectAll} onChange={() => handleToggleAll(lotes_no_procesados)} />
                          <span>Lote N° {numeroLote}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEliminadoMasivo(true)}
                          className="w-5/12 bg-red-700 hover:bg-red-500 rounded-md p-3 font-semibold hover:scale-105">
                          Eliminar bins del programa de producción N° {numeroLote} 
                        </button>
                      </div>
            
                      <div className="w-full h-full">
                        <div className="bg-zinc-800">
                          <Accordion className="bg-zinc-800">
                            <AccordionSummary
                              expandIcon={<MdOutlineExpandMore />}
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{
                                backgroundColor: `${isDarkTheme ? '#838387' : ''}`
                              }}
                            >
                              {lotes.filter(est => !est.bin_procesado).length} Envases
                            </AccordionSummary>
                            {
                              lotes.filter(est => !est.bin_procesado).map((item: TBinEnReproceso) => (
                                <AccordionDetails
                                  key={item.id}
                                  className="bg-zinc-300 h-10 !p-0 border border-zinc-400 cursor-pointer"
                                  onChange={() => {}}
                                >
                                  <div className="px-2 py-2 flex items-center gap-2">
                                    <Checkbox
                                      checked={isSelected(item.id)}
                                      onChange={() => {
                                        handleToggleItem(item.id)
                                        registrarLoteAProduccion(item.id)
                                      }}
                                      className='w-10 h-4'
                                    />
                                    <span className="text-black ">{item.id}</span>
                                  </div>
                                </AccordionDetails>
                              ))
                            }
                          </Accordion>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setRegistroMasivo(!registroMasivo)}
                  className="w-96 bg-blue-700 hover:bg-blue-600 rounded-md p-3 font-semibold hover:scale-105">
                  Procesar Masivamente los Bins Seleccionados
                </button>
              </article>
          )
      }
      
    </div>
  )
}


export default DetalleBinsMasivosReproceso;
