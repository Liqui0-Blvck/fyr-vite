import { Dispatch, FC, SetStateAction } from 'react';
import Checkbox from '../../../../components/form/Checkbox'
import { TEnvasePatio } from '../../../../types/registros types/registros.types';
import useDarkMode from '../../../../hooks/useDarkMode';
import { useAuth } from '../../../../context/authContext';
import { useLocation } from 'react-router-dom';
import { urlNumeros } from '../../../../services/url_number';
import toast from 'react-hot-toast';


interface IEnvasesEnGuiaListProps {
  row: TEnvasePatio[]
  isSelected: (itemId: number) => boolean;
  handleToggleItem: (itemId: number) => void;
  ubicacion?: string
  refresh: Dispatch<SetStateAction<boolean>>
}

const EnvasesEnGuiaList: FC<IEnvasesEnGuiaListProps> = ({ ubicacion, row, isSelected, handleToggleItem, refresh }) => {
  const { isDarkTheme } = useDarkMode()
  const { authTokens, validate, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)

  const registrarLoteAProduccion = async (id_envase: number) => {
    const res = await fetch(`${base_url}/api/produccion/${id}/lotes_en_programa/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      },
      body: JSON.stringify({
        produccion: id[0],
        bodega_techado_ext: id_envase,
        registrado_por: userID?.user_id
      })
    })

    if (res.ok){
      refresh(true)
      toast.success('Envase agregado correctamente a producción')
    } else {
      toast.error("Ocurrió un error, vuelve a intentarlo")
    }
  }


  return (
    <div className='w-full h-[500px] flex overflow-hidden overflow-y-auto'>
      <ul className='w-full h-14 flex flex-col gap-3'>
      
      {row.filter(envase => envase.estado_envase !== '2').map((envase) => {
        
        
        return (
          <li key={envase.id} className={`${isDarkTheme ? 'bg-zinc-700' : 'bg-zinc-100'} w-full h-full rounded-md`}>
            <div className={`${isDarkTheme ? 'bg-zinc-700' : 'bg-zinc-100'} rounded-md w-full flex items-center p-3`}>
              <Checkbox
                checked={isSelected(envase.id)}
                onChange={() => {
                  handleToggleItem(envase.id)
                  registrarLoteAProduccion(envase.id)
                }}
                className='w-10 h-4'
              />
              <span className='font-semibold text-lg mr-10'>{envase.numero_bin}</span>
              <span className='font-semibold text-lg'>Ubicación: {ubicacion}</span>
            </div>
          </li>
        )
        })}
      </ul>
    </div>
  )
}


export default EnvasesEnGuiaList