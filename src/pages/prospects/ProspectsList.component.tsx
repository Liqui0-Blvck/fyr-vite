import React, { useMemo, useState } from 'react'
import {
  Column,
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { TProspect } from '../../types/app/Prospect.type'
import Table from '../../components/ui/Table'
import Card, { CardBody } from '../../components/ui/Card'
import TableTemplate from '../../templates/common/TableParts.template'
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper'
import Subheader, { SubheaderLeft, SubheaderRight } from '../../components/layouts/Subheader/Subheader'
import FieldWrap from '../../components/form/FieldWrap'
import Icon from '../../components/icon/Icon'
import Input from '../../components/form/Input'
import Button from '../../components/ui/Button'
import Container from '../../components/layouts/Container/Container'
import Dropdown, { DropdownMenu, DropdownToggle } from '../../components/ui/Dropdown'
import Modal, { ModalBody, ModalHeader } from '../../components/ui/Modal'

const prospects: TProspect[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    age: 32,
    visits: 10,
    status: 'active',
    progress: 50,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    age: 31,
    visits: 20,
    status: 'inactive',
    progress: 70,
  },
  {
    id: '3',
    firstName: 'Jim',
    lastName: 'Doe',
    age: 30,
    visits: 30,
    status: 'active',
    progress: 30,
  },
  {
    id: '4',
    firstName: 'Jill',
    lastName: 'Doe',
    age: 29,
    visits: 40,
    status: 'inactive',
    progress: 90,
  }
]


const ProspectsList = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  // const { prospects } = useAppSelector((state: RootState) => state.prospect)

  const [openModalProspect, setOpenModalProspect] = useState(false)
  const [openModalMassiveProspect, setOpenModalMassiveProspect] = useState(false)




  const columnHelper = createColumnHelper<TProspect>();

  const columns = [

    columnHelper.accessor('firstName', {
      cell: (info) => (
        <div>
          <span>{info.row.original.firstName}</span>
        </div>
      ),
      header: 'First Name',
    }),
    columnHelper.accessor('age', {
      cell: (info) => (
        <div>
          <span>{info.row.original.age}</span>
        </div>
      ),
      header: 'Age',
    }),
    columnHelper.accessor('progress', {
      cell: (info) => (
        <div>
          <span>{info.row.original.progress}</span>
        </div>
      ),
      header: 'Progreso',
    }),
    columnHelper.display({
      cell: (_info) => (
        <div className='flex items-center gap-2'>
          {/* {info.row.original.socialAuth?.google && (
            <Tooltip text='Google'>
              <Icon size='text-xl' icon='CustomGoogle' />
            </Tooltip>
          )}
          {info.row.original.socialAuth?.facebook && (
            <Tooltip text='Facebook'>
              <Icon size='text-xl' icon='CustomFacebook' />
            </Tooltip>
          )}
          {info.row.original.socialAuth?.apple && (
            <Tooltip text='Apple'>
              <Icon size='text-xl' icon='CustomApple' />
            </Tooltip>
          )} */}
        </div>
      ),
      header: 'Acciones',
    }),
  ]


  const table = useReactTable({
    data: prospects,
    columns,
    state: {
      rowSelection,
      globalFilter
    },
    enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true, 
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  })


  return (
    <PageWrapper title='Prospectos'>
      {
        openModalProspect && (
          <Modal
            isOpen={openModalProspect}
            setIsOpen={setOpenModalProspect}
            >
            <ModalHeader>
              <span>Agregar Prospectos</span>
            </ModalHeader>
            <ModalBody>
              <h1>Contenido</h1>
            </ModalBody>
          </Modal>
        )
      }
      {
        openModalMassiveProspect && (
          <div>
            <h1>Modal de Prospectos Masivos</h1>
          </div>
        )
      }
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
				</SubheaderLeft>
				<SubheaderRight>
					{/* <Link to={`new`}>
						<Button variant='solid' icon='HeroPlus'>
							Agregar Prospecto
						</Button>
					</Link> */}

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
				</SubheaderRight>
			</Subheader>
      <Container>
        <Card>
          <CardBody className='overflow-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
        </Card>
      </Container>
    </PageWrapper>
  )
}

export default ProspectsList
