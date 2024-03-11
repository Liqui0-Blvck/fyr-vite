import React, { FC, useState } from 'react';
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
import { Select } from 'antd';
import { useAuth } from '../../../context/authContext';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import useDarkMode from '../../../hooks/useDarkMode';
import { TGuia } from '../../../types/registros types/registros.types';

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
  id_guia: number
}

const FooterFormularioRegistro: FC<IFooterProps> = ({ id_guia }) => {
  const initialRows = [
    {
      kilos_brutos_1: null,
      kilos_brutos_2: null,
      kilos_tara_1: null,
      kilos_tara_2: null,
      estado_recepcion: null,
      guiarecepcion: null,
      creado_por: null
    },
  ]


  const [rows, setRows] = useState(
    initialRows.map((row, index) => ({ ...row, id: index }))
  );

  console.log(rows);
  const { authTokens, validate } = useAuth()
  const base_url = process.env.VITE_BASE_URL_DEV
  const { data: recepcionmp } = useAuthenticatedFetch<TGuia>(
    authTokens,
    validate,
    `/api/recepcionmp/${}`
  )

  console.log(id_guia)
  const { isDarkTheme } = useDarkMode();

  const formik = useFormik({
    initialValues: {
      kilos_brutos_1: null,
      kilos_brutos_2: null,
      kilos_tara_1: null,
      kilos_tara_2: null,
      estado_recepcion: null,
      guiarecepcion: null,
      creado_por: null
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch(`${base_url}/api/recepcionmp/${id_guia}/lotes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...values
          })
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

  // const formik

  // const options = items &&
  //   items.filter(item => !rows.some(rowItem => Number(rowItem.item) === item.id))
  //     .map(item => ({
  //       value: item.id,
  //       label: item.nombre
  //     }))

  // const agregarFila = () => {
  //   const nuevaFila = { id: rows.length, item: '', unidad_de_compra: 0, costo_por_unidad: 0, fecha_llegada: '', observaciones: '' };
  //   setRows((prevRows) => [...prevRows, nuevaFila]);
  // };

  const eliminarFila = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleChangeRow = (id: number, fieldName: string, value: string | number) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [fieldName]: value } : row))
    );
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  const filterOption = (
    input: string,
    option: any,
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())

  return (
    <div className='py-12 px-3'>
      <form className='relative'>
        <div
          className='absolute -bottom-10 left-20 
            right-0 w-32 mx-auto'>
          <FaCirclePlus className='text-3xl' />
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 750, background: `${isDarkTheme ? '#09090B' : 'white'}` }} aria-label="simple table">
            <TableHead >
              <TableRow>
                <TableCell align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Items</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Cantidad</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Costo por Unidad</TableCell>
                <TableCell align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}` }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows && rows.map((row, index) => (
                <TableRow key={index} style={{ background: `${isDarkTheme ? '#09090B' : 'white'}` }}>
                  <TableCell component="th" scope="row">
                    <SelectReact
                      // options={optionsCamion}
                      id='camion'
                      name='camion'
                      placeholder='Selecciona un camión'

                      className='h-14 w-full'
                      onChange={(value: any) => {
                        formik.setFieldValue('camion', value.value)
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Input
                      type='text'
                      name='numero_guia_productor'
                      onChange={formik.handleChange}
                      size={2}
                      className='py-3'
                    // value={formik.values.numero_guia_productor!}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Input
                      type='text'
                      name='numero_guia_productor'
                      onChange={formik.handleChange}
                      className='py-3'
                      size={2}

                    // value={formik.values.numero_guia_productor!}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <button type='button'
                      onClick={() => eliminarFila(row.id)}
                      className='border border-red-800 px-4 py-2 rounded-md 
                        hover:scale-110 hover:bg-red-700 text-red-800 hover:text-white'>
                      Eliminar
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <button type='submit' className='absolute px-4 py-2 right-0 -bottom-20 bg-[#2732FF] rounded-md text-white'>
          Crear Orden de Compra
        </button>
      </form>
    </div>
  );
};

export default FooterFormularioRegistro;
