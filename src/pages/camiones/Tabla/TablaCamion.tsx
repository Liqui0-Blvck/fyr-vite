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
import FormularioEditarCamiones from '../Formulario Edicion/FormularioEditarCamiones';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { Row, Tooltip } from 'antd';
import DetalleCamion from '../Detalle/Detalle';
import useDarkMode from '../../../hooks/useDarkMode';
import { useAuth } from '../../../context/authContext';
import { cargolabels } from '../../../utils/generalUtils';
import toast from 'react-hot-toast';





interface ICamionProps {
	data: TCamion[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}


const TablaCamion: FC<ICamionProps> = ({ data, refresh }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false)
	const { isDarkTheme } = useDarkMode();
	const { perfilData, authTokens } = useAuth()


	const asisteDelete = async (id: number) => {
		const base_url = process.env.VITE_BASE_URL_DEV
		const response = await fetch(`${base_url}/api/registros/camiones/${id}/`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${authTokens?.access}`
			}
		})
		if (response.ok) {
			refresh(true)
			toast.success('Se ha eliminado correctamente el camión')
		} else {
			toast.error('No se ha logrado eliminar el camión')	
		}
	}

	const columnHelper = createColumnHelper<TCamion>();
	const editLinkProductor = `/app/camion/`
	const createLinkProductor = `/app/registro-camiones/`

	const columns = [
		columnHelper.accessor('patente', {
			cell: (info) => (
				<div className='font-bold '>
					{`${info.row.original.patente}`}
				</div>
			),
			header: 'Patente',
		}),
		columnHelper.accessor('observaciones', {
			cell: (info) => (
				<div className='font-bold'>
					{`${info.row.original.observaciones}`}
				</div>
			),
			header: 'Observaciones',
		}),
		columnHelper.accessor('acoplado', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{`${info.row.original.acoplado ? 'Con Acoplado' : 'Sin Acoplado'}`}
				</div>
			),
			header: 'acoplado',
		}),
		columnHelper.accessor('fecha_creacion', {
			cell: (info) => (
				<div className='font-bold'>
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
					<div className='h-full w-full flex justify-around gap-2'>
						<ModalRegistro
							open={detalleModalStatus}
							setOpen={setDetalleModalStatus}
							textTool='Detalle'
							title='Detalle Camión'
							width={`md:w-14 lg:w-14 px-1 md:h-10 lg:h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
							icon={<HeroEye style={{ fontSize: 25 }} />}
						>
							<DetalleCamion id={id} />
						</ModalRegistro>

						{
							cargolabels(perfilData).includes('Administrador', 'RecepcionMP')
								? (
									<>
										<ModalRegistro
											open={edicionModalStatus}
											setOpen={setEdicionModalStatus}
											title='Edición Camiones'
											textTool='Editar'
											width={`md:w-14 lg:w-14 px-1 md:h-10 lg:h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
											icon={<HeroPencilSquare style={{ fontSize: 25 }} />}
										>
											<FormularioEditarCamiones refresh={refresh} setOpen={setEdicionModalStatus} id={id} />
										</ModalRegistro>

										<Tooltip title='Eliminar'>
											<button onClick={async () => await asisteDelete(id)} type='button' className={`md:w-14 lg:w-14 px-1 md:h-10 lg:h-12 bg-red-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
												<HeroXMark style={{ fontSize: 25 }} />
											</button>
										</Tooltip>
									</>
									)
								: null
						}
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
		<PageWrapper name='Lista Camiones'>
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
						width={`w-full h-11 px-5 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] hover:bg-[#3b83f6cd] text-white'} hover:scale-105`}
						textButton='Agregar Camión'
					>
						<FormularioRegistroCamiones refresh={refresh} setOpen={setModalStatus} />
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
					<TableCardFooterTemplate table={table} className='mt-2 mb-10' />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaCamion;
