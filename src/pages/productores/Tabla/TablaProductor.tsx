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
import ModalRegistro from '../../../components/ModalRegistro';
import FormularioRegistroProductores from '../Formulario Registro/FormularioRegistroProductores';
import { TProductor } from '../../../types/registros types/registros.types';


const columnHelper = createColumnHelper<TProductor>();

const editLinkProductor = `/app/productor/`
const createLinkProductor = `/app/registro-productor/`

const columns = [
	columnHelper.accessor('rut_productor', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`} className='w-full bg-white'>
				<div className='font-bold w-20'>{`${info.row.original.rut_productor}`}</div>
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
		header: 'nombre',
		footer: 'nombre',
	}),
	columnHelper.accessor('email', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`}>
				<div className='font-bold truncate'>{`${info.row.original.email}`}</div>
			</Link>
		),
		header: 'Email',
	}),
	columnHelper.accessor('telefono', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`}>
				<div className='font-bold'>{`${info.row.original.telefono}`}</div>
			</Link>
		),
		header: 'Telefono',
	}),
	columnHelper.accessor('numero_contrato', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`}>
				<div className='font-bold'>{`${info.row.original.numero_contrato}`}</div>
			</Link>
		),
		header: 'N° Contrato',
	}),
	columnHelper.accessor('direccion', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`}>
				<div className='font-bold'>{`${info.row.original.direccion}`}</div>
			</Link>
		),
		header: 'Dirección',
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


interface IProductorProps {
	data: TProductor[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}


const TablaProductor : FC<IProductorProps> = ({ data, refresh }) => {
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
							placeholder='Busca al productor...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					<ModalRegistro
							open={modalStatus} 
							setOpen={setModalStatus} 
							title='Registro Productores'
							textButton='Agregar Productor'
							size={1200}
							>
						<FormularioRegistroProductores setOpen={setModalStatus} refresh={refresh}/>
					</ModalRegistro>
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

export default TablaProductor;
