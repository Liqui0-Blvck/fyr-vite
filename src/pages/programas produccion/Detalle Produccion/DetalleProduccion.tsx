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
  const { authTokens, validate, userID, perfilData } = useAuth()
  const { pathname } = useLocation()
  const id = urlNumeros(pathname)
  const [nuevoLote, setNuevoLote] = useState<boolean>(false)
  const [guiaID, setGuiaID] = useState<number | null>(null)
  const [variedad, setVariedad] = useState<boolean>(false)
  // const [datosGuia, setDatosGuia] = useState<TGuia | null>(null)
  const [confirmacionCierre, setConfirmacionCierre] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const base_url = process.env.VITE_BASE_URL_DEV
  const { isDarkTheme } = useDarkMode()
  const [value, setValue] = useState(0);
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={`${isDarkTheme ? oneDark : 'bg-white'} h-full`}>
      <div
        // onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
      gap-y-10 mt-10 ${isDarkTheme ? oneDark : oneLight} relative px-5 py-6 
      rounded-md`}
      >

        <div className={`${isDarkTheme ? 'bg-zinc-800' : 'bg-[#F4F4F5] '} rounded-md col-span-6 bg-[#F4F4F5]`}>
          <h1 className='text-center text-2xl p-2'>Información Detallada del Programa de Producción N° 32 </h1>
          <h5 className='text-center text-xl p-2'>Programa Creado el Mar. 29, 2024, 5:18 a.m. por cponce | Email: cponce@prodalmen.cl.</h5>
        </div>

        <div className={`${isDarkTheme ? 'bg-zinc-800' : 'bg-[#F4F4F5] '} flex flex-col lg:flex-row gap-y-10 lg:gap-20 justify-between h-full px-5 rounded-md col-span-6 bg-[#F4F4F5]`}>

          <article className='w-full h-full py-2'>
            <h3 className='text-center mb-5'>Fruta calibrada del proceso</h3>

            <div className='border border-zinc-600 rounded-md flex flex-col'>
              <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                <span>Programa creado el: 07/03/2023 8:05 a.m.</span>
              </div>
              <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                <span>Ultima modificacion: 03/28/2024 3:14 p.m.</span>
              </div>
              <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                <span>Kilos totales en producción: 173110.0 kgs</span>
              </div>
              <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                <span>Kilo Fruta Procesados: 151030 kgs.</span>
              </div>
              <div className='w-full h-full flex items-center border border-zinc-600 py-3.5 px-2'>
                <span>Total de envases a procesar: 187 </span>
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
                <span>Estado Programa: En Proceso .</span>
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

        <div className={`${isDarkTheme ? 'bg-zinc-800' : 'bg-[#F4F4F5] '} flex gap-20 justify-between h-full px-5 rounded-md col-span-6 bg-[#F4F4F5]`}>
          <Box sx={{ width: '100%' }}>
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


       

      </div>

     
    </div>
  )
}

export default DetalleProduccion 
