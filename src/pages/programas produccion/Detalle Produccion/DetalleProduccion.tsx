import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import React, { Dispatch, FC, SetStateAction, SyntheticEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { Tabs, Typography } from '@mui/material'
import useDarkMode from '../../../hooks/useDarkMode'
import { useAuth } from '../../../context/authContext'
import { urlNumeros } from '../../../services/url_number'
import DetalleTarjaResultante from '../Detalle Tarja Resultante/DetalleTarjaResultante'
import DetalleEnvasesLote from '../Detalle Envases Lote/DetalleEnvasesLote'
import DetalleEnvasesMasivosLotes from '../Detalle Masivo Envases Lotes/DetalleEnvasesMasivosLotes'
import DetalleOperarioPrograma from '../Detalle Operarios Programa/DetalleOperarioPrograma'
import { format } from '@formkit/tempo'
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction'
import { TEnvasesPrograma, TLoteProduccion, TPerfil, TProduccion } from '../../../types/registros types/registros.types'


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const DetalleProduccion = () => {
  const { authTokens, validate } = useAuth()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const { isDarkTheme } = useDarkMode()
  const [value, setValue] = useState(0);
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  const { data: programa_produccion } = useAuthenticatedFetch<TProduccion>(
    authTokens,
    validate,
    `/api/produccion/${id}/`
  )

  const { data: userData } = useAuthenticatedFetch<TPerfil>(
    authTokens,
    validate,
    `/api/registros/perfil/${programa_produccion?.registrado_por}/`
  )

  const { data: envases_programa } = useAuthenticatedFetch<TEnvasesPrograma[]>(
    authTokens,
    validate,
    `/api/produccion/${id}/lotes_en_programa`
  )

  // console.log(programa_produccion?.lotes.map(lote => lote.envases?.map(envase => envase)))
  
  console.log(envases_programa)



  const kilos_totales = envases_programa?.reduce((acc, envase) => envase?.kilos_fruta + acc, 0).toFixed(1)
  const kilos_totales_procesados = envases_programa?.
    filter(envase => envase?.bin_procesado === true).
    reduce((acc, envase) => envase?.kilos_fruta + acc, 0).toFixed(1)
  


  return (
    <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} h-full`}>
      <div
        // onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
      gap-y-10  ${isDarkTheme ? 'bg-zinc-800' : oneLight} relative px-5 py-6 
      rounded-md`}
      >

        <div className={`${isDarkTheme ? 'bg-zinc-800' : 'bg-[#F4F4F5]'} h-full rounded-md col-span-6 bg-[#F4F4F5]`}>
          <h1 className='text-center text-2xl p-2'>Información Detallada del Programa de Producción N° 32 </h1>
          <h5 className='text-center text-xl p-2'>Programa Creado el {format(programa_produccion?.fecha_creacion!, { date: 'medium', time: 'short' }, 'es')} por {userData?.user.username} | {userData?.user.email}</h5>
        </div>

        <div className='w-full flex flex-col-reverse lg:flex-row gap-5 justify-between col-span-6'>
          <div className={`${isDarkTheme ? 'bg-zinc-800' : 'bg-[#F4F4F5] '} w-full flex gap-20 justify-between h-full px-5 rounded-md col-span-6 bg-[#F4F4F5]`}>
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value}  onChange={handleChange} >
                  <Tab label="Tarjas Resultantes" {...a11yProps(0)} className={`${isDarkTheme ? 'light' : 'dark'}`} />
                  <Tab label="Envases de Lotes Seleccionadoss" {...a11yProps(1)} className={`${isDarkTheme ? 'light' : 'dark'}`} />
                  <Tab label="Procesar Masivamente" {...a11yProps(2)} className={`${isDarkTheme ? 'light' : 'dark'}`} />
                  <Tab label="Operarios en Programa" {...a11yProps(2)} className={`${isDarkTheme ? 'light' : 'dark'}`} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0} >
                <DetalleTarjaResultante />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <DetalleEnvasesLote />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <DetalleEnvasesMasivosLotes />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <DetalleOperarioPrograma />
              </CustomTabPanel>
            </Box>
          </div>
          <div className={`${isDarkTheme ? 'bg-zinc-800' : 'bg-[#F4F4F5] '} lg:w-5/12 flex flex-col gap-y-5  justify-between  px-5 rounded-md col-span-6 bg-[#F4F4F5] static`}>

            <article className='w-full h-full py-2'>
              <h3 className='text-center mb-5'>Fruta calibrada del proceso</h3>

              <div className='border border-zinc-600 rounded-md flex flex-col'>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Programa creado el: {format(programa_produccion?.fecha_creacion!, { date: 'medium', time: 'short' }, 'es')}.</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Ultima modificacion: {format(programa_produccion?.fecha_modificacion!, { date: 'medium', time: 'short' }, 'es')}</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Kilos totales en producción: {kilos_totales} kgs</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Kilo Fruta Procesados: {kilos_totales_procesados} kgs.</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Total de envases a procesar: {programa_produccion?.lotes.length} </span>
                </div>
              </div>
            </article>


            <article className='w-full h-full py-2'>
              <h3 className='text-center mb-5'>Fruta calibrada del proceso</h3>
              <div className='border border-zinc-600 rounded-md flex flex-col'>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Kilos totales resultante: 18000 kgs.</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Kilos pepa calibrada: 18000 kgs</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Kilos borrel: kgs</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Kilos residuos solidos: kgs</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                </div>
              </div>
            </article>


            <article className='w-full h-full py-2'>
              <h3 className='text-center mb-5'>Estadistica de producción</h3>
              <div className='border border-zinc-600 rounded-md flex flex-col'>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Estado Programa: {programa_produccion?.estado_label}</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Fruta procesada en ultima hora: kgs</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Fruta calibrada en ultima hora: kgs.</span>
                </div>
                <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                  <span>Fruta que compone el Programa N° 40  Nonpareil</span>
                </div>
                <div className='w-full h-full flex items-center py-3.5 px-2'></div>
              </div>
            </article>

          </div>

            
        </div>
      </div>

     
    </div>
  )
}

export default DetalleProduccion 
