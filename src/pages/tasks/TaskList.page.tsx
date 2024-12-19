import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Card, { CardBody, CardFooter, } from '../../components/ui/Card'
import TableTemplate, { TableCardFooterTemplate } from '../../templates/common/TableParts.template'
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper'
import Subheader, { SubheaderLeft, SubheaderRight } from '../../components/layouts/Subheader/Subheader'
import FieldWrap from '../../components/form/FieldWrap'
import Icon from '../../components/icon/Icon'
import Input from '../../components/form/Input'
import Button from '../../components/ui/Button'
import Container from '../../components/layouts/Container/Container'
import Dropdown, { DropdownMenu, DropdownToggle } from '../../components/ui/Dropdown'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import {format} from '@formkit/tempo'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { RootState } from 'src/store/rootReducer'

const TaskPage = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const { tasks } = useAppSelector((state: RootState) => state.task)


  const columnHelper = createColumnHelper<Task>();
  
  const columns = [
    columnHelper.accessor('title', {
      cell: (info) => (
        <Link to={`/prospect/${info.row.original.id}`}>
          <span >{info.row.original.title}</span>
        </Link>
      ),
      header: 'Nombre',
    }),
    columnHelper.accessor('tags', {
      cell: (info) => (
        <div>
          <span >{info.row.original.tags}</span>
        </div>
      ),
      header: 'Tags',
    }),

    columnHelper.accessor('status', {
      cell: (info) => (
        <div>
          <span >{info.row.original.status}</span>
        </div>
      ),
      header: 'Estado',
    }),
    columnHelper.accessor('createdAt', {
      cell: (info) => (
        <div>
          <span >{format(info.row.original.createdAt!, { date: 'full' }, 'es' )}</span>
        </div>
      ),
      header: 'Fecha Creación',
    })
    // columnHelper.accessor('phoneNumber', {
    //   cell: (info) => (
    //     <div>
    //       <span >{info.row.original.phoneNumber}</span>
    //     </div>
    //   ),
    //   header: 'N° Teléfono',
    // }),
    // columnHelper.accessor('source', {
    //   cell: (info) => (
    //     <div>
    //       <span >{info.row.original.source ? info.row.original.source : 'No se sabe donde salio'}</span>
    //     </div>
    //   ),
    //   header: 'Fuente',
    // }),

  ]
  

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      rowSelection,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    
  });

  return (
  <PageWrapper title='Tareas'>
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
            id='prospects'
            name='prospects'
            placeholder='Prospectos...'
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </FieldWrap>
        {/* <Button 
          variant={showFilters ? 'solid' : 'outline'} 
          icon='HeroFilter'
          onClick={() => setSHowFilters(!showFilters)}
          >
          Filtros
        </Button> */}
      </SubheaderLeft>
      {/* <SubheaderRight>
        <Dropdown>
          <DropdownToggle>
            <Button variant='solid'>Acciones</Button>
          </DropdownToggle>
          <DropdownMenu>
            <div className='flex flex-col w-full h-full gap-5' >
              <Button 
                variant='solid' 
                className='w-full' 
                icon='HeroPlus'
                onClick={() => setOpenModalProspect(true)}
                >
                Agregar Prospecto
              </Button>
              
              <Button 
                variant='solid' 
                icon='HeroPlus'
                onClick={() => setOpenModalMassiveProspect(true)}
                >
                Agregar Prospectos Masivos
              </Button>
            </div>
          </DropdownMenu>
        </Dropdown>
      </SubheaderRight> */}
    </Subheader>
    <Container>
      <Card>
        <CardBody className={`overflow-auto`}>
          <TableTemplate 
            className='table-fixed max-md:min-w-[70rem]' 
            table={table}
            hasFooter={false} 
          />
        </CardBody>
        <CardFooter>
          <TableCardFooterTemplate table={table} />
        </CardFooter>
      </Card>
    </Container>
  </PageWrapper>
  )
}

export default TaskPage
