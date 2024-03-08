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
import { useAuth } from '../../../context/authContext';
import { format } from "@formkit/tempo"




interface ICamion {
	id: number,
	fecha_creacion: string,
	fecha_modificacion: string,
	patente: string,
	acoplado: boolean,
	observaciones: string
}


const columnHelper = createColumnHelper<ICamion>();

const editLinkProductor = `/app/camion/`
const createLinkProductor = `/app/registro-camiones/`

const columns = [
	columnHelper.accessor('id', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`} className='w-full bg-white'>
				<div className='font-bold w-20'>{`${info.row.original.id}`}</div>
			</Link>
		),
		header: 'ID'
	}),
	columnHelper.accessor('patente', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`}>
				<div className='font-bold '>{`${info.row.original.patente} ${info.row.original.patente}`}</div>
			</Link>
		),
		header: 'Patente',
	}),
	columnHelper.accessor('observaciones', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`}>
				<div className='font-bold'>{`${info.row.original.observaciones}`}</div>
			</Link>
		),
		header: 'Observaciones',
	}),
	columnHelper.accessor('acoplado', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`}>
				<div className='font-bold truncate'>{`${info.row.original.acoplado ? 'Con Acoplado' : 'Sin Acoplado'}`}</div>
			</Link>
		),
		header: 'acoplado',
	}),
	columnHelper.accessor('fecha_creacion', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`}>
				<div className='font-bold'>{`${format(info.row.original.fecha_creacion, { date: 'short', time: 'short' })}`}</div>
			</Link>
		),
		header: 'Fecha creación',
	}),
];


const TablaCamion = ({ data }: { data: ICamion[] | [] }) => {
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

export default TablaCamion;
