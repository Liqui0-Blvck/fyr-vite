import React, { FC, useState, Dispatch, SetStateAction, useEffect } from 'react';
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
import { TControlCalidad, TControlCalidadB, TEnvases, TProductor, TRendimientoMuestra } from '../../../types/registros types/registros.types';
import ModalRegistro from '../../../components/ModalRegistro';
import useDarkMode from '../../../hooks/useDarkMode';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { Tooltip } from 'antd';
import { useAuth } from '../../../context/authContext';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import GuiaSalidaPDF from '../../guia recepcion/PDF/GuiaRecepcion';
import { FaFilePdf } from "react-icons/fa6";
import { BiCheckDouble } from 'react-icons/bi';
import { RiErrorWarningFill } from "react-icons/ri";
import { IoMailOutline } from "react-icons/io5";



const columnHelper = createColumnHelper<TControlCalidadB>();




interface IControlProps {
	data: TControlCalidadB[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}

const TablaControlRendimiento: FC<IControlProps> = ({ data, refresh }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false);
	const { isDarkTheme } = useDarkMode()
	const { authTokens, validate } = useAuth()
	const base_url = process.env.VITE_BASE_URL_DEV
	// const [cantidad, setCantidad] = useState<number>(0)
	const [openDetalleControl, setOpenDetalleControl] = useState<boolean>(false)

	
	console.log(data)


	
	

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


	const editLinkProductor = `/app/envases/`

	const columns = [
		columnHelper.accessor('numero_lote', {
			cell: (info) => (
				<div className='font-bold '>{`${info.row.original.numero_lote}`}</div>
			),
			header: 'N° Lote',
		}),
		columnHelper.accessor('productor', {
			cell: (info) => {
				return (
					<div className='font-bold'>{`${info.row.original.productor}`}</div>
				)
			},
			header: 'Productor ',
		}),
		columnHelper.accessor('productor', {
			cell: (info) => {
				const cantidad = info.row.original.control_rendimiento.length
				return (
					<div className='font-bold w-full'>{`${cantidad < 2 ? 'Sin muestras registradas' : cantidad}`}</div>
				)
			},
			header: 'Cantidad CDC Lotes ',
		}),
		columnHelper.accessor('estado_aprobacion_cc', {
			cell: (info) => (
				<div className='font-bold'>{`${info.row.original.estado_aprobacion_cc_label}`}</div>
			),
			header: 'Estado VB Lote',
		}),
		columnHelper.accessor('productor', {
			cell: (info) => {
				const cantidad = info.row.original.control_rendimiento.length

				return (
					<>
						{
							cantidad >= 2
								? (
									<div className='flex items-center gap-5'>
										<Link to={`/app/vb_control/${info.row.original.id}`} className={`w-full h-12 rounded-md flex items-center justify-center ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'} hover:scale-105`}>
											<HeroEye style={{ fontSize: 35}}/>
										</Link>

										<Link to={`/app/pdf-rendimiento/${info.row.original.id}`} target='_blank' className={`w-full h-12 rounded-md flex items-center justify-center ${isDarkTheme ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-700 hover:bg-red-600 text-white'} hover:scale-105`}>
											<FaFilePdf className='text-2xl'/>
										</Link>
									</div>
									)
								: <span className='text-md font-semibold'>Muestras insuficientes para CR</span>
						}

							
					</>
					
				)
			},
			header: 'Informes CDR',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const [detalleModalStatus, setDetalleModalStatus] = useState(false);
				const [edicionModalStatus, setEdicionModalStatus] = useState(false);
				const cantidad = info.row.original.control_rendimiento.length
				
				return (
					<div className='h-full w-full flex justify-around gap-2'>
						{
							cantidad >= 2
								? (
									<>
									<Tooltip title='Solicitar contramuestra'>
											<div className={`w-full cursor-pointer flex items-center justify-center rounded-md px-1 h-12 ${isDarkTheme ? 'bg-red-600 hover:bg-red-400 text-white' : 'bg-red-600 hover:bg-red-400 text-white'} hover:scale-105`}>
												<RiErrorWarningFill className='text-4xl'/>
											</div>
									</Tooltip>
											

										{
											info.row.original.estado_aprobacion_cc === 1
												? (
													<Tooltip title='Aprobado'>
														<div className={`w-full flex items-center justify-center rounded-md px-1 h-12 ${isDarkTheme ? 'bg-green-600 hover:bg-green-400 text-white' : 'bg-green-600 hover:bg-green-400 text-white'} hover:scale-105`}>
															<BiCheckDouble className='text-4xl'/>
														</div>
													</Tooltip>
														
													)
												: null
										}

										<Tooltip title='Mandar Email a proveedor'>
											<button onClick={async () => await asisteDelete(id)} type='button' className={`w-full px-1 h-12 bg-blue-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
												<IoMailOutline style={{ fontSize: 25 }} />
											</button>
										</Tooltip>
									</>
								)
								: <span className='text-md font-semibold'>Muestras insuficientes</span>
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
							placeholder='Busca el control...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					{/* <ModalRegistro
						open={modalStatus}
						setOpen={setModalStatus}
						title='Registro Envases'
						textButton='Agregar Envases'
						width={`px-6 py-3 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}

					>
						<FormularioRegistroEnvases refresh={refresh} setOpen={setModalStatus} />
					</ModalRegistro> */}
					algo
				</SubheaderRight>
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>VB Control Rendimiento Lote</CardTitle>
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

export default TablaControlRendimiento;
