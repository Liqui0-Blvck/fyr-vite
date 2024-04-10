import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import { appPages } from '../../../config/pages.config';
import Card, {
  CardBody,
  CardHeader,
  CardHeaderChild,
  CardTitle,
} from '../../../components/ui/Card';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import TableTemplate, {
  TableCardFooterTemplate,
} from '../../../templates/common/TableParts.template';
import Badge from '../../../components/ui/Badge';

import Subheader, {
  SubheaderLeft,
  SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import { format } from "@formkit/tempo"
import { TComercializador } from '../../../types/registros types/registros.types';
import ModalRegistro from '../../../components/ModalRegistro';
import FormularioRegistroComercializador from '../Formulario Registro/FormularioRegistroComercializador';
import useDarkMode from '../../../hooks/useDarkMode';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { Tooltip } from 'antd';
import FormularioEdicionComercializador from '../Formulario Edicion/FormularioEdicionComercializador';
import DetalleComercializador from '../Detalle/Detalle';
import toast from 'react-hot-toast';



const columnHelper = createColumnHelper<TComercializador>();


interface IFormComercializadorProps {
  data: TComercializador[] | [],
  refresh: Dispatch<SetStateAction<boolean>>
}


const TablaComercializadores: FC<IFormComercializadorProps> = ({ data, refresh }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [modalStatus, setModalStatus] = useState<boolean>(false)
  const { isDarkTheme } = useDarkMode();


  const asisteDelete = async (id: number) => {
    const base_url = process.env.VITE_BASE_URL_DEV
    const response = await fetch(`${base_url}/api/comercializador/${id}/`, {
      method: 'DELETE',
    })
    if (response.ok) {
      refresh(true)
      toast.success('Se ha eliminado correctamente el comercializador')
    } else {
      toast.error('No se ha logrado eliminar el comercializador')
    }
  }

  const editLinkProductor = `/app/comercializador/`
  const createLinkProductor = `/app/registro-comercializador/`

  const columns = [
    columnHelper.accessor('nombre', {
      cell: (info) => (
        <div className='font-bold w-20'>
          {`${info.row.original.nombre}`}
        </div>
      ),
      header: 'Rut Productor'
    }),
    columnHelper.accessor('nombre', {
      cell: (info) => (
        <div className='font-bold '>
          {`${info.row.original.nombre}`}
        </div>
      ),
      header: 'Nombre',
    }),
    columnHelper.accessor('razon_social', {
      cell: (info) => (
        <div className='font-bold truncate'>
          {`${info.row.original.razon_social}`}
        </div>
      ),
      header: 'Razón Social',
    }),
    columnHelper.accessor('giro', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.giro}`}
        </div>
      ),
      header: 'Giro',
    }),
    columnHelper.accessor('email_comercializador', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.email_comercializador}`}
        </div>
      ),
      header: 'Email',
    }),
    columnHelper.accessor('direccion', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.direccion}`}
        </div>
      ),
      header: 'Dirección',
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const id = info.row.original.id;
        const [detalleModalStatus, setDetalleModalStatus] = useState(false);
        const [edicionModalStatus, setEdicionModalStatus] = useState(false);

        return (
          <div className='h-full w-full flex justify-around gap-2'>
            <ModalRegistro
              open={detalleModalStatus}
              setOpen={setDetalleModalStatus}
              textTool='Detalle'
              title='Detalle Comercializador'
              size={900}
              width={`md:w-14 lg:w-14 px-1 md:h-10 lg:h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
              icon={<HeroEye style={{ fontSize: 25 }} />}
            >
              <DetalleComercializador id={id} />
            </ModalRegistro>

            <ModalRegistro
              open={edicionModalStatus}
              setOpen={setEdicionModalStatus}
              title='Edición Comercializador'
              textTool='Editar'
              size={900}
              width={`md:w-14 lg:w-14 px-1 md:h-10 lg:h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
              icon={<HeroPencilSquare style={{ fontSize: 25 }}
              />}
            >
              <FormularioEdicionComercializador refresh={refresh} setOpen={setEdicionModalStatus} id={id} />
            </ModalRegistro>

            <Tooltip title='Eliminar'>
              <button onClick={async () => await asisteDelete(id)} type='button' className={`md:w-14 lg:w-14 px-1 md:h-10 lg:h-12 bg-red-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
                <HeroXMark style={{ fontSize: 25 }} />
              </button>
            </Tooltip>
          </div>
        );
      },
      header: 'Acciones'
    }),

  ];




  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    enableGlobalFilter: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  return (
    <PageWrapper name='Lista Comercializadores'>
      <Subheader>
        <SubheaderLeft>
          <FieldWrap
            firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
            lastSuffix={
              globalFilter && (
                <Icon
                  icon='HeroXMark'
                  color='red'
                  className='mx-2 cursor-pointer'
                  onClick={() => {
                    setGlobalFilter('');
                  }}
                />
              )
            }>
            <Input
              id='search'
              name='search'
              placeholder='Busca al comercializador ...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </SubheaderLeft>
        <SubheaderRight>
          <ModalRegistro
            open={modalStatus}
            setOpen={setModalStatus}
            title='Registro Comercializador'
            textButton='Agregar Comercializador'
            width={`px-6 py-3 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
            size={900}
          >
            <FormularioRegistroComercializador refresh={refresh} setOpen={setModalStatus} />
          </ModalRegistro>
        </SubheaderRight>
      </Subheader>
      <Container>
        <Card className='h-full'>
          <CardHeader>
            <CardHeaderChild>
              <CardTitle>Comercializador</CardTitle>
              <Badge
                variant='outline'
                className='border-transparent px-4'
                rounded='rounded-full'>
                {table.getFilteredRowModel().rows.length} registros
              </Badge>
            </CardHeaderChild>
            <CardHeaderChild>
            </CardHeaderChild>
          </CardHeader>
          <CardBody className='overflow-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
          </CardBody>
          <TableCardFooterTemplate table={table} />
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default TablaComercializadores;
