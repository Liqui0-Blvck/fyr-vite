import React, { useEffect, useState } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { format } from '@formkit/tempo'
import { Interaction } from '../../../types/app/Interaction.type'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store/hook'
import { RootState } from '../../../store/rootReducer'
import { fetchInteractionsProspect } from '../../../store/slices/prospect/prospectSlice'
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper'
import Container from '../../../components/layouts/Container/Container'
import Subheader, { SubheaderLeft, SubheaderRight } from '../../../components/layouts/Subheader/Subheader'
import FieldWrap from '../../../components/form/FieldWrap'
import Icon from '../../../components/icon/Icon'
import Input from '../../../components/form/Input'
import Button from '../../../components/ui/Button'
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../components/ui/Dropdown'
import Card, { CardBody, CardFooter } from '../../../components/ui/Card'
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template'
import { Investment } from '../../../types/app/Inversion.type'
import { investmentRecords } from '../../../mocks/Data'
import Modal, { ModalBody, ModalHeader } from '../../../components/ui/Modal'
import Badge from '../../../components/ui/Badge'
import InvestmentDetail from './InvestmentDetail.component'




const InvestmentList = () => {
  const { user } = useAppSelector((stat : RootState) => stat.auth.user)
  const { id } = useParams<{ id: string }>()
  // const { interactions } = useAppSelector((state: RootState) => state.prospect)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const dispatch = useAppDispatch()
  const [investmentSelected, setInvestmentSelected] = useState<Investment | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isDetailSelected, setIsDetailSelected] = useState<boolean>(false)



  const columnHelper = createColumnHelper<Investment>();
  const columns = [
    columnHelper.accessor('investmentDate', {
      cell: (info) => (
        <Link to={`/prospect/${info.row.original.investmentDate}`}>
          <span >{info.row.original.investmentDate}</span>
        </Link>
      ),
      header: 'Fecha de inversion',
    }),
    columnHelper.accessor('investedAmount', {
      cell: (info) => (
        <div>
          <span >{info.row.original.investedAmount}</span>
        </div>
      ),
      header: 'Monto de inversión',
    }),
    columnHelper.accessor('investmentType', {
      cell: (info) => (
        <div>
          <span >{info.row.original.investmentType}</span>
        </div>
      ),
      header: 'Tipo de inversión',
    }),
    columnHelper.accessor('status', {
      cell: (info) => (
        <div>
          <span >{info.row.original.status}</span>
        </div>
      ),
      header: 'Estado de la inversión',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: (info) => (
       <div className='flex gap-2 flex-wrap'>
        <Button
          variant='outline'
          onClick={() => {
            setInvestmentSelected(info.row.original)
            setOpenModal(true)
          }}
          >
          Resumen  
        </Button>
        
        <Button
          variant='solid'
          onClick={() => {
            setInvestmentSelected(info.row.original)
            setIsDetailSelected(true)
          }}
          >
            Ver Detalle
        </Button>
       </div>
      ),
    })
  ]

  const table = useReactTable({
		data: investmentRecords,
		columns,
		state: {
      globalFilter,
      rowSelection,
		},
		getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
	});

  console.log(isDetailSelected)

  if (isDetailSelected) {
    return (
      <InvestmentDetail onDetail={setIsDetailSelected} investment={investmentSelected}/>
    )
  }

  return (
    <>
    {
      openModal && (
        <Modal
          isOpen={openModal}
          setIsOpen={setOpenModal}
          rounded='rounded-lg'
          size={'sm'}
        >
          <ModalHeader>
            <div className='flex flex-col p-2'>
              <h3>Resumen de la inversión</h3>
              <span className='text-sm text-zinc-600'>Detalles clave de la inversión seleccionada</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <section 
              className='flex flex-col gap-2
               mt-5 rounded-md p-4
               border border-zinc-300 dark:border-zinc-800
               bg-zinc-100 dark:bg-zinc-900
               
               '>

              <div className='mb-3'>
                <h3>{investmentSelected?.investmentType}</h3>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Fecha de Inversión:</span>
                <span>{format(investmentSelected?.investmentDate!, { date: 'full' }, 'es' )}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Monto Invertido:</span>
                <span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(investmentSelected?.investedAmount!)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Estado:</span>
                <Badge 
                  variant={
                    investmentSelected?.status === 'Active' ? 'outline' :
                    investmentSelected?.status === 'Closed' ? 'solid' :
                    'outline'
                  }
                >
                  {investmentSelected?.status}
                </Badge>
              </div>
              {investmentSelected?.expectedReturn && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Retorno Esperado:</span>
                  <span>{investmentSelected.expectedReturn}%</span>
                </div>
              )}
              {investmentSelected?.maturityDate && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Fecha de Vencimiento:</span>
                  <span>{format(investmentSelected.maturityDate, { date: 'full' }, 'es' )}</span>
                </div>
              )}
              {investmentSelected?.comments && (
                <div>
                  <span className="font-semibold">Comentarios:</span>
                  <p className="mt-1">{investmentSelected?.comments}</p>
                </div>
              )}
            </section>
          </ModalBody>

        </Modal>
      )
    }

    <PageWrapper title='Inversiones'>
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
							id='inversions'
							name='inversions'
							placeholder='Inversiones...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
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
    </>
  )
}

export default InvestmentList
