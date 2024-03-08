import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { Link, useNavigate } from 'react-router-dom';
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
import { TCamion } from '../../../types/registros types/registros.types'; 
import ModalRegistro from '../../../components/ModalRegistro';
import FormularioRegistroCamiones from '../Formularios Registro/FormularioRegistroCamiones';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { Tooltip } from 'antd';




const columnHelper = createColumnHelper<TCamion>();




interface ICamionProps {
	data: TCamion[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}


const TablaCamion: FC<ICamionProps> = ({ data, refresh }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false)

	const asisteDelete = async (id: number) => {
		const base_url = process.env.VITE_BASE_URL_DEV
		const response = await fetch(`${base_url}/api/registros/camiones/${id}/`, {
			method: 'DELETE',
		})
		if (response.ok){
			refresh(true)
		} else {
			console.log("nop no lo logre")
		}
	}
	
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
		columnHelper.display({
			id: 'actions',
			cell: props => (
				<div className=' h-full w-full flex justify-between gap-2 overflow-hidden p-2'>
					<ModalRegistro
						open={modalStatus} 
						setOpen={setModalStatus}
						textTool='Detalle'
						title='Registro Camiones'
						icon={<HeroEye className='text-xl' />}
						>
					<FormularioRegistroCamiones refresh={refresh} setOpen={setModalStatus}/>
					</ModalRegistro>

					<ModalRegistro
						open={modalStatus} 
						setOpen={setModalStatus} 
						title='Registro Camiones'
						textTool='Editar'
						icon={<HeroPencilSquare className='text-xl'/>}
						>
					<FormularioRegistroCamiones refresh={refresh} setOpen={setModalStatus}/>
					</ModalRegistro>
	
					<Tooltip title='Eliminar'>
						<button onClick={async () => await asisteDelete(
							props.row.original.id,
						)} type='button' className='w-10 h-10 bg-red-800 rounded-md flex items-center justify-center'>
							<HeroXMark className='text-xl'/>
						</button>
					</Tooltip>
				</div>
			),
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
		<PageWrapper name='ListaCamiones'>
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
							placeholder='Busca al camión...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					<ModalRegistro
						open={modalStatus} 
						setOpen={setModalStatus} 
						title='Registro Camiones'
						textButton='Agregar Camión'
						>
					<FormularioRegistroCamiones refresh={refresh} setOpen={setModalStatus}/>
					</ModalRegistro>
				</SubheaderRight>
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Camiones</CardTitle>
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
