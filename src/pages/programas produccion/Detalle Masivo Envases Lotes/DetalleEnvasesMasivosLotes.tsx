import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Checkbox, CheckboxProps } from "antd";
import { MdOutlineExpandMore } from "react-icons/md";
import useDarkMode from "../../../hooks/useDarkMode";

const elementos_inexistentes = [
  {
    id: 1,
    nombre: 'Bin 1',
    nro_envase: 1
  },
  {
    id: 2,
    nombre: 'Bin 2',
    nro_envase: 2
  },
  {
    id: 3,
    nombre: 'Bin 3',
    nro_envase: 3
  },
  {
    id: 4,
    nombre: 'Bin 4',
    nro_envase: 4
  },
  {
    id: 5,
    nombre: 'Bin 5',
    nro_envase: 5
  },
  {
    id: 6,
    nombre: 'Bin 6',
    nro_envase: 6
  },
  {
    id: 7,
    nombre: 'Bin 7',
    nro_envase: 7
  },
]

const DetalleEnvasesMasivosLotes = () => {
  const { isDarkTheme } = useDarkMode();
  const onChange: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <article className="w-full h-full gap-y-10 flex flex-col">
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
                {elementos_inexistentes.length} Envases
              </AccordionSummary>
              {
                elementos_inexistentes.map((item) => (
                  <AccordionDetails
                    className="bg-zinc-300 h-10 !p-0 border border-zinc-400 cursor-pointer"
                    onChange={() => onChange}
                  >
                    <div className="px-2 py-2 flex items-center gap-2">
                      <Checkbox />
                      <span className="text-black ">{item.nombre}</span>
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
  </article>
  )
}

export default DetalleEnvasesMasivosLotes;
