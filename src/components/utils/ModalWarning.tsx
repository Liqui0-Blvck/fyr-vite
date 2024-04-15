import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { GoQuestion } from "react-icons/go";

interface IModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  mensaje?: string; // Mensaje opcional para el recordatorio
  formulario?: ReactNode;
}

const ModalRecordatorio: FC<IModalProps> = ({ setOpen, mensaje, formulario }) => {
  return (
    <div className="w-full h-full flex items-center flex-col justify-between">
      <div className="py-10">
        <div className="py-10 w-full h-full flex flex-col justify-center items-center">
          <GoQuestion className="text-9xl text-yellow-500" />
          <h1 className="text-2xl mt-5">{mensaje}</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <button
          className="w-48 py-3 px-6 rounded-md bg-blue-800 text-white"
          onClick={() => setOpen(false)}
        >
          Aceptar
        </button>
        <button
          className="w-48 py-3 px-6 rounded-md bg-red-600 text-white"
          onClick={() => setOpen(false)}
        >
          Rechazar
        </button>
      </div>
    </div>
  );
};

export default ModalRecordatorio;
