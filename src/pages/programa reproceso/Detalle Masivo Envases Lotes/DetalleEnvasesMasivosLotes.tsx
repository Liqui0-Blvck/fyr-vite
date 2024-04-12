import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Checkbox, CheckboxProps } from "antd";
import { MdOutlineExpandMore } from "react-icons/md";
import useDarkMode from "../../../hooks/useDarkMode";
import { TLoteProduccion, TProduccion } from "../../../types/registros types/registros.types";
import { FC } from "react";

interface IDetalleEnvasesMasivosLotesProps {
  programa_produccion: TProduccion
}

const DetalleEnvasesMasivosLotes: FC<IDetalleEnvasesMasivosLotesProps> = ({ programa_produccion }) => {
  const { isDarkTheme } = useDarkMode();
  const onChange: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };


  return (
    <article className="w-full min-h-full gap-y-10 flex flex-col rounded-md dark:bg-zinc-700 mt-10 overflow-auto">
      {
        programa_produccion.lotes.every(lote => lote.bin_procesado !== true)
          ? (
            <>      
              <div className="mx-auto">
                  <h1>Procesar Masivamente Envases de Lotes</h1>
                </div>

                {/* ESTO SE UTILIZARA PARA UN LOOP DE ITEMS */}
                      
                <div className="w-full h-full flex flex-col items-center py-2 gap-2 px-10 border border-zinc-700 relative">
                  <div className="flex items-center py-2 justify-between w-full">
                    <div className="w-3/12 p-2 elative top-0 flex items-center gap-3">
                      <Checkbox />
                      Lote N° 67
                    </div>
                    <button className="w-5/12 bg-red-700 hover:bg-red-500 rounded-md p-3 font-semibold hover:scale-105">
                      Eliminar lote N° 67 del programa de producción
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
                            backgroundColor: `${isDarkTheme ? '#838387' : '' }`
                          }}
                        >
                          {programa_produccion.lotes.length} Envases
                        </AccordionSummary>
                        {
                          programa_produccion.lotes.filter(est => est.bin_procesado !== true).map((item) => (
                            <AccordionDetails
                              className="bg-zinc-300 h-10 !p-0 border border-zinc-400 cursor-pointer"
                              onChange={() => onChange}
                            >
                              <div className="px-2 py-2 flex items-center gap-2">
                                <Checkbox />
                                <span className="text-black ">{item.id}</span>
                              </div>
                            </AccordionDetails>
                          ))
                        }
                      </Accordion>
                    </div>
                    
                  </div>
                </div>
                {/* FIN DEL LOOP*/}

            

              <button className="w-96 bg-blue-700 hover:bg-blue-600 rounded-md p-3 font-semibold hover:scale-105">
                Procesar Masivamente los Bins Seleccionados
              </button>
            </>
            )
          : null
      }
    </article>
  )
}

export default DetalleEnvasesMasivosLotes;
