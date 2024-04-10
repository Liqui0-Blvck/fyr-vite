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
import { TOperarios, TPatioTechadoEx } from '../../../types/registros types/registros.types';
import ModalRegistro from '../../../components/ModalRegistro';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import useDarkMode from '../../../hooks/useDarkMode';
import { variedadFilter } from '../../../constants/options.constants';
import Tooltip from '../../../components/ui/Tooltip';


const columnHelper = createColumnHelper<TPatioTechadoEx>();


interface IOperarioProps {
  data: TPatioTechadoEx[] | []
  refresh: Dispatch<SetStateAction<boolean>>
}


const TablaBodega: FC<IOperarioProps> = ({ data, refresh }) => {
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
    } else {
      console.log("nop no lo logre")
    }
  }



  const columns = [
    columnHelper.accessor('envases', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.envases.length}`}
        </div>
      ),
      header: 'Cantidad Envases'
    }),
    columnHelper.accessor('variedad', {
      cell: (info) => (
        <div className='font-bold '>
          {`
            ${info.row.original.variedad
                ? variedadFilter.find(variety => variety.value === info.row.original.variedad)?.label
                : 'Pendiente Ubicacion'
              }`
          }
        </div>
      ),
      header: 'Variedad',
    }),
    columnHelper.accessor('estado_lote', {
      cell: (info) => (
        <div className='font-bold truncate'>
          {`${info.row.original.estado_lote_label}`}
        </div>
      ),
      header: 'Estado Lote',
    }),
    columnHelper.accessor('procesado', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.procesado ? '100% completado' : 'No se ha completado al 100%'}`}
        </div>
      ),
      header: 'Procesado',
    }),
    columnHelper.accessor('ubicacion', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.ubicacion_label}`}
        </div>
      ),
      header: 'Ubicación',
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const id = info.row.original.id;
        const [detalleModalStatus, setDetalleModalStatus] = useState(false);
        const [edicionModalStatus, setEdicionModalStatus] = useState(false);

        return (
          <div className='h-full w-full flex items-center justify-center gap-2'>

            <Tooltip text='Detalle Guía Bodega'>
              <Link to={`/app/bodega/${id}`}>
                <button className={`w-24 px-1 h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
                  <HeroEye style={{ fontSize: 25 }} />
                </button>
              </Link>
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
    <PageWrapper name='Lista Guia Patio'>
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
              placeholder='Busca una guía...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </SubheaderLeft>
      </Subheader>
      <Container>
        <Card className='h-full'>
          <CardHeader>
            <CardHeaderChild>
              <CardTitle>Guía Patio</CardTitle>
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

export default TablaBodega;
