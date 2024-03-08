import React, { useEffect, useState } from 'react';
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
import Button from '../../../components/ui/Button';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import TableTemplate, {
  TableCardFooterTemplate,
} from '../../../templates/common/TableParts.template';
import Badge from '../../../components/ui/Badge';
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownNavLinkItem,
  DropdownToggle,
} from '../../../components/ui/Dropdown';
import Subheader, {
  SubheaderLeft,
  SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../components/form/FieldWrap';
import { format } from "@formkit/tempo"


interface IComercializador {
  id: number,
  nombre: string,
  razon_social: string,
  giro: string,
  direccion: string,
  zip_code: string,
  email_comercializador: string
}


const columnHelper = createColumnHelper<IComercializador>();

const editLinkProductor = `/app/productor/`
const createLinkProductor = `/app/registro-productor/`

const columns = [
  columnHelper.accessor('nombre', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`} className='w-full bg-white'>
        <div className='font-bold w-20'>{`${info.row.original.nombre}`}</div>
      </Link>
    ),
    header: 'Rut Productor'
  }),
  columnHelper.accessor('nombre', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`}>
        <div className='font-bold '>{`${info.row.original.nombre}`}</div>
      </Link>
    ),
    header: 'Nombre',
  }),
  columnHelper.accessor('razon_social', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`}>
        <div className='font-bold truncate'>{`${info.row.original.razon_social}`}</div>
      </Link>
    ),
    header: 'Razón Social',
  }),
  columnHelper.accessor('giro', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`}>
        <div className='font-bold'>{`${info.row.original.giro}`}</div>
      </Link>
    ),
    header: 'Giro',
  }),
  columnHelper.accessor('email_comercializador', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`}>
        <div className='font-bold'>{`${info.row.original.email_comercializador}`}</div>
      </Link>
    ),
    header: 'Email',
  }),
  columnHelper.accessor('direccion', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`}>
        <div className='font-bold'>{`${info.row.original.direccion}`}</div>
      </Link>
    ),
    header: 'Dirección',
  }),

];


const TablaComercializadores = ({ data }: { data: IComercializador[] | [] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')


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
    <PageWrapper name='ListaProductores'>
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
              placeholder='Busca al productor...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </SubheaderLeft>
        <SubheaderRight>
          <Link to={`${createLinkProductor}`}>
            <Button variant='solid' icon='HeroPlus'>
              Agregar Productores
            </Button>
          </Link>
        </SubheaderRight>
      </Subheader>
      <Container>
        <Card className='h-full'>
          <CardHeader>
            <CardHeaderChild>
              <CardTitle>Productores</CardTitle>
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
