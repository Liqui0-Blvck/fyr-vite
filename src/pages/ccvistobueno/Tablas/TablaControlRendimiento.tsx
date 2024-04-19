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
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import SolicitudContraMuestra from '../Detalle/SolicitudContraMuestra';
import { ImSpinner2  } from "react-icons/im";



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


	const asisteDelete = async (id: number) => {
		const response = await fetch(`${base_url}/api/envasesmp/${id}/`, {
			method: 'DELETE',
		})
		if (response.ok) {
			refresh(true)
		} else {
			console.log("nop no lo logre")
		}
	}

	const handleEstadoJefatura = async (id: number, estado: string) => {
		const response = await fetch(`${base_url}/api/estado-aprobacion-jefatura/${id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${authTokens?.access}`
			},
			body: JSON.stringify({
				estado_aprobacion_cc: estado
			})
		})
		if (response.ok) {
			refresh(true)
		} else {
			console.log("nop no lo logre")
		}
	}

	const handleContramuestra = async (id: number, estado: string,  setPosted: Dispatch<SetStateAction<boolean>>) => {
		const response = await fetch(`${base_url}/api/estado-contramuestra/${id}/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${authTokens?.access}`
			},
			body: JSON.stringify({
				esta_contramuestra: estado
			})
		})
		if (response.ok) {
			refresh(true)
			setPosted(true)

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
										<Tooltip title='Detalle Informe	Control de Rendimiento'>
											<Link to={`/app/vb_control/${info.row.original.id}`} className={`w-full h-12 rounded-md flex items-center justify-center ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'} hover:scale-105`}>
												<HeroEye style={{ fontSize: 35}}/>
											</Link>
										</Tooltip>

										<Tooltip title='PDF CC Rendimiento '>
											<Link to={`/app/pdf-rendimiento/${info.row.original.id}`} target='_blank' className={`w-full h-12 rounded-md flex items-center justify-center ${isDarkTheme ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-700 hover:bg-red-600 text-white'} hover:scale-105`}>
												<FaFilePdf className='text-2xl'/>
											</Link>
										</Tooltip>
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
				const [posted, setPosted] = useState<boolean>(false)
				const cantidad = info.row.original.control_rendimiento.length
				const estado_aprobacion = info.row.original.estado_aprobacion_cc
				const contra_muestras_estado =  info.row.original.esta_contramuestra 

				console.log(posted)
				
				return (
					<div className='h-full w-full flex justify-around gap-2'>
						{
							cantidad >= 2
								? (
									<>
									{
										estado_aprobacion > 0 && estado_aprobacion < 2 
											? (
												<Tooltip title={contra_muestras_estado === '0' ? 'Contra Muestra Solicitada' : contra_muestras_estado === '5' ? 'Contra Muestra Completada' : null}>
													<button
														type='button'
														onClick={() => {
															if (contra_muestras_estado === '5'){
																{}
															} else {
																posted ? null : handleContramuestra(id, '1', setPosted)
															}
														}}
														className={`w-full cursor-pointer flex items-center justify-center rounded-md px-1 h-12
															${isDarkTheme ? 'text-white' : 'text-white'}
															${contra_muestras_estado === '0' || contra_muestras_estado === '5' ? 'bg-green-600 hover:bg-green-400' : 'bg-orange-600 hover:bg-orange-400'} hover:scale-105`}>
														{
															contra_muestras_estado === '1'
																? <ImSpinner2  className='text-4xl transition-all delay-200 animate-spin'/>
																: <RiErrorWarningFill className='text-4xl'/>
														}
													</button>
												</Tooltip>
											)
											: estado_aprobacion === 2 && contra_muestras_estado === '1'
												? null
												: (
													<Tooltip title='Aprobar CC Rendimiento Lote'>
															<div
																onClick={() => handleEstadoJefatura(id, '1')} 
																className={`w-full cursor-pointer flex items-center justify-center rounded-md px-1 h-12 ${isDarkTheme ? 'bg-green-600 hover:bg-green-400 text-white' : 'bg-green-600 hover:bg-green-400 text-white'} hover:scale-105`}>
																<AiFillLike className='text-4xl'/>
															</div>
													</Tooltip>
													)
									}
											
									{
										estado_aprobacion > 0 && estado_aprobacion < 2 
											? (
												<Tooltip title='Mandar Email a proveedor'>
													<button type='button' className={`w-full px-1 h-12 bg-blue-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
														<IoMailOutline style={{ fontSize: 25 }} />
													</button>
												</Tooltip>

												)
											: (
												<Tooltip title='Rechazar CC Rendimiento Lote'>
														<div
															onClick={() => handleEstadoJefatura(id, '2')} 
															className={`w-full cursor-pointer flex items-center justify-center rounded-md px-1 h-12 ${isDarkTheme ? 'bg-red-600 hover:bg-red-400 text-white' : 'bg-red-600 hover:bg-red-400 text-white'} hover:scale-105`}>
															<AiFillDislike className='text-4xl'/>
														</div>
												</Tooltip>
											)
											
										}
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
		<PageWrapper name='Lista Control Rendimiento'>
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
