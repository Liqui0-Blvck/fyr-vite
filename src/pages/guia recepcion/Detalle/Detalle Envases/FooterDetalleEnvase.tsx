import { FC, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Input from '../../../../components/form/Input'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import { FaCirclePlus } from "react-icons/fa6";
import { useAuth } from '../../../../context/authContext';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import useDarkMode from '../../../../hooks/useDarkMode';
import { TEnvaseEnGuia, TEnvases, TGuia, TLoteGuia } from '../../../../types/registros types/registros.types';
import { TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../utils/select.constanst';
import { useNavigate } from 'react-router-dom';

interface Row {
  kilos_brutos_1: null,
  kilos_brutos_2: null,
  kilos_tara_1: null,
  kilos_tara_2: null,
  estado_recepcion: null,
  guiarecepcion: null,
  creado_por: null
}

interface IFooterProps {
  id_lote: number,
  id_guia: number
}

const FooterDetalleEnvase: FC<IFooterProps> = ({ id_lote, id_guia }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();
  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()

  const initialRows = [
    {
      envase: null,
      variedad: null,
      tipo_producto: '1',
      cantidad_envases: null
    },
  ]

  const [rows, setRows] = useState(
    initialRows.map((row, index) => ({ ...row, id: index }))
    
  );

  const { data: loteEnGuia } = useAuthenticatedFetch<TLoteGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${id_guia}/lotes/${id_lote}`
  )

  const { data: envases } = useAuthenticatedFetch<TEnvases[]>(
    authTokens,
    validate,
    `/api/envasesmp/`
  )

  const variedadFilter = VARIEDADES_MP?.map((variedad) => ({
    value: String(variedad.value),
    label: variedad.label
  })) ?? []

  const tipoFrutaFilter = TIPO_PRODUCTOS_RECEPCIONMP?.map((producto) => ({
    value: String(producto.value),
    label: producto.label
  })) ?? []

  return (
    <div>
      <div
        className='relative'>
        <TableContainer sx={{ height: 350, overflow: 'hidden', overflowY: 'auto', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 750, borderRadius: 5, background: `${isDarkTheme ? '#18181b' : 'white'}` }} aria-label="simple table">
            <TableHead className='bg-[#18181b] flex rounded-md'>
              <TableRow className='flex flex-wrap'>
                <TableCell align="center" sx={{color: `${isDarkTheme ? 'white' : 'black'}`, fontSize: 12}} className={`w-10 ${isDarkTheme ? 'white' : 'bg-[#c0c0c6] '}`}>Envase</TableCell>
                <TableCell align="center" sx={{color: `${isDarkTheme ? 'white' : 'black'}`, fontSize: 12}} className={`w-10 ${isDarkTheme ? 'white' : 'bg-[#c0c0c6] '}`}>Cantidad Envases</TableCell>
                <TableCell align="center" sx={{color: `${isDarkTheme ? 'white' : 'black'}`, fontSize: 12}} className={`w-10 ${isDarkTheme ? 'white' : 'bg-[#c0c0c6] '}`}>Variedad</TableCell>
                <TableCell align="center" sx={{color: `${isDarkTheme ? 'white' : 'black'}`, fontSize: 12}} className={`w-10 ${isDarkTheme ? 'white' : 'bg-[#c0c0c6] '}`}>Producto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loteEnGuia && loteEnGuia.envases.map((row: TEnvaseEnGuia) => {
                const nombre_envase = envases?.find(envaseList => envaseList.id === row.envase)?.nombre
                const nombre_variedad = variedadFilter.find(variedad => variedad.value === row.variedad)?.label;
                const nombre_producto = tipoFrutaFilter.find(producto => producto.value === row.tipo_producto)?.label

                return (
                  <TableRow key={row.id} style={{ background: `${isDarkTheme ? '#18181b' : 'c0c0c6'}`, position: 'relative',}}>
                    
                    <TableCell component="th" sx={{background: `${isDarkTheme ? '#18181b' : '#c0c0c6'}`, paddingY: 1}}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl text-center ${isDarkTheme ? 'text-white' : 'text-zinc-800'}`}>{nombre_envase}</span>
                      </div>
                    </TableCell>

                    <TableCell component="th" sx={{background: `${isDarkTheme ? '#18181b' : '#c0c0c6'}`, paddingY: 1 }}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl text-center ${isDarkTheme ? 'text-white' : 'text-zinc-800'}`}>{row.cantidad_envases}</span>
                      </div>
                    </TableCell>

                    <TableCell component="th" sx={{background: `${isDarkTheme ? '#18181b' : '#c0c0c6'}`, paddingY: 1 }}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl text-center ${isDarkTheme ? 'text-white' : 'text-zinc-800'}`}>{nombre_variedad}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell component="th" sx={{background: `${isDarkTheme ? '#18181b' : '#c0c0c6'}`, paddingY: 1 }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                        <span className={`text-xl text-center ${isDarkTheme ? 'text-white' : 'text-zinc-800'}`}>{nombre_producto}</span>
                      </div>
                    </TableCell>

                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default FooterDetalleEnvase;
