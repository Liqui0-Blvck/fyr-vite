import React, { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import FormularioRegistroControlCalidad from '../../../control calidad/Formulario Registro/FormularioRegistroControlCalidad';
import { TEnvaseEnGuia, TLoteGuia } from '../../../../types/registros types/registros.types';
import { GoQuestion } from "react-icons/go";
import useDarkMode from '../../../../hooks/useDarkMode';
import { TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../constants/select.constanst';

interface IModalProps {
  id: number;
  id_lote: number;
  estadoActivo: Dispatch<SetStateAction<string | null>>;
  setOpen: Dispatch<SetStateAction<boolean | null>>;
  numero_estado: string;
  refresh: Dispatch<SetStateAction<boolean | null>>
  lote: TLoteGuia | null,
  usuario: any
}

const ModalBodega: FC<IModalProps> = ({ id, estadoActivo, setOpen, numero_estado, refresh, lote, usuario }) => {
  const base_url = process.env.VITE_BASE_URL_DEV;
  const { isDarkTheme } = useDarkMode()


  const variedadFilter = VARIEDADES_MP?.map((producto) => ({
    value: String(producto.value),
    label: producto.label
  })) ?? []

  const tipoFrutaFilter = TIPO_PRODUCTOS_RECEPCIONMP?.map((producto) => ({
    value: String(producto.value),
    label: producto.label
  })) ?? []


  console.log(lote)

  const [prevNumeroEstado, setPrevNumeroEstado] = useState<number>(0);
  const [confirmacion, setConfirmacion] = useState<boolean>(false);

  useEffect(() => {
    setPrevNumeroEstado(Number(numero_estado));
  }, [numero_estado]);

  const handleConfirm = () => {
    if (confirmacion) {
      setOpen(false);
    } else {
      setConfirmacion(true);
    }
  }

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
      if (numero_estado >= '1') {
        setOpen(false)
        refresh(true)
      }  
    } else {
      console.log("Errores sobre errores");
    }
  }

  return (
    <div className='w-full h-full flex items-center flex-col justify-between'>
      {confirmacion && numero_estado === '2' ? (
        <FormularioRegistroControlCalidad id_lote={id} setOpen={setOpen} refresh={refresh}/>
      ) : (
        <>
          {!confirmacion && (
            <div className='py-10'>{
              numero_estado === '1' 
                ? (
                  <div className={`${isDarkTheme ? 'bg-gray-50' : 'bg-gray-700'}w-full h-full  flex flex-col justify-center items-center`}>
                    <GoQuestion className='text-9xl text-yellow-500' />
                    <h1 className='text-center'>Estas seguro de querer avanzar?</h1>
                    <ul className='mt-10 flex flex-col items-center gap-2'>
                      <li className={`font-semibold text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Kilos Brutos:  {lote?.kilos_brutos_1}</li>
                      <li className={`font-semibold text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Cantidad Envases:  {lote?.envases.length}</li>
                      {
                        lote?.envases.map((envase: TEnvaseEnGuia) => {
                          const variedad_nombre = variedadFilter.find(producto => producto.value === envase.variedad)?.label
                          const tipo_producto_nombre = tipoFrutaFilter.find(producto => producto.value === envase.tipo_producto)?.label 
                          return (
                            <>
                              <li className={`font-semibold text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Producto: {tipo_producto_nombre}</li>
                              <li className={`font-semibold text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Variedad: {variedad_nombre}</li>
                            </>
                          )
                        })
                      }
                      
                    </ul>
                  </div>
                  )
                : ''
            }</div>
          )}
  
          <div className='w-full flex items-center justify-between'>
            <button 
              className='w-48 py-3 px-6 rounded-md bg-blue-800 text-white'
              onClick={() => {
                if (!confirmacion) {
                  if (numero_estado === '1') {
                    updateEstadoLote(id, '2'); 
                  } else {
                    setConfirmacion(true); 
                  }
                } else {
                  setConfirmacion(false);
                }
              }}
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

export default ModalBodega;
