import React, { useEffect, useState } from 'react'
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
import { RootState } from '../../store/rootReducer'
import { motion, AnimatePresence } from 'framer-motion'
import FilterCard from './ClientFilter.filters'

import {format} from '@formkit/tempo'
import { Link, useNavigate } from 'react-router-dom'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { firestoreService } from '../../config/firebase.config'
import { fetchClients } from '../../store/slices/clients/clientSlice'
import { Client } from '../../types/app/Client.type'


const ClientsList = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const { clients } = useAppSelector((state: RootState) => state.client)
  const navigation = useNavigate()
  const [filters, setFilters] = useState({
    estado: '',
    fuente: '',
    fechaCreacion: '',
    fechaUltimaInteraccion: '',
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    // Actualizamos el estado con los nuevos filtros
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const dispatch = useAppDispatch()

  const [pageIndex, setPageIndex] = useState(0); // Estado para manejar la página actual
  const pageSize = 1000; // Número de registros por página

  // Llamada inicial para cargar los leads cuando cambia el filtro o la página
  useEffect(() => {
    dispatch(fetchClients({
      search: globalFilter,
      pageSize: pageSize,
      append: false, // No acumulamos registros, siempre reemplazamos
      filters: filters,
      pageIndex: pageIndex,
    }));
  }, [filters, globalFilter, pageIndex]);


  useEffect(() => {
    // Suscripción en tiempo real
    const clientRef = collection(firestoreService, 'clients');
    const q = query(clientRef, orderBy('clients'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newClient = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Disparar acción para actualizar el estado con los nuevos leads
      dispatch({
        type: 'clients/setClients',
        payload: newClient,
      });
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => {
      unsubscribe(); // Desuscribirse para evitar fugas de memoria
    };
  }, [dispatch]);


  const [openModalProspect, setOpenModalProspect] = useState<boolean>(false)
  const [openModalMassiveProspect, setOpenModalMassiveProspect] = useState<boolean>(false)

  const [showFilters, setSHowFilters] = useState<boolean>(false)


  const columnHelper = createColumnHelper<Client>();
  const columns = [
    columnHelper.accessor('name', {
      cell: (info) => (
        <Link to={`/prospect/${info.row.original.id}`}>
          <span >{info.row.original.name}</span>
        </Link>
      ),
      header: 'Nombre',
    }),
    columnHelper.accessor('email', {
      cell: (info) => (
        <div>
          <span >{info.row.original.email}</span>
        </div>
      ),
      header: 'Correo',
    }),

    columnHelper.accessor('status', {
      cell: (info) => (
        <div>
          <span >{info.row.original.status}</span>
        </div>
      ),
      header: 'Estado',
    }),
    columnHelper.accessor('phoneNumber', {
      cell: (info) => (
        <div>
          <span >{info.row.original.phoneNumber}</span>
        </div>
      ),
      header: 'N° Teléfono',
    }),
    columnHelper.accessor('source', {
      cell: (info) => (
        <div>
          <span >{info.row.original.source ? info.row.original.source : 'No se sabe donde salio'}</span>
        </div>
      ),
      header: 'Fuente',
    }),
    columnHelper.accessor('creationDate', {
      cell: (info) => (
        <div>
          <span >{format(info.row.original.creationDate!, { date: 'full' }, 'es' )}</span>
        </div>
      ),
      header: 'Fecha Creación',
    })
  ]


  const table = useReactTable({
    data: clients,
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
    <PageWrapper title='Prospectos'>
      {/* {
        openModalProspect && (
          <Modal
            isOpen={openModalProspect}
            setIsOpen={setOpenModalProspect}
            >
            <ModalHeader>
              <span>Agregar Prospectos</span>
            </ModalHeader>
            <ModalBody>
              <ProspectForm isOpen={setOpenModalProspect} />
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
      } */}
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
          <Button 
            variant={showFilters ? 'solid' : 'outline'} 
            icon='HeroFilter'
            onClick={() => setSHowFilters(!showFilters)}
            >
            Filtros
          </Button>
				</SubheaderLeft>
				<SubheaderRight>
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
      <Container className={`${showFilters ? 'flex gap-4 ' : ''}`}>
        <AnimatePresence>
          {showFilters && (
            <FilterCard onFilter={handleFilterChange}/>
          )}
        </AnimatePresence>

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

export default ClientsList
