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
import { PiChecksBold } from "react-icons/pi";
import Button from "../../../components/ui/Button";

interface IDetalleEnvasesMasivosLotesProps {
  programa_produccion: TProduccion
  refresh: Dispatch<SetStateAction<boolean>>
}

const DetalleEnvasesMasivosLotes: FC<IDetalleEnvasesMasivosLotesProps> = ({ programa_produccion, refresh }) => {
  const { isDarkTheme } = useDarkMode();
  const { pathname } = useLocation();
  const id = urlNumeros(pathname);
  const { authTokens } = useAuth();
  const base_url = process.env.VITE_BASE_URL_DEV;
  const [selectAllStates, setSelectAllStates] = useState<{ [key: number]: boolean }>({});
  const [selectedItemsByLote, setSelectedItemsByLote] = useState<{ [key: number]: number[] }>({});
  const [eliminadoMasivo, setEliminadoMasivo] = useState<boolean>(false);
  const [registroMasivo, setRegistroMasivo] = useState<boolean>(false);

  const handleToggleAll = (numeroLote: number) => {
    const allIds = programa_produccion.lotes
      .filter(lote => lote.numero_lote === numeroLote && !lote.bin_procesado)
      .map(lote => lote.bodega_techado_ext);
    setSelectedItemsByLote(prevState => ({
      ...prevState,
      [numeroLote]: selectAllStates[numeroLote] ? [] : allIds,
    }));
    setSelectAllStates(prevState => ({
      ...prevState,
      [numeroLote]: !prevState[numeroLote],
    }));
  };

  const handleToggleItem = (itemId: number, numeroLote: number) => {
    setSelectedItemsByLote(prevState => ({
      ...prevState,
      [numeroLote]: prevState[numeroLote]?.includes(itemId)
        ? prevState[numeroLote].filter(id => id !== itemId)
        : [...(prevState[numeroLote] || []), itemId],
    }));
  };

  const isSelected = (itemId: number, numeroLote: number) => {
    return selectedItemsByLote[numeroLote]?.includes(itemId);
  };

  const registrarLoteAProduccion = async (envases: string) => {
    const res = await fetch(`${base_url}/api/produccion/${id}/lotes_en_programa/actualizar_estados_lotes/${envases}/`, {
      method: 'PATCH',
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
    if (selectedItemsByLote && registroMasivo) {
      // Aquí puedes realizar alguna acción si se seleccionan/envían los elementos
      console.log("Envases seleccionados:", selectedItemsByLote);
      const envases = Object.values(selectedItemsByLote).flatMap(ids => ids).join(",");

      registrarLoteAProduccion(envases)
    }

    return () => {}
  }, [selectedItemsByLote, registroMasivo]);
  

  useEffect(() => {
    if (eliminadoMasivo) {
      const numero_lote = Object.entries(programa_produccion.lotes.reduce((acc, lote) => {
        if (!acc[lote.numero_lote]) {
          acc[lote.numero_lote] = [];
        }
        if (!lote.bin_procesado) {
          acc[lote.numero_lote].push(lote);
        }
        return acc;
      }, {} as Record<number, TLoteProduccion[]>)).map(([numeroLote]) => numeroLote)?.shift();

      const lotes = Object.entries(programa_produccion.lotes.reduce((acc, lote) => {
            if (!acc[lote.numero_lote]) {
              acc[lote.numero_lote] = [];
            }
            if (!lote.bin_procesado) {
              acc[lote.numero_lote].push(lote);
            }
            return acc;
          }, {} as Record<number, TLoteProduccion[]>)).map(([numeroLotes,lotes]) => lotes)?.shift()?.filter(lote => Number(lote.numero_lote) === Number(numero_lote) && lote.bin_procesado !== true).map(lote => lote.bodega_techado_ext);
      const envases = lotes ? lotes.join(",") : "";
      eliminarLoteProduccion(envases);
    }
  }, [eliminadoMasivo]);

  const eliminarLoteProduccion = async (envases: string) => {
    const res = await fetch(`${base_url}/api/produccion/${id}/lotes_en_programa/eliminar_lotes/${envases}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authTokens?.access}`
      }
    });

    if (res.ok){
      toast.success("Envase devuelto con exito a bodega");
      refresh(true);
    } else {
      toast.error("No se pudo devolver el envase, vuelve a intentarlo");
    }
  };

  console.log(eliminadoMasivo)




  return (
    <div className={`lg:grid lg:grid-rows-10 md:grid md:grid-rows-7 gap-x-3 h-full mx-auto
      dark:bg-zinc-800 bg-zinc-200 relative px-5
      place-items-center lg:gap-2 md:gap-2 flex flex-col gap-5 w-full overflow-auto py-10
      rounded-md`}
    >
      {programa_produccion?.lotes.filter(lote => !lote.bin_procesado).length <= 0 ? (
        <div className="w-full h-96 flex items-center flex-col py-10 gap-y-10">
          <h1>No hay ningún lote pendiente</h1>
          <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center">
            <PiChecksBold style={{ fontSize: 45, color: 'white' }}/>
          </div>
        </div>
      ) : (
        <article className="w-full h-full gap-y-10 px-10 py-2 flex flex-col rounded-md dark:bg-zinc-700 overflow-auto">
          {Object.entries(programa_produccion.lotes.filter(lote => lote.bin_procesado !== true).reduce((acc, lote) => {
            if (!acc[lote.numero_lote]) {
              acc[lote.numero_lote] = [];
            }
            if (!lote.bin_procesado) {
              acc[lote.numero_lote].push(lote);
            }
            return acc;
          }, {} as Record<number, TLoteProduccion[]>)).map(([numeroLote, lotes]) => (
            <div key={numeroLote} className="w-full h-full flex flex-col items-center py-2 gap-2 px-10 dark:bg-inherit bg-zinc-100">
              <div className="flex items-center py-2 justify-between w-full">
                <div className="w-3/12 p-2 elative top-0 flex items-center gap-3">
                  <Checkbox
                    checked={selectAllStates[numeroLote] || false}
                    onChange={() => handleToggleAll(Number(numeroLote))}
                  />
                  <span>Lote N° {numeroLote}</span>
                </div>
                <Button
                  variant='solid'
                  color="red"
                  onClick={() => {
                    console.log(`Eliminar lote N° ${numeroLote}`)
                    setEliminadoMasivo(true)}}
                  className="w-5/12 bg-red-700 hover:bg-red-500 rounded-md p-3 font-semibold hover:scale-105 text-white"
                >
                  Eliminar lote N° {numeroLote} del programa de producción
                </Button>
              </div>
              <div className="w-full h-full">
                <div className="bg-zinc-800">
                  <Accordion className="bg-zinc-800">
                    <AccordionSummary
                      expandIcon={<MdOutlineExpandMore />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{
                        backgroundColor: `${isDarkTheme ? '#838387' : 'white'}`
                      }}
                    >
                      {lotes.length} Envases
                    </AccordionSummary>
                    {lotes.map((item: TLoteProduccion) => (
                      <AccordionDetails
                        key={item.id}
                        className="bg-zinc-300 h-10 !p-0 border border-zinc-400 cursor-pointer"
                        onChange={() => {}}
                      >
                        <div className="px-2 py-2 flex items-center gap-2">
                          <Checkbox
                            checked={isSelected(item.bodega_techado_ext, Number(numeroLote))}
                            onChange={() => handleToggleItem(item.bodega_techado_ext, Number(numeroLote))}
                            className='w-auto h-4'
                          />
                          <span className="text-black ">Envase N°{item.id}</span>
                        </div>
                      </AccordionDetails>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant='solid'
            size='lg'
            onClick={() => {console.log("Procesar masivamente los envases seleccionados")
              setRegistroMasivo(!registroMasivo)
            }}
            className="w-96 text-white p-3 font-semibold hover:scale-105"
          >
            Procesar masivamente los bins seleccionados
          </Button>
        </article>
      )}
    </div>
  );
};

export default DetalleEnvasesMasivosLotes;
