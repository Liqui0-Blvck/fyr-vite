import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import useDarkMode from "../hooks/useDarkMode";
import { TControlCalidad, TLoteGuia } from "../types/registros types/registros.types";
import toast from "react-hot-toast";
import { GoQuestion } from "react-icons/go";
import FormularioPepaMuestra from "../pages/control calidad/Formulario Pepa Muestra/FormularioPepaMuestra";


interface IModalProps {
  id?: number;
  confirmacion: boolean
  setConfirmacion: Dispatch<SetStateAction<boolean>>
  estadoActivo?: Dispatch<SetStateAction<string | null>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refresh: Dispatch<SetStateAction<boolean>>
  lote?: TLoteGuia | null,
  mensaje?: string
  CClote?: TControlCalidad
  id_lote?: number
  formulario?: ReactNode
}

const ModalConfirmacion: FC<IModalProps> = ({ setOpen, confirmacion, setConfirmacion, mensaje, formulario }) => {

  return (
    <div className='w-full h-full flex items-center flex-col justify-between'>
      {confirmacion ? (
        <div className="py-10">
          {formulario}
        </div>
      ) : (
        <>
          {!confirmacion && (
            <div className='py-10 w-full h-full  flex flex-col justify-center items-center'>
              <GoQuestion className='text-9xl text-yellow-500' />
              <h1 className="text-2xl mt-5">{mensaje}</h1>
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
              {confirmacion ? 'Sí' : 'Sí'}
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
              {confirmacion ? 'No' : 'No'}
            </button>
          </div>
        </>
      )}
    </div>
  );
  
  
  
}

export default ModalConfirmacion;