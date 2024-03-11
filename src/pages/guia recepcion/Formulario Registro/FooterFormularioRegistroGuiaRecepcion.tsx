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
  import { TEnvases, TGuia } from '../../../types/registros types/registros.types';
  import { TIPO_PRODUCTOS_RECEPCIONMP, VARIEDADES_MP } from '../../../constants/select.constanst';

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
    id_guia: number,
    variedades: boolean
  }

  const FooterFormularioRegistro: FC<IFooterProps> = ({ id_guia, variedades }) => {
    const { authTokens, validate, userID } = useAuth()
    const { isDarkTheme } = useDarkMode();
    const base_url = process.env.VITE_BASE_URL_DEV
    const initialRows = [
      {
        envase: null,
        variedad: null,
        tipo_producto: null,
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
        const formData = new FormData();

        // Agregar los campos principales
        formData.append('kilos_brutos_1', values.kilos_brutos_1);
        formData.append('kilos_brutos_2', values.kilos_brutos_2);
        formData.append('kilos_tara_1', values.kilos_tara_1);
        formData.append('kilos_tara_2', values.kilos_tara_2);
        formData.append('estado_recepcion', '1');
        formData.append('numero_lote', '1')
        formData.append('guiarecepcion', id_guia);
        formData.append('creado_por', userID?.user_id);

        // Mapear los datos de las filas y agregarlos como parte del cuerpo de la solicitud
        const envasesData = rows.map((row) => ({
          id: row.id,
          envase: row.envase,
          variedad: row.variedad,
          tipo_producto: row.tipo_producto,
          cantidad_envases: row.cantidad_envases
        }));
        formData.append('envases', JSON.stringify(envasesData));
        

        try {
          const res = await fetch(`${base_url}/api/recepcionmp/${id_guia}/lotes/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authTokens?.access}`
            },
            body: formData
          })
          if (res.ok) {
            const data = await res.json()
            toast.success("la guia de recepción fue registrado exitosamente!!")


          } else {
            toast.error("No se pudo registrar la guia de recepción volver a intentar")
          }
        } catch (error) {
          console.log(error)
        }
      }
    })


    const agregarFila = () => {
      const nuevaFila = { id: rows.length, envase: null, variedad: null, tipo_producto: null, cantidad_envases: null};
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


    const envasesList = envases?.map((envase: TEnvases ) => ({
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

    const optionEnvases: TSelectOptions | [] = envasesList
    const optionsVariedad: TSelectOptions | [] = variedadFilter
    const optionsTipoFruta: TSelectOptions | [] = tipoFrutaFilter

    console.log(formik.values)

    return (
      <div >
        <form
          onSubmit={formik.handleSubmit}
          className='relative'>
          <TableContainer sx={{ height: 450, overflow: 'hidden', overflowX: 'auto'}}>
            <Table sx={{ minWidth: 750, background: `${isDarkTheme ? '#09090B' : 'white'}` }} aria-label="simple table">
              <TableHead >
                <TableRow>
                  <TableCell align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Kilos Brutos</TableCell>
                  <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Kilos Brutos Acoplado</TableCell>
                  <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Envase</TableCell>
                  <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Cantidad Envases</TableCell>
                  <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Variedad</TableCell>
                  <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Producto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows && rows.map((row, index) => {
                  console.log(row)
                  return (
                    <TableRow key={index} style={{ background: `${isDarkTheme ? '#09090B' : 'white'}`, position: 'relative'}}>
                    <TableCell component="th" scope="row" sx={{ maxWidth: 120, minWidth: 120}}>
                    <Input
                        type='number'
                        name='kilos_brutos_1'
                        onChange={formik.handleChange}
                        className='py-3'
                        value={formik.values.kilos_brutos_1!}
                      />
                      
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ maxWidth: 120, minWidth: 120}}>
                      <Input
                          type='number'
                          name='kilos_brutos_2'

                          onChange={formik.handleChange}
                          className='py-3 '
                          value={formik.values.kilos_brutos_2!}
                        />
                    </TableCell>
                    <TableCell style={{ zIndex: 1, maxWidth: 150, minWidth: 150 }}>
                      <SelectReact
                        options={optionEnvases}
                        id='camion'
                        name='camion'
                        placeholder='Selecciona un envase'
                        className='h-14 w-full absolute z-40'
                        onChange={(value: any) => {
                          handleChangeRow(row.id, 'envase', value.value)
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ maxWidth: 120, minWidth: 120}}>
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
                        id='camion'
                        name='camion'
                        placeholder='Selecciona una variedad'
                        className='h-14 '
                        onChange={(value: any) => {
                          handleChangeRow(row.id, 'tipo_producto', value.value)
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          {
            variedades
              ? (
                <div
                  onClick={agregarFila}
                  className='absolute top-40 left-20 
                    right-0 w-32 mx-auto'>
                  <FaCirclePlus className='text-3xl' />
                </div>
                )
              : null
          }

          <button type='submit' className='absolute px-4 py-2 right-0 top-[400px] bg-[#2732FF] rounded-md text-white'>
            Crear Orden de Compra
          </button>
        </form>
      </div>
    );
  };

  export default FooterFormularioRegistro;
