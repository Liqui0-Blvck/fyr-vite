import React, { Dispatch, FC, SetStateAction } from 'react'
import FormularioRegistroControlCalidad from '../../../control calidad/Formulario Registro/FormularioRegistroControlCalidad'

interface IModalProps {
  id: number
  id_lote: number
  estadoActivo: Dispatch<SetStateAction<string>>
  setOpen: Dispatch<SetStateAction<boolean>>
  numero_estado: string
}

const ModalBasicText: FC<IModalProps> = ({ id, estadoActivo, setOpen, numero_estado, id_lote }) => {
  const base_url = process.env.VITE_BASE_URL_DEV

  console.log(id)
  console.log(numero_estado)
  const updateEstadoLote = async (id: number, estado: string) => {
    console.log(estado)
    const res = await fetch(`${base_url}/api/estado-update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({  
        estado_recepcion: estado
      })
    })

    if (res.ok){
      estadoActivo(estado)
      setOpen(false)
    } else {
      console.log("Errores sobre errores")
    }
  }
  return (
    <div className='w-full h-full flex items-center flex-col justify-between'>
      {
        numero_estado === '1'
          ? (
            <FormularioRegistroControlCalidad id_guia={id} id_lote={id_lote}/>
          )
          : (
            <>
              <p className='pt-20'>Estas seguro de que quieres hacer esto?</p>

              <div className='w-full flex items-center justify-between'>
                <button 
                  className='w-48 py-3 px-6 rounded-md bg-blue-800 text-white'
                  onClick={() => updateEstadoLote(id, `${numero_estado > '0' && numero_estado <= '7' ? String(Number(numero_estado) + 1) : '1'}`)}> Si </button>
                <button 
                  className='w-48 py-3 px-6 rounded-md bg-red-600 text-white'
                  onClick={() => setOpen(false)}> No </button>

              </div>
            </>
          )
          
      }
    </div>
  )
}

export default ModalBasicText
