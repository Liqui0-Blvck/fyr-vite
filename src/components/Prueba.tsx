import React from 'react'
import useAxiosFunction from '../hooks/useAxiosFunction'

interface PruebaFetch {
  id: string
  stock_bodega: number
  nombre_categoria: string
  fecha_creacion: string
  fecha_modificacion: string
  nombre: string
  descripcion: string
  foto: string
  marca: string
  categoria: number
  proveedores: number[]
}

const Prueba = () => {
  const { response, setRefresh } = useAxiosFunction({
    method: 'GET',
    url: '/api/items/'
  })

  return (
    <div>
      <button>
        Preguntar
      </button>
    </div>
  )
}

export default Prueba
