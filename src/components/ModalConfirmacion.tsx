import { Dispatch, FC, SetStateAction } from "react";
import useDarkMode from "../hooks/useDarkMode";
import { TLoteGuia } from "../types/registros types/registros.types";
import toast from "react-hot-toast";


interface IModalProps {
  id: number;
  confirmacion: boolean
  setConfirmacion: Dispatch<SetStateAction<boolean>>
  estadoActivo: Dispatch<SetStateAction<string | null>>;
  setOpen: Dispatch<SetStateAction<boolean | null>>;
  refresh: Dispatch<SetStateAction<boolean | null>>
  lote: TLoteGuia | null,
}

const ModalConfirmacion: FC<IModalProps> = ({ id, setOpen, refresh, lote, confirmacion, setConfirmacion }) => {
  const base_url = process.env.VITE_BASE_URL_DEV;
  const { isDarkTheme } = useDarkMode()

  // const estado_guia_update = async (id: any) => {
  //   const res = await fetch(`${base_url}/api/recepcionmp/${id}/`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       estado_recepcion: 4
  //     })
  //   })

  //   if (res.ok) {
  //     toast.success('Guia Finalizada')
  //     refresh(true)
  //   } else {
  //     toast.error('No se pudo finalizar la guia')
  //   }
  // }

  return (
    <div className='w-full h-full flex items-center flex-col justify-between'>
      {confirmacion ? (
        <div className="py-10">
          <p>Se cierra la guia</p>
        </div>
      ) : (
        <>
          {!confirmacion && (
            <div className='py-10'>
              {
                lote?.envases.map((lotes: any) => {
                  console.log(lotes)
                  return (
                    <>
                      <li className={`font-semibold text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Producto: ''</li>
                      <li className={`font-semibold text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Variedad: ''</li>
                    </>
                  )
                })
              }
                
            </div>
          )}
  
          <div className='w-full flex items-center justify-between'>
            <button 
              className='w-48 py-3 px-6 rounded-md bg-blue-800 text-white'
              onClick={() => {
                if (!confirmacion) {
                    setConfirmacion(true); 
                } else {
                  setConfirmacion(false);
                }}}
            > 
              {confirmacion ? 'Sí' : 'Confirmar'}
            </button>
            <button 
              className='w-48 py-3 px-6 rounded-md bg-red-600 text-white'
              onClick={() => {
                if (confirmacion) {
                  setConfirmacion(false);
                  setOpen(false)
                } else {
                  setOpen(false);
                }
              }}
            > 
              {confirmacion ? 'No' : 'Cancelar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
  
  
  
}

export default ModalConfirmacion;


// ? (
//   <div className={`${isDarkTheme ? 'bg-gray-50' : 'bg-gray-700'}w-full h-full  flex flex-col justify-center items-center`}>
//     <GoQuestion className='text-9xl text-yellow-500' />
//     <h1 className='text-center'>Estas seguro de querer avanzar?</h1>
//     <ul className='mt-10 flex flex-col items-center gap-2'>
//       <li className={`font-semibold text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Kilos Brutos:  {lote?.kilos_brutos_1}</li>
//       <li className={`font-semibold text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Cantidad Envases:  {lote?.envases.length}</li>
      
      
//     </ul>
//   </div>
//   )
// : ''