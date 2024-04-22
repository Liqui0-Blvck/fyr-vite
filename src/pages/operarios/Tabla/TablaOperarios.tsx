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
import ModalRegistro from '../../../components/ModalForm.modal';
import FormularioRegistroOperario from '../Formularios Registro/FormularioRegistroOperario';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { Tooltip } from 'antd';
import useDarkMode from '../../../hooks/useDarkMode';
import FormularioEdicionOperario from '../Formulario Edicion/FormularioEdicionOperario';
import DetalleOperario from '../Detalle/Detalle';
import { useAuth } from '../../../context/authContext';
import toast from 'react-hot-toast';




const columnHelper = createColumnHelper<TOperarios>();


interface IOperarioProps {
  data: TOperarios[] | []
  refresh: Dispatch<SetStateAction<boolean>>
}


const TablaOperarios: FC<IOperarioProps> = ({ data, refresh }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [modalStatus, setModalStatus] = useState<boolean>(false)
  const { isDarkTheme } = useDarkMode();
  const { authTokens, validate, perfilData } = useAuth()


  const asisteDelete = async (id: number) => {
    const base_url = process.env.VITE_BASE_URL_DEV
    const response = await fetch(`${base_url}/api/registros/operarios/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authTokens?.access}`
      }
    })
    if (response.ok) {
      refresh(true)
      toast.success('Se ha eliminado correctamente el operario')
    } else {
      toast.error('No se ha logrado eliminar el operario')
    }
  }



  const columns = [
    columnHelper.accessor('rut', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.rut}`}
        </div>
      ),
      header: 'Rut '
    }),
    columnHelper.accessor('nombre', {
      cell: (info) => (
        <div className='font-bold '>
          {`${info.row.original.nombre}`}
        </div>
      ),
      header: 'Nombre',
    }),
    columnHelper.accessor('apellido', {
      cell: (info) => (
        <div className='font-bold truncate'>
          {`${info.row.original.apellido}`}
        </div>
      ),
      header: 'Apellido',
    }),
    columnHelper.accessor('tipo_operario', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.tipo_operario}`}
        </div>
      ),
      header: 'Tipo Operario',
    }),
    columnHelper.accessor('activo', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.activo ? 'Si' : 'No'}`}
        </div>
      ),
      header: 'Estado',
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
              title='Detalle Operario'
              size={900}

              width={`w-24 px-1 h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
              icon={<HeroEye style={{ fontSize: 25 }} />}
            >
              <DetalleOperario id={id} />
            </ModalRegistro>

            <ModalRegistro
              open={edicionModalStatus}
              setOpen={setEdicionModalStatus}
              title='Edición Operario'
              textTool='Editar'
              size={900}
              width={`w-24 px-1 h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
              icon={<HeroPencilSquare style={{ fontSize: 25 }}
              />}
            >
              <FormularioEdicionOperario refresh={refresh} setOpen={setEdicionModalStatus} id={id} />
            </ModalRegistro>

            <Tooltip title='Eliminar'>
              <button onClick={async () => await asisteDelete(id)} type='button' className={`w-24 px-1 h-12 bg-red-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
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
    <PageWrapper name='Lista Operarios'>
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
            width={`w-full h-11 md:w-full px-2 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
          >
            <FormularioRegistroOperario refresh={refresh} setOpen={setModalStatus} />
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
