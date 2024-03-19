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
import useDarkMode from '../../../hooks/useDarkMode';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { Tooltip } from 'antd';
import DetalleProductor from '../Detalle/DetalleProductor';
import FormularioEdicionProductores from '../Formulario Edicion/FormularioEdicionProductores';


interface IProductorProps {
	data: TProductor[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}

const columnHelper = createColumnHelper<TProductor>();



const TablaProductor: FC<IProductorProps> = ({ data, refresh }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false)
	const { isDarkTheme } = useDarkMode();

	const asisteDelete = async (id: number) => {
		const base_url = process.env.VITE_BASE_URL_DEV
		const response = await fetch(`${base_url}/api/productores/${id}/`, {
			method: 'DELETE',
		})
		if (response.ok) {
			refresh(true)
		} else {
			console.log("nop no lo logre")
		}
	}


	const columns = [
		columnHelper.accessor('rut_productor', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{`${info.row.original.rut_productor}`}
				</div>
			),
			header: 'Rut Productor'
		}),
		columnHelper.accessor('nombre', {
			cell: (info) => (
				<div className='font-bold '>
					{`${info.row.original.nombre}`}
				</div>
			),
			header: 'nombre',
		}),
		columnHelper.accessor('email', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{`${info.row.original.email}`}
				</div>
			),
			header: 'Email',
		}),
		columnHelper.accessor('telefono', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{`${info.row.original.telefono}`}
				</div>

			),
			header: 'Telefono',
		}),
		columnHelper.accessor('direccion', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{`${info.row.original.direccion}`}
				</div>
			),
			header: 'Dirección',
		}),
		columnHelper.accessor('fecha_creacion', {
			cell: (info) => (
				<div className='font-bold truncate text-clip'>
					{`${format(info.row.original.fecha_creacion, { date: 'short', time: 'short' })}`}
				</div>
			),
			header: 'Fecha creación',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const [detalleModalStatus, setDetalleModalStatus] = useState(false);
				const [edicionModalStatus, setEdicionModalStatus] = useState(false);

				return (
					<div className='h-full w-full flex justify-around gap-5 '>

						<ModalRegistro
							open={detalleModalStatus}
							setOpen={setDetalleModalStatus}
							textTool='Detalle'
							title='Detalle Productor'
							size={900}
							width={`w-full px-1 md:h-10 lg:h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
							icon={<HeroEye style={{ fontSize: 25 }} />}
						>
							<DetalleProductor id={id} />
						</ModalRegistro>

						<ModalRegistro
							open={edicionModalStatus}
							setOpen={setEdicionModalStatus}
							title='Edición Productor'
							textTool='Editar'
							size={900}
							width={`w-full px-1 md:h-10 lg:h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
							icon={<HeroPencilSquare style={{ fontSize: 25 }} />}
						>
							<FormularioEdicionProductores refresh={refresh} setOpen={setEdicionModalStatus} id={id} />
						</ModalRegistro>

						<Tooltip title='Eliminar'>
							<button onClick={async () => await asisteDelete(id)} type='button' className={`w-full px-1 md:h-10 lg:h-12 bg-red-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
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
						width={`w-full md:w-full px-4 py-2 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
						size={1200}
					>
						<FormularioRegistroProductores setOpen={setModalStatus} refresh={refresh} />
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
					<CardBody className='overflow-x-auto overflow-hidden'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaProductor;
