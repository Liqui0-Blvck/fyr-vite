import { useFormik } from 'formik'
import Input from '../../../components/form/Input'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TCamion, TControlCalidad, TControlCalidadB, TControlCalidadTarja, TEnvaseEnGuia, TEnvases, TFotosCC, TGuia, TLoteGuia, TPepaMuestra, TPerfil, TProductor, TRendimiento, TRendimientoMuestra, TTarjaResultante, TUsuario } from '../../../types/registros types/registros.types'
import { useLocation } from 'react-router-dom'
import { urlNumeros } from '../../../services/url_number'
import { format } from '@formkit/tempo'
import { tipoFrutaFilter, variedadFilter } from '../../../constants/options.constants'
import { Skeleton } from '@mui/material'
import ModalRegistro from '../../../components/ModalRegistro'
import FormularioCCRendimiento from '../../control calidad/Formulario CC Rendimiento/FormularioCCRendimiento'
import ModalConfirmacion from '../../../components/ModalConfirmacion'
import FormularioCCPepaCalibre from '../../control calidad/Formulario Calibres/FormularioCalibres'
import { FaPlus } from 'react-icons/fa6'
import PieChart from '../../../components/charts/PieChart'
import Label from '../../../components/form/Label'
import { optionsCalibres } from '../../../utils/generalUtils'

const DetalleCCTarjaReproceso = () => {
  const { isDarkTheme } = useDarkMode();
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { authTokens, validate } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  // const [rendimientos, setRendimientos] = useState<TRendimiento | null>(null)

  const { data: control_calidad, loading, setRefresh } = useAuthenticatedFetch<TControlCalidadTarja>(
    authTokens,
    validate,
    `/api/reproceso/cdc-tarjaresultante/${id}`
  )

  console.log(control_calidad)

    const clavesDeseadas = [
      'trozo',
      'picada',
      'hongo',
      'daño_insecto',
      'dobles',
      'goma',
      'basura',
      'mezcla_variedad',
      'pepa_sana',
      'fuera_color',
      'punto_goma',
      'vana_deshidratada',
    ];
  
    const totalMuestra = control_calidad?.cantidad_muestra;
    const labels: string[] = [];
    const valores: number[] = [];
  
    if (control_calidad){
      clavesDeseadas.forEach((key: any) => {
        labels.push(key); // Agregar la etiqueta
        valores.push(parseFloat((control_calidad[key] / totalMuestra * 100).toFixed(2))); // Calcular y agregar el valor
      });
    }

  return (
    <div className={`lg:grid lg:grid-rows-10 md:grid md:grid-rows-7 gap-x-3 h-full w-[90%] mx-auto dark:bg-zinc-800 bg-zinc-100 relative px-5 py-2
        place-items-center lg:gap-2 md:gap-2 flex flex-col gap-6 overflow-auto
        rounded-md`}
    >
      <div className={`w-full col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } h-16 flex items-center justify-center rounded-md`}>
        <h1 className='text-3xl'>Detalle de Control de Calidad Tarja Reproceso Resultante N° {control_calidad?.codigo_tarja}</h1>
      </div>

      <article className={`row-start-2 col-span-3 ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } w-full h-full flex md:flex-row lg:flex-row justify-between items-center gap-x-10 mx-auto`}>
        <div className='w-full md:5/12 lg:5/12 justify-between lg:h-20 flex flex-col lg:flex-row rounded-md lg:gap-x-4 gap-y-4 p-2'>
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4 font-semibold'>Código Tarja: grs</span> 
            <span className='font-semibold text-xl'>{control_calidad?.codigo_tarja}</span>
          </div>
          
          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full  rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4 font-semibold'>Estado:</span> 
            <span className='font-semibold text-xl'>{control_calidad?.estado_cc_label}</span>
          </div>

          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full  rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4 font-semibold'>Calibre:</span>
            <span className='font-semibold text-xl'>{optionsCalibres.find(calibre => calibre.value === control_calidad?.calibre)?.label}</span>
          </div>

          <div className={`border ${isDarkTheme ? 'border-zinc-700' : ' '} w-full  rounded-md h-full flex flex-col justify-center px-2`}>
            <span className='mr-4'>Cantidad Muestra:</span>
            <span className='font-semibold text-xl'>{control_calidad?.cantidad_muestra} grs</span>
          </div>
        </div>
      </article>

      <article className={`row-start-4 row-span-4 col-span-3 w-full h-full ${isDarkTheme ? 'bg-zinc-800' : ' bg-zinc-100' } flex flex-col lg:flex-col justify-between `}>
        <div className='flex flex-col gap-5 w-full'>
          {
            loading
              ? <Skeleton variant="rectangular" width='100%' height={200}/>
              : (
                <div className='flex flex-row-reverse'>
                  <div className='flex flex-col md:flex-col w-full h-full '>
                    <div className={`w-full h-full border ${isDarkTheme ? 'border-zinc-700' : ' '} px-2 flex flex-col lg:flex-row items-center justify-center rounded-md py-1`}>
                      <div className='lg:w-full'>
                        <p className='text-center'>Grafico Generado en promedio de GRM de muestra registrada</p>
                        <PieChart series={valores! || []} labels={labels! || []}/>
                      </div>
                      <div className='w-full flex flex-col justify-center mt-4 lg:mt-0'> 
                        <h1 className='text-2xl text-center mb-5'>Detalle CC Pepa Bruta</h1>
                        <div className='grid grid-cols-4 gap-x-5 gap-y-2'>
                          <div className='md:col-span-2'>
                            <Label htmlFor='' className='text-center'>Trozo</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{(control_calidad?.trozo!).toFixed(1)} grs</span>
                            </div>
                          </div>
                          <div className='md:col-start-3 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Picada</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{(control_calidad?.picada!).toFixed(1)} grs</span>
                            </div>
                          </div>
                          <div className='md:row-start-2 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Hongo</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{(control_calidad?.hongo!).toFixed(1)} grs</span>
                            </div>
                          </div>
                          <div className='md:row-start-2 md:col-start-3 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Daño Insecto</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{(control_calidad?.daño_insecto!).toFixed(1)} grs</span>
                            </div>
                          </div>
                          <div className='md:row-start-3 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Dobles</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{(control_calidad?.dobles!).toFixed(1)} grs</span>
                            </div>
                          </div>
                          <div className='md:row-start-3 md:col-start-3 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Vana Deshidratada</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{(control_calidad?.vana_deshidratada!).toFixed(1)} grs</span>
                            </div>
                          </div>
                          <div className='md:row-start-4 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Mezcla Variedad</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{(control_calidad?.mezcla_variedad!).toFixed(1)} grs</span>
                            </div>
                          </div>
                          <div className='md:row-start-4 md:col-start-3 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Fuera Color</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{(control_calidad?.fuera_color!).toFixed(1)} grs</span>
                            </div>
                          </div>
                          <div className='md:row-start-5 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Goma</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{(control_calidad?.goma!).toFixed(1)} grs</span>
                            </div>
                          </div>
                          <div className='md:row-start-5 md:col-start-3 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Punto Goma</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{(control_calidad?.punto_goma!).toFixed(1)} grs</span>
                            </div>
                          </div>

                          <div className='md:row-start-6 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Basura</Label>
                            <div className='flex items-center justify-center dark:bg-zinc-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{control_calidad?.basura.toFixed(1)} grs</span>
                            </div>
                          </div>
                          <div className='md:row-start-6 md:col-start-3 md:col-span-2 '>
                            <Label htmlFor='' className='text-center'>Pepa Sana</Label>
                            <div className='flex items-center justify-center dark:bg-green-700 bg-zinc-200 py-2 px-3 rounded-md'>
                              <span>{control_calidad?.pepa_sana.toFixed(1)} grs</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                    )
          }
        </div>
      </article>
    </div>

  )
}

export default DetalleCCTarjaReproceso
