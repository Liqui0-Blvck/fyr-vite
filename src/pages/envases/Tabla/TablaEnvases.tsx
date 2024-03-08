import React, { FC, useState, Dispatch, SetStateAction } from 'react';
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
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../components/ui/Card';
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
import { TEnvases } from '../../../types/registros types/registros.types';
import ModalRegistro from '../../../components/ModalRegistro';
import FormularioRegistroEnvases from '../Formulario Registro/FormularioRegistroEnvases';



const columnHelper = createColumnHelper<TEnvases>();

const editLinkProductor = `/app/envases/`

const columns = [
	columnHelper.accessor('id', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`} className='w-full bg-white'>
				<div className='font-bold w-20'>{`${info.row.original.id}`}</div>
			</Link>
		),
		header: 'ID'
	}),
	columnHelper.accessor('nombre', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`}>
				<div className='font-bold '>{`${info.row.original.nombre}`}</div>
			</Link>
		),
		header: 'Nombre',
	}),
	columnHelper.accessor('peso', {
		cell: (info) => (
			<Link to={`${editLinkProductor}${info.row.original.id}`}>
				<div className='font-bold'>{`${info.row.original.peso}`}</div>
			</Link>
		),
		header: 'Peso',
	}),
];


interface IEnvasesProps {
	data: TEnvases[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}

const TablaEnvases: FC<IEnvasesProps> = ({ data, refresh }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false);

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
		<PageWrapper name='ListaEnvases'>
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
							placeholder='Busca el envase...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
						<ModalRegistro
							open={modalStatus} 
							setOpen={setModalStatus} 
							title='Registro Envases'
							textButton='Agregar Envases'
							>
						<FormularioRegistroEnvases refresh={refresh} setOpen={setModalStatus}/>
						</ModalRegistro>
				</SubheaderRight>
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Envases</CardTitle>
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

export default TablaEnvases;
