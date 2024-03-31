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
import useDarkMode from '../../../hooks/useDarkMode';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { Tooltip } from 'antd';
import DetalleEnvase from '../../guia recepcion/Detalle/Detalle Envases/DetalleEnvase';
import FooterDetalleEnvase from '../../guia recepcion/Detalle/Detalle Envases/FooterDetalleEnvase';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { useAuth } from '../../../context/authContext';
import DetalleEnvaseMP from '../Detalle Envase/DetalleEnvase';



const columnHelper = createColumnHelper<TEnvases>();




interface IEnvasesProps {
	data: TEnvases[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}

const TablaEnvases: FC<IEnvasesProps> = ({ data, refresh }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false);
	const { isDarkTheme } = useDarkMode()
	const { authTokens, validate, perfilData } = useAuth()

	

	const asisteDelete = async (id: number) => {
		const base_url = process.env.VITE_BASE_URL_DEV
		const response = await fetch(`${base_url}/api/envasesmp/${id}/`, {
			method: 'DELETE',
		})
		if (response.ok) {
			refresh(true)
		} else {
			console.log("nop no lo logre")
		}
	}

	const { data: envaseEnGuia } = useAuthenticatedFetch(
		authTokens,
		validate,
		`/api/`
	)

	const editLinkProductor = `/app/envases/`

	const columns = [
		columnHelper.accessor('nombre', {
			cell: (info) => (
				<div className='font-bold '>{`${info.row.original.nombre}`}</div>
			),
			header: 'Nombre',
		}),
		columnHelper.accessor('peso', {
			cell: (info) => (
				<div className='font-bold'>{`${info.row.original.peso}`}</div>
			),
			header: 'Peso',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const [detalleModalStatus, setDetalleModalStatus] = useState(false);
				const [edicionModalStatus, setEdicionModalStatus] = useState(false);

				console.log(info.row)

				return (
					<div className='h-full w-full flex gap-2 '>
						<ModalRegistro
							open={detalleModalStatus}
							setOpen={setDetalleModalStatus}
							textTool='Detalle'
							title='Detalle Envase Materia Prima'
							size={900}
							width={`w-20 px-1 h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
							icon={<HeroEye style={{ fontSize: 25 }} />}
						>
							<DetalleEnvaseMP  data={info.row.original}/>
						</ModalRegistro>

						<ModalRegistro
							open={edicionModalStatus}
							setOpen={setEdicionModalStatus}
							title='Edición Comercializador'
							textTool='Editar'
							size={900}
							width={`w-20 px-1 h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
							icon={<HeroPencilSquare style={{ fontSize: 25 }}
							/>}
						>
							{/* <FormularioEdicionComercializador refresh={refresh} setOpen={setEdicionModalStatus} id={id} /> */}
							hola
						</ModalRegistro>

						<Tooltip title='Eliminar'>
							<button onClick={async () => await asisteDelete(id)} type='button' className={`w-20 px-1 h-12 bg-red-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
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
						width={`px-6 py-3 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}

					>
						<FormularioRegistroEnvases refresh={refresh} setOpen={setModalStatus} />
					</ModalRegistro>
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null}>
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
