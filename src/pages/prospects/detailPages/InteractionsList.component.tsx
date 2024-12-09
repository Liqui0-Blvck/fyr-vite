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

const InteractionsList = () => {
  const { user } = useAppSelector((stat : RootState) => stat.auth.user)
  const { id } = useParams<{ id: string }>()
  const { interactions } = useAppSelector((state: RootState) => state.prospect)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const dispatch = useAppDispatch()



  useEffect(() => {
    if (id && user) {
      dispatch(fetchInteractionsProspect({ userID: user?.uid!, leadID: id}))
    }
  }, [id, user])

  console.log(interactions)

  const columnHelper = createColumnHelper<Interaction>();
  const columns = [
    columnHelper.accessor('tipo', {
      cell: (info) => (
        <Link to={`/prospect/${info.row.original.uid}`}>
          <span >{info.row.original.tipo}</span>
        </Link>
      ),
      header: 'Interacción',
    }),
    columnHelper.accessor('fecha', {
      cell: (info) => (
        <div>
          <span >{format(info.row.original.fecha!, { date: 'full', time: 'medium' }, 'es' )}</span>
        </div>
      ),
      header: 'Fecha de interacción',
    })
  ]

  const table = useReactTable({
		data: interactions,
		columns,
		state: {
      globalFilter,
      rowSelection,
		},
		getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

		// debugTable: true,
	});


  return (
    <PageWrapper title='Interacciones'>
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
							id='interactions'
							name='interactions'
							placeholder='Interacciones...'
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
  )
}

export default InteractionsList
