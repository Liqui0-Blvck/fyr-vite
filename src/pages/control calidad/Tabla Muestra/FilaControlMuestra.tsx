import { TableCell } from '@mui/material'

import useDarkMode from '../../../hooks/useDarkMode'

import { useAuth } from '../../../context/authContext'
import { TControlCalidad, TPerfil, TRendimientoMuestra, TUsuario } from '../../../types/registros types/registros.types'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import toast from 'react-hot-toast'
import { format } from '@formkit/tempo'
import ModalRegistro from '../../../components/ModalRegistro'
import { GiTestTubes } from "react-icons/gi";
import { FaPlus } from "react-icons/fa6";
import { BiCheckDouble, BiPlus } from 'react-icons/bi'
import { HeroEye, HeroXMark } from '../../../components/icon/heroicons'
import ModalConfirmacion from '../../../components/ModalConfirmacion'
import FormularioPepaMuestra from '../Formulario Pepa Muestra/FormularioPepaMuestra'
import FormularioCCPepaCalibre from '../Formulario Calibres/FormularioCalibres'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import DetalleCC from '../Detalle/DetalleCCPepa'
import { cargolabels } from '../../../utils/generalUtils'
import Tooltip from '../../../components/ui/Tooltip'
import { Link, useLocation } from 'react-router-dom'
import { RiErrorWarningFill } from 'react-icons/ri'


interface ILoteCompletadoProps {
  muestra: TRendimientoMuestra | null
  refresh: Dispatch<SetStateAction<boolean>>
  id_lote: number
  ccLote?: TControlCalidad | null
  setOpen: Dispatch<SetStateAction<boolean>>

}

const FilaControlMuestra: FC<ILoteCompletadoProps> = ({ muestra: row, refresh, id_lote, setOpen }) => {
  const { authTokens, validate, perfilData, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  const { pathname } = useLocation()
  const [openModalCCPepa, setOpenModalCCPepa] = useState<boolean>(false)
  const [ccPepaConfirmacion, setccPepaConfirmacion] = useState<boolean>(false)
  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const [openConfirmacion, setOpenConfirmacion] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)
  const [confirmacionCCPepa, setConfirmacionCCPepa] = useState<boolean>(false)
  const [isCalibrable, setIsCalibrable] = useState<boolean>(false)




  const cargoLabels = perfilData?.cargos.map(cargo => cargo.cargo_label) || [];

  const { data: userData } = useAuthenticatedFetch<TPerfil>(
    authTokens,
    validate,
    `/api/registros/perfil/${row?.registrado_por}`
  )

  const handleContramuestra = async (id: number, estado: string) => {
		const response = await fetch(`${base_url}/api/estado-contramuestra/${id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${authTokens?.access}`
			},
			body: JSON.stringify({
				esta_contramuestra: estado
			})
		})
		if (response.ok) {
			refresh(true)
      setOpen(false)
		} else {
			console.log("nop no lo logre")
		}
	}

  const deleteMuestra = async () => {
    const res = await fetch(`${base_url}/api/control-calidad/recepcionmp/${row?.cc_recepcionmp}/muestras/${row?.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}`
      }
    })

    if (res.ok){
      refresh(true)
    } else {
      console.log("Confirmame porfavor")
    }
  }

  useEffect(() => {
    let isMounted = true

    if (isMounted && confirmacion){
      deleteMuestra()
    }
    return () => {
      isMounted = false
    }
  }, [confirmacion])

  console.log(row)


  return (
    <>
      <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{row?.id}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{format(row?.fecha_creacion!, { date: 'long', time: 'short' }, 'es')}</span>
        </div>
      </TableCell>
      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-5'>
          <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{userData?.user.username} |</span>
          <h4 className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Area{userData?.cargos.length! > 1 ? 's': ''}: </h4>
          {userData?.cargos.map((cargo) => (
            <>
              <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{cargo.cargo_label}</span>
            </>
          ))}
        </div>
      </TableCell>
      <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
        <div className=' h-full w-full flex items-center justify-center gap-10'>
          {
            pathname.includes('vb_control')
              ? String(row?.esta_contramuestra) === '1'
                  ? (
                    <Tooltip text='Muestra Solicitada'>
                        <button
                          type='button' 
                          className={`w-[90%] mx-auto cursor-pointer flex items-center justify-center rounded-md px-1 h-12 ${isDarkTheme ? 'bg-green-600 hover:bg-green-400 text-white' : 'bg-green-600 hover:bg-green-400 text-white'} hover:scale-105`}>
                          <BiCheckDouble className='text-4xl'/>
                        </button>
                      </Tooltip>
                  )
                  : (
                    (
                      <Tooltip text='Solicitar Contra Muestra'>
                        <button
                          onClick={() => handleContramuestra(row?.id!, '1')}
                          type='button' 
                          className={`w-[90%] mx-auto cursor-pointer flex items-center justify-center rounded-md px-1 h-12 ${isDarkTheme ? 'bg-orange-600 hover:bg-orange-400 text-white' : 'bg-orange-600 hover:bg-orange-400 text-white'} hover:scale-105`}>
                          <RiErrorWarningFill className='text-4xl'/>
                        </button>
                      </Tooltip>
                    )
                  )
              : (
                <>
                {
                  row?.cc_ok === true
                    ? (
                      <div className={`w-24 flex items-center justify-center rounded-md px-1 md:h-10 lg:h-12 ${isDarkTheme ? 'bg-green-600 hover:bg-green-400 text-white' : 'bg-green-600 hover:bg-green-400 text-white'} hover:scale-105`}>
                        <BiCheckDouble className='text-4xl'/>
                      </div>
                    )
                    : (
                      <ModalRegistro
                        open={openModalCCPepa}
                        setOpen={setOpenModalCCPepa}
                        title={`Muestra Control de Rendimiento del Lote N° `}
                        textTool='CC Pepas Muestras'
                        size={ccPepaConfirmacion ? 900 : 500}
                        width={`w-24 px-1 md:h-10 lg:h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
                        icon={<GiTestTubes className='text-4xl'/>}
                      >
                        <ModalConfirmacion 
                          id={row?.id!}
                          id_lote={id_lote}
                          mensaje='¿Quieres registrar CC Pepa?'
                          formulario={<FormularioPepaMuestra isCalibrable={setIsCalibrable} id_lote={id_lote!} id_muestra={row?.id!} refresh={refresh} isOpen={setOpenModalCCPepa}/>}
                          confirmacion={ccPepaConfirmacion}
                          setConfirmacion={setccPepaConfirmacion}
                          setOpen={setOpenModalCCPepa}
                          refresh={() => refresh} />
                      </ModalRegistro>
                    )
                  }

                  <Tooltip text='Detalle Control Calidad Pepa '>
                    <Link to={`/app/control-calidad/${id_lote}/muestra/${row?.id}`}>
                      <div className='w-full flex items-center'>
                        <HeroEye style={{ fontSize: 32 }} />
                    </div>
                    </Link>
                  </Tooltip>

                  {
                    cargolabels(perfilData).includes('CDC Jefatura')
                      ? (
                        <ModalRegistro
                          open={openConfirmacion}
                          setOpen={setOpenConfirmacion}
                          title={`Muestra Control de Rendimiento del Lote N° ${row?.cc_recepcionmp}`}
                          textTool='Eliminar Muestra'
                          size={500}
                          width={`w-24 px-1 md:h-10 lg:h-12 ${isDarkTheme ? 'bg-red-800 hover:bg-red-700' : 'bg-red-800 hover:bg-red-700 text-white'} hover:scale-105`}
                          icon={<HeroXMark style={{ fontSize: 25 }} />}
                        >
                          <ModalConfirmacion 
                            id={row?.id!}
                            mensaje='¿Estas seguro de eliminar esta muestra?'
                            confirmacion={confirmacion}
                            setConfirmacion={setConfirmacion}
                            setOpen={setOpenConfirmacion}
                            refresh={refresh} />
                        </ModalRegistro>
                        )
                      : null
                  }
                </>
              )
          }
        </div>
      </TableCell>
      
    </>

  )
}

export default FilaControlMuestra
