import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/authContext';
import useDarkMode from '../../../../hooks/useDarkMode';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedFetch } from '../../../../hooks/useAxiosFunction';
import { TControlCalidad, TRendimientoActual, TRendimientoMuestra, TTarjaResultante } from '../../../../types/registros types/registros.types';
import FilaTarjaResultante from './FilaRendimientoPrograma';
import { TablePagination } from '@mui/material';
import FilaProyeccionRecepcionado from './FilaRendimientoPrograma';


interface IRendimientoMuestra {
  id_lote?: number
  data?: TRendimientoActual
  refresh?: Dispatch<SetStateAction<boolean>>
  tarjas_resultantes?: TTarjaResultante[]
  ccLote?: TControlCalidad | null
}

const TablaRendimientoPrograma: FC<IRendimientoMuestra> = ({ data, tarjas_resultantes }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();

  console.log(data)
  console.log(tarjas_resultantes)

  const pepa_calibrada = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '3').reduce((acc, tarja) => tarja.peso + acc, 0)
  const pepa_borrel = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '1').reduce((acc, tarja) => tarja.peso + acc, 0)
  const residuo_solido = tarjas_resultantes?.filter(tarja => tarja.tipo_resultante === '2').reduce((acc, tarja) => tarja.peso + acc, 0)
  const pepa_resultante = pepa_borrel! + pepa_calibrada!

  console.log(pepa_calibrada)
  console.log(pepa_borrel)
  console.log(residuo_solido)
  console.log(data?.cc_pepa_calibre.sincalibre)

  return (
    <div>
      <div
          className='relative left-[0px] lg:left-0 p-5 '>
        <TableContainer sx={{ height: 500, borderRadius: 3 }}>
          <Table className='table' aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow className='table-row' sx={{ borderRadius: 5, backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>u/oz</TableCell>
                <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Kilos</TableCell>
                <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Porcentaje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='table-body' >
              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>

                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Sin Calibre</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.sincalibre)?.toFixed(1)} kgs</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.sincalibre! / pepa_resultante * 100 )?.toFixed(1)} %</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>

                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>Pre Calibre</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.precalibre)?.toFixed(1)} kgs</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.precalibre! / pepa_resultante * 100)?.toFixed(1)} %</span>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>18/20</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_18_20)?.toFixed(1)} kgs</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_18_20! / pepa_resultante * 100)?.toFixed(1)} %</span>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>20/22</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_20_22)?.toFixed(1)} kgs</span>

                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_20_22! / pepa_resultante * 100)?.toFixed(1)} %</span>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>23/25</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_23_25)?.toFixed(1)} kgs</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                  <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_23_25! / pepa_resultante * 100)?.toFixed(1)} %</span>

                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>25/27</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_25_27 )?.toFixed(1)} kgs</span>

                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_25_27! / pepa_resultante * 100)?.toFixed(1)} %</span>

                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>27/30</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_27_30)?.toFixed(1)} kgs</span>

                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_27_30! / pepa_resultante * 100)?.toFixed(1)} %</span>

                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>30/32</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_30_32)?.toFixed(1)} kgs</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_30_32! / pepa_resultante * 100)?.toFixed(1)} %</span>

                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>32/34</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_32_34)?.toFixed(1)} kgs</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_32_34! / pepa_resultante * 100)?.toFixed(1)} %</span>

                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>34/36</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_34_36)?.toFixed(1)} kgs</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_34_36! / pepa_resultante * 100)?.toFixed(1)} %</span>

                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>36/40</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_36_40)?.toFixed(1)} kgs</span>

                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_36_40! / pepa_resultante * 100)?.toFixed(1)} %</span>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>40/+</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_40_mas)?.toFixed(1)} kgs</span>
                  </div>
                </TableCell>

                <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <div className=' h-full w-full flex items-center justify-center gap-5'>
                    <span className={`text-xl ${isDarkTheme ? 'text-white' : 'text-black'}`}>{(data?.cc_pepa_calibre.calibre_40_mas! / pepa_resultante * 100)?.toFixed(1)} %</span>

                  </div>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div >
  );
};

export default TablaRendimientoPrograma;