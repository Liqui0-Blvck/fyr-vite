import { FC, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Input from '../../../components/form/Input'
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact'
import { FaCirclePlus } from "react-icons/fa6";
import { useAuth } from '../../../context/authContext';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import useDarkMode from '../../../hooks/useDarkMode';
import { TCamion, TEnvases, TGuia } from '../../../types/registros types/registros.types';
import { TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../constants/select.constanst';
import { useNavigate } from 'react-router-dom';
import { Switch } from 'antd';
import { generarNumeroLote } from '../../../utils/numberLote';



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
  variedad: boolean
}

const FooterFormularioRegistro: FC<IFooterProps> = ({ data, variedad }) => {
  const { authTokens, validate } = useAuth()
  const { isDarkTheme } = useDarkMode();
  const base_url = process.env.VITE_BASE_URL_DEV
  const navigate = useNavigate()
  const [iotBruto, setIotBruto] = useState<boolean>(false)
  const [iotBrutoAcoplado, setIotBrutoAcoplado] = useState<boolean>(false)

  const initialRows = [
    {
      id: 1,
      kilos_brutos_1: 0,
      kilos_brutos_2: 0,
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

      const lotesData = [{
        numero_lote: 0,
        kilos_brutos_1: values.kilos_brutos_1,
        kilos_brutos_2: values.kilos_brutos_2,
        kilos_tara_1: 0,
        kilos_tara_2: 0,
        estado_recepcion: '1',
        guiarecepcion: data.id,
        creado_por: data.creado_por,
      }]
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

  const numeroLote: string = generarNumeroLote();

  console.log(numeroLote)


  const agregarFila = () => {
    const nuevaFila = { id: rows.length, kilos_brutos_1: 0, kilos_brutos_2: 0, envase: null, variedad: null, tipo_producto: '1', cantidad_envases: null };
    setRows((prevRows) => [...prevRows, nuevaFila]);
  };

  const eliminarFila = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleChangeRow = (id: number, fieldName: string, value: string | number) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [fieldName]: value } : row))
    );
  };

  const envasesList = (rows.length < 1) ?
    envases?.map(envase => ({
      value: String(envase.id),
      label: envase.nombre
    })) ?? []:
    envases?.filter(envase => 
      !rows.some(row => row.envase === String(envase.id)))
    .map((envase) => ({
      value: String(envase.id),
      label: envase.nombre
    })) ?? []

  const variedadFilter = (rows.length <= 1) ?
    VARIEDADES_MP.map(variedad => ({
      value: String(variedad.value),
      label: variedad.label
    })) ?? [] :
    VARIEDADES_MP.filter(variedad =>
      rows.some(row => row.variedad === variedad.value)
    ).map(variedad => ({
      value: String(variedad.value),
      label: variedad.label
    })) ?? []
  

  const tipoFrutaFilter = TIPO_PRODUCTOS_RECEPCIONMP?.map((producto) => ({
    value: String(producto.value),
    label: producto.label
  })) ?? []

  const optionEnvases: TSelectOptions | [] = envasesList
  const optionsVariedad: TSelectOptions | [] = variedadFilter
  const optionsTipoFruta: TSelectOptions | [] = tipoFrutaFilter
  const camionAcoplado = camiones?.find(camion => camion.id === Number(data.camion))?.acoplado

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className='relative flex flex-col'>
        <div className='w-full mb-5 flex px-5 justify-between'>
          <div className={`grid grid-cols-4 gap-2 items-center justify-center ${camionAcoplado ? 'w-full' : 'w-[90%]'}`}>
            <label
              htmlFor="kilos_brutos_1"
              className='col-span-3'
            >Kilos Brutos</label>
            <Input
              type='number'
              name='kilos_brutos_1'
              className='py-3 row-start-2 col-span-3 w-56'
              value={formik.values.kilos_brutos_1}
              onChange={formik.handleChange}
              disabled={iotBruto ? true : false}
            />
            <Switch
              className='row-start-2 col-start-4 w-16 bg-slate-300'
              onChange={() => setIotBruto(prev => !prev)} />
          </div>

          {
            camionAcoplado
              ? (
                <div className='grid grid-cols-4 gap-2 items-center justify-center w-full'>
                  <label
                    htmlFor="kilos_brutos_2"
                    className='col-span-3'
                  >Kilos Brutos Acoplado</label>
                  <Input
                    type='number'
                    name='kilos_brutos_2'
                    className='py-3 row-start-2 col-span-3 w-56'
                    value={formik.values.kilos_brutos_2}
                    onChange={formik.handleChange}
                    disabled={iotBrutoAcoplado ? true : false}

                  />
                  <Switch
                    className='row-start-2 col-start-4 w-16 bg-slate-300'
                    onChange={() => setIotBrutoAcoplado(prev => !prev)} />
                </div>
              )
              : null
          }
        </div>
        <TableContainer sx={{ height: 350, overflow: 'hidden', overflowY: 'auto', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 750, background: `${isDarkTheme ? '#09090B' : 'white'}` }} aria-label="simple table">
            <TableHead >
              <TableRow>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Envase</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Cantidad Envases</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Variedad</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Producto</TableCell>
                {variedad ? <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Acciones</TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.map((row, index) => {
                return (
                  <TableRow key={index} style={{ background: `${isDarkTheme ? '#09090B' : 'white'}`, position: 'relative' }}>

                    <TableCell style={{ zIndex: 1, maxWidth: 150, minWidth: 150 }}>
                      <SelectReact
                        options={optionEnvases}
                        id='camion'
                        name='camion'
                        placeholder='Selecciona un envase'
                        className='h-14 w-full absolute'
                        onChange={(value: any) => {
                          handleChangeRow(row.id, 'envase', value.value)
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ maxWidth: 120, minWidth: 120 }}>
                      <Input
                        type='number'
                        name='kilos_brutos_2'
                        className='py-3 '
                        value={row.cantidad_envases!}
                        onChange={(e: any) => {
                          handleChangeRow(row.id, 'cantidad_envases', e.target.value)
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ zIndex: 1, maxWidth: 150, minWidth: 150 }}>
                      <SelectReact
                        options={optionsVariedad}
                        id='camion'
                        name='camion'
                        placeholder='Selecciona una variedad'
                        className='h-14 '
                        onChange={(value: any) => {
                          handleChangeRow(row.id, 'variedad', value.value)
                        }}
                      />

                    </TableCell>

                    <TableCell style={{ zIndex: 1, maxWidth: 150, minWidth: 150 }}>
                      <SelectReact
                        options={optionsTipoFruta}
                        id='tipo_producto'
                        name='tipo_producto'
                        placeholder='Selecciona una variedad'
                        value={optionsTipoFruta.find(option => option?.value === '1')}
                        className='h-14'
                        onChange={(value: any) => {
                          handleChangeRow(row.id, 'tipo_producto', value.value)
                        }}
                      />
                    </TableCell>

                    {
                      variedad
                        ? (
                          <TableCell align="right">
                            <button type='button'
                              onClick={() => eliminarFila(row.id)}
                              className='border border-red-800 px-4 py-2 rounded-md 
                                  hover:scale-110 hover:bg-red-700 text-red-800 hover:text-white'>
                              Eliminar
                            </button>
                          </TableCell>
                        )
                        : null
                    }
                  </TableRow>

                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {
          variedad
            ? (
              <div
                onClick={agregarFila}
                className='relative top-4 left-10 md:left-0 lg:left-0 
                    right-0 w-32 mx-auto'>
                <FaCirclePlus className='text-3xl' />
              </div>
            )
            : null
        }

        <div className='flex bg-gray-300 w-full flex-row-reverse mt-12 md:mt-10 lg:mt-10'>
          <button
            type='submit'
            className='lg:relative lg:px-6 lg:py-4 lg:right-5 lg:bottom-0 lg:top-0
              md:relative md:px-6 md:py-4 md:right-5 md:bottom-0 md:top-0
              px-6 py-4 w-full
              bg-[#2732FF] rounded-md text-white'>
            Registrar Guia de Recepción
          </button>
        </div>
      </form>
    </div>
  );
};

export default FooterFormularioRegistro;
