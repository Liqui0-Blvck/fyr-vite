import React, { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import FormularioRegistroControlCalidad from '../../../control calidad/Formulario Registro/FormularioRegistroControlCalidad';

interface IModalProps {
  id: number;
  id_lote: number;
  estadoActivo: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  numero_estado: string;
  refresh: Dispatch<SetStateAction<boolean>>
}

const ModalBasicText: FC<IModalProps> = ({ id, estadoActivo, setOpen, numero_estado, refresh }) => {
  const base_url = process.env.VITE_BASE_URL_DEV;

  const [prevNumeroEstado, setPrevNumeroEstado] = useState<number>(0);

  useEffect(() => {
    setPrevNumeroEstado(Number(numero_estado));
  }, [numero_estado]);

  console.log(numero_estado);
  const updateEstadoLote = async (id: number, estado: string) => {
    console.log(estado);
    const res = await fetch(`${base_url}/api/estado-update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({  
        estado_recepcion: estado
      })
    });

    if (res.ok) {
      estadoActivo(estado);
      if (Number(estado) > 1){
        setOpen(false)
        refresh(true)
      }
      
    } else {
      console.log("Errores sobre errores");
    }
  }

  return (
    <div className='w-full h-full flex items-center flex-col justify-between'>
      {numero_estado === '2' && prevNumeroEstado !== 2 ? (
        <FormularioRegistroControlCalidad id_lote={id} setOpen={setOpen}/>
      ) : (
        <>
          <p className='pt-20'>¿Estás seguro de que quieres hacer esto?</p>

          <div className='w-full flex items-center justify-between'>
            <button 
              className='w-48 py-3 px-6 rounded-md bg-blue-800 text-white'
              onClick={() => updateEstadoLote(id, `${numero_estado > '0' && numero_estado <= '7' ? String(Number(numero_estado) + 1) : '1'}`)}
            > 
              Si 
            </button>
            <button 
              className='w-48 py-3 px-6 rounded-md bg-red-600 text-white'
              onClick={() => setOpen(false)}
            > 
              No 
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ModalBasicText;
