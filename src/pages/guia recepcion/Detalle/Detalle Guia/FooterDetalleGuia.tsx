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
import { TCamion, TEnvaseEnGuia, TEnvases, TGuia, TLoteGuia } from '../../../../types/registros types/registros.types';
import { TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../../constants/select.constanst';
import { useNavigate } from 'react-router-dom';
import Dropdown, { DropdownToggle, DropdownMenu, DropdownItem } from '../../../../components/ui/Dropdown'
import Button from '../../../../components/ui/Button';
import { HeroEye, HeroPencilSquare } from '../../../../components/icon/heroicons';

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
  data: TGuia,
}

const FooterDetalleGuia: FC<IFooterProps> = ({ data }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();
  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()
  const [lotes, setLotes] = useState<TLoteGuia | null>(null)

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

  const { data: envases } = useAuthenticatedFetch<TEnvases[]>(
    authTokens,
    validate,
    `/api/envasesmp/`
  )

  const { data: camiones } = useAuthenticatedFetch<TCamion[]>(
    authTokens,
    validate,
    `/api/registros/camiones/`
  )



  const formik = useFormik({
    initialValues: {
      kilos_brutos_1: 0,
      kilos_brutos_2: 0,
      kilos_tara_1: 0,
      kilos_tara_2: 0,
      estado_recepcion: null,
      guiarecepcion: null,
      creado_por: null,
    },
    onSubmit: async (values: any) => {
      const formData = new FormData()
      const lotesData = rows.map((row) => ({
        numero_lote: row.id,
        kilos_brutos_1: values.kilos_brutos_1,
        kilos_brutos_2: values.kilos_brutos_2,
        kilos_tara_1: 0,
        kilos_tara_2: 0,
        estado_recepcion: '1',
        guiarecepcion: data.id,
        creado_por: data.creado_por,
      }))
      formData.append('lotes', JSON.stringify(lotesData))
      const envasesData = rows.map((row) => ({
        envase: row.envase,
        variedad: row.variedad,
        tipo_producto: row.tipo_producto,
        cantidad_envases: row.cantidad_envases,
      }));
      formData.append('envases', JSON.stringify(envasesData));


      try {
        const res = await fetch(`${base_url}/api/recepcionmp/${data.id}/lotes/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authTokens?.access}`
          },
          body: formData
        })
        if (res.ok) {
          toast.success("la guia de recepción fue registrado exitosamente!!")
          navigate(`/app/recepciomp`)
        } else {
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })


  const envasesList = envases?.map((envase: TEnvases) => ({
    value: String(envase.id),
    label: envase.nombre
  })) ?? []

  const variedadFilter = VARIEDADES_MP?.map((variedad) => ({
    value: String(variedad.value),
    label: variedad.label
  })) ?? []

  const tipoFrutaFilter = TIPO_PRODUCTOS_RECEPCIONMP?.map((producto) => ({
    value: String(producto.value),
    label: producto.label
  })) ?? []

  const camionAcoplado = camiones?.find(camion => camion?.id === Number(data?.camion))?.acoplado

  useEffect(() => {
    data?.lotesrecepcionmp.map((lote: TLoteGuia) => {
      setLotes(lote)
    })
  }, [data])

  console.log(lotes)

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className='relative'>
        <TableContainer sx={{ height: 350, overflow: 'hidden', overflowY: 'auto', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 750, background: `${isDarkTheme ? '#09090B' : 'white'}` }} aria-label="simple table">
            <TableHead >
              <TableRow>
                <TableCell align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10, width: 100 }}>N° Lote</TableCell>
                <TableCell align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10, width: 120 }}>Kilos Brutos Camión</TableCell>
                {data?.mezcla_variedades ? <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10, width: 120 }}>Kilos Brutos Acoplado</TableCell> : null}
                <TableCell align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`, padding: 10, width: 150 }}>Tipo Envase</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: 150 }}>Variedad</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`, width: 200 }}>Tipo Producto</TableCell>
                {data?.mezcla_variedades ? <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Opciones</TableCell> : null}
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.lotesrecepcionmp.map((row: TLoteGuia) => {
                console.log(row)
                return (
                  <TableRow key={row.id} style={{ background: `${isDarkTheme ? '#09090B' : 'white'}`, position: 'relative', height: 10 }}>
                    <TableCell component="th" sx={{ maxWidth: 20, minWidth: 20, background: `${isDarkTheme ? '#27272A' : '#F4F4F5'}`, borderRight: '4px solid white', paddingY: 1 }}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className='text-xl'>{row?.numero_lote}</span>
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ maxWidth: 40, minWidth: 40, background: `${isDarkTheme ? '#27272A' : '#F4F4F5'}`, borderRight: '4px solid white', paddingY: 1 }}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        <span className='text-xl' >{row?.kilos_brutos_1}</span>
                      </div>
                    </TableCell>
                    {
                      camionAcoplado
                        ? (
                          <TableCell component="th" scope="row" sx={{ maxWidth: 40, minWidth: 40, background: `${isDarkTheme ? '#27272A' : '#F4F4F5'}`, borderRight: '4px solid white', paddingY: 1 }}>
                            <div className=' h-full w-full flex items-center justify-center'>
                              <span className='text-xl' >{row?.kilos_brutos_2}</span>
                            </div>
                          </TableCell>
                        )
                        : null
                    }
                    <TableCell component="th" scope="row" sx={{ maxWidth: 200, minWidth: 200, background: `${isDarkTheme ? '#27272A' : '#F4F4F5'}`, borderRight: '4px solid white', paddingY: 1 }}>
                      <Dropdown>
                        <DropdownToggle>
                          <Button className='w-full h-full px-12 text-black justify-between text-xl'>
                            Envases
                          </Button>
                        </DropdownToggle>
                        <DropdownMenu className='w-52'>
                          {
                            row?.envases.map((envase) => {
                              const envasesList = envases?.find(envaseList => envaseList.id == envase.envase)
                              return (
                                <DropdownItem icon='HeroFolderOpen'>{envasesList?.nombre}</DropdownItem>
                              )
                            })
                          }

                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>

                    <TableCell sx={{ zIndex: 1, maxWidth: 200, minWidth: 200, background: `${isDarkTheme ? '#27272A' : '#F4F4F5'}`, borderRight: '4px solid white', paddingY: 1 }}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        {
                          [...new Set(row?.envases.map(envase => envase.variedad))].map(variedadId => {
                            const variedad_nombre = variedadFilter.find(variedad => variedad.value === variedadId)?.label;
                            console.log(variedad_nombre)
                            return (
                              <span key={variedadId} className='text-xl'>{variedad_nombre}</span>
                            );
                          })
                        }
                      </div>
                    </TableCell>

                    <TableCell component="th" scope="row" sx={{ maxWidth: 200, minWidth: 200, background: `${isDarkTheme ? '#27272A' : '#F4F4F5'}`, borderRight: '4px solid white', paddingY: 1 }}>
                      <div className=' h-full w-full flex items-center justify-center'>
                        {
                          [...new Set(row?.envases.map(envase => envase.tipo_producto))].map(tipoProductoId => {
                            const tipoProductoNombre = tipoFrutaFilter.find(producto => producto.value === tipoProductoId)?.label;
                            return (
                              <span key={tipoProductoId} className='text-xl'>{tipoProductoNombre}</span>
                            );
                          })
                        }
                      </div>
                    </TableCell>

                    {
                      data?.mezcla_variedades
                        ? (
                          <TableCell sx={{ maxWidth: 100, minWidth: 100, background: `${isDarkTheme ? '#27272A' : '#F4F4F5'}`, borderRight: '4px solid white', paddingY: 1 }}>
                            <div className='flex justify-around flex-wrap gap-2'>
                              <div

                                className='w-4/12 bg-[#3B82F6] hover:bg-[#3b83f6cd] text-white flex items-center justify-center rounded-md p-1 cursor-pointer hover:scale-105'>
                                <HeroEye style={{ fontSize: 25 }} />
                              </div>
                              <div

                                className='w-4/12 bg-[#3B82F6] hover:bg-[#3b83f6cd] text-white flex items-center justify-center rounded-md p-1 cursor-pointer hover:scale-105'>
                                <HeroPencilSquare style={{ fontSize: 25 }} />
                              </div>
                            </div>
                          </TableCell>
                        )
                        : null
                    }
                    <TableCell sx={{ maxWidth: 100, minWidth: 100, paddingY: 1, background: `${isDarkTheme ? '#27272A' : '#F4F4F5'}` }}>
                      <div className='w-full flex items-center justify-center rounded-md'>
                        <button className=' bg-gray-300 px-6 py-3 text-black font-semibold'>
                          Iniciar Inspección Visual
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>

                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </div >
  );
};

export default FooterDetalleGuia;
