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
import Button from '../../../components/ui/Button';
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
import { TOperarios } from '../../../types/registros types/registros.types';
import ModalRegistro from '../../../components/ModalRegistro';
import FormularioRegistroOperario from '../Formularios Registro/FormularioRegistroOperario';




const columnHelper = createColumnHelper<TOperarios>();

const editLinkProductor = `/app/productor/`
const createLinkProductor = `/app/registro-productor/`

const columns = [
  columnHelper.accessor('rut', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`} className='w-full bg-white'>
        <div className='font-bold w-20'>{`${info.row.original.rut}`}</div>
      </Link>
    ),
    header: 'Rut '
  }),
  columnHelper.accessor('nombre', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`}>
        <div className='font-bold '>{`${info.row.original.nombre}`}</div>
      </Link>
    ),
    header: 'Nombre',
  }),
  columnHelper.accessor('apellido', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`}>
        <div className='font-bold truncate'>{`${info.row.original.apellido}`}</div>
      </Link>
    ),
    header: 'Apellido',
  }),
  columnHelper.accessor('tipo_operario', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`}>
        <div className='font-bold'>{`${info.row.original.tipo_operario}`}</div>
      </Link>
    ),
    header: 'Tipo Operario',
  }),
  columnHelper.accessor('activo', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`}>
        <div className='font-bold'>{`${info.row.original.activo ? 'Si' : 'No'}`}</div>
      </Link>
    ),
    header: 'Estado',
  }),
  columnHelper.accessor('etiquetas', {
    cell: (info) => (
      <Link to={`${editLinkProductor}${info.row.original.id}`}>
        <div className='font-bold'>{`${info.row.original.etiquetas}`}</div>
      </Link>
    ),
    header: 'Etiqueta',
  }),

];

interface IOperarioProps {
  data: TOperarios[] | []
  refresh: Dispatch<SetStateAction<boolean>>
}


const TablaOperarios : FC<IOperarioProps> = ({ data, refresh }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false)



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
              placeholder='Busca al operario...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </SubheaderLeft>
        <SubheaderRight>
          <ModalRegistro
                open={modalStatus} 
                setOpen={setModalStatus} 
                title='Registro Operario'
                textButton='Agregar Operario'
                size={900}
                >
						<FormularioRegistroOperario refresh={refresh} setOpen={setModalStatus}/>
					</ModalRegistro>
        </SubheaderRight>
      </Subheader>
      <Container>
        <Card className='h-full'>
          <CardHeader>
            <CardHeaderChild>
              <CardTitle>Operarios</CardTitle>
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

export default TablaOperarios;
