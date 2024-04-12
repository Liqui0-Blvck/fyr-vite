import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { MdOutlineExpandMore } from "react-icons/md";
import useDarkMode from "../../../hooks/useDarkMode";
import { TLoteProduccion, TProduccion } from "../../../types/registros types/registros.types";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { urlNumeros } from "../../../services/url_number";
import Checkbox from "../../../components/form/Checkbox";


interface IDetalleEnvasesMasivosLotesProps {
  programa_produccion: TProduccion
  refresh: Dispatch<SetStateAction<boolean>>
}

const DetalleEnvasesMasivosLotes: FC<IDetalleEnvasesMasivosLotesProps> = ({ programa_produccion, refresh }) => {
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
  const handleToggleAll = (row: TLoteProduccion[]) => {
    setSelectAll(!selectAll)
    if (!selectAll) {
      const allIds = row.map(envase => envase.bodega_techado_ext);
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



  const lotesPorNumeroDeLote = programa_produccion.lotes.reduce((acc, lote) => {
    if (!acc[lote.numero_lote]) {
      acc[lote.numero_lote] = [];
    }
    acc[lote.numero_lote].push(lote); 
    return acc;
  }, {} as Record<number, TLoteProduccion[]>);



  const eliminarLoteProduccion = async (envases: string) => {
    const res = await fetch(`${base_url}/api/produccion/${id}/lotes_en_programa/eliminar_lotes/${envases}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authTokens?.access}`
      }
    })

    if (res.ok){
      toast.success("Envase devuelto con exito a bodega")
      refresh(true)
    } else {
      toast.error("No se pudo devolver el envase, vuelve a intentarlo")
    }
  }

  const numero_lote = Object.entries(lotesPorNumeroDeLote).map(([numeroLote]) => numeroLote)?.shift()
  const lotes = Object.entries(lotesPorNumeroDeLote).map(([numeroLotes,lotes]) => lotes)?.shift()?.filter(lote => Number(lote.numero_lote) === Number(numero_lote) && lote.bin_procesado !== true).map(lote => lote.bodega_techado_ext)
  const envases = lotes ? lotes.join(",") : "";

  console.log(envases)



  useEffect(() => {
    if (eliminadoMasivo){
      const numero_lote = Object.entries(lotesPorNumeroDeLote).map(([numeroLote]) => numeroLote)?.shift()
      const lotes = Object.entries(lotesPorNumeroDeLote).map(([numeroLotes,lotes]) => lotes)?.shift()?.filter(lote => Number(lote.numero_lote) === Number(numero_lote) && lote.bin_procesado !== true).map(lote => lote.bodega_techado_ext)
      const envases = lotes ? lotes.join(",") : "";
      eliminarLoteProduccion(envases)
    }
  }, [eliminadoMasivo])

  

  return (
    <article className="w-full min-h-full gap-y-10 px-10 py-5 flex flex-col rounded-md dark:bg-zinc-700 mt-10 overflow-auto">
      {Object.entries(lotesPorNumeroDeLote).map(([numeroLote, lotes]) => {
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
                Eliminar lote N° {numeroLote} del programa de producción
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
                    lotes.filter(est => !est.bin_procesado).map((item: TLoteProduccion) => (
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
                              // registrarLoteAProduccion(item.id)
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

export default DetalleEnvasesMasivosLotes;
