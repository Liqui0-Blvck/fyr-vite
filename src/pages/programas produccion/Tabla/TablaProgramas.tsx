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
import ModalRegistro from '../../../components/ModalRegistro';
// import FormularioRegistroProductores from '../Formulario Registro/FormularioRegistroProductores';
import { TProduccion, TProductor } from '../../../types/registros types/registros.types';
import useDarkMode from '../../../hooks/useDarkMode';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { Tooltip } from 'antd';
// import DetalleProductor from '../Detalle/DetalleProductor';
// // import FormularioEdicionProductores from '../Formulario Edicion/FormularioEdicionProductores';
import { cargolabels } from '../../../utils/generalUtils';
import { useAuth } from '../../../context/authContext';
import { 
	FaUserPlus,
	FaFileContract,
	FaPlay,
	FaStop,
	FaPause,
	FaFilePdf,

} from "react-icons/fa";
import FormularioInformeProduccion from '../Formularios Produccion/Formulario Informe/FormularioInformeProduccion';
import FormularioKilosOperarios from '../Formularios Produccion/Formulario Kilos Operarios/FormularioKilosOperarios';
import FormularioResumen from '../Formularios Produccion/Formulario Resumen/FormularioResumenOperario';
import toast from 'react-hot-toast';
import { TfiReload } from "react-icons/tfi";


interface IProduccionProps {
	data: TProduccion[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}


const estados = [
	{value: '0',label: 'Pausa' },
	{value: '2',label: 'En Curso'},
	{value: '5',label: 'Terminado'}
]

const columnHelper = createColumnHelper<TProduccion>();



const TablaProgramas: FC<IProduccionProps> = ({ data, refresh }) => {
	const { perfilData, authTokens, userID } = useAuth()
	const { isDarkTheme } = useDarkMode();
	const navigate = useNavigate()
	const [id_programa, setIDPrograma] = useState<number>(0)
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [edicionModalStatus, setEdicionModalStatus] = useState<boolean>(false);
	const [informePro, setInformePro] = useState<boolean>(false)
	const [informeKgOp, setInformeinformeKgOp] = useState<boolean>(false)
	const [informeResOp, setInformeinformeResOp] = useState<boolean>(false)
	const base_url = process.env.VITE_BASE_URL_DEV


	const asisteDelete = async (id: number) => {
		const response = await fetch(`${base_url}/api/productores/${id}/`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${authTokens?.access}`
			}
		})
		if (response.ok) {
			refresh(true)
		} else {
			console.log("nop no lo logre")
		}
	}

	const actualizarEstadoProduccion = async (id: number, estado: string) => {
		const response = await fetch(`${base_url}/api/produccion/${id}/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${authTokens?.access}`
			},
			body: JSON.stringify({
				estado: estado,
				registrado_por: userID?.user_id
			})
		})
		if (response.ok) {
			const data: TProduccion = await response.json()
			toast.success(`El programa esta en ${estados.find(est => est.value === data.estado)?.label}`)
			refresh(true)
		} else {
			console.log("nop no lo logre")
		}
	}

	const registrarReproceso = async (id: number) => {
		const response = await fetch(`${base_url}/api/reproceso/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${authTokens?.access}`
			},
			body: JSON.stringify({
				registrado_por: userID?.user_id
			})
		})
		if (response.ok) {
			const data: TProduccion = await response.json()
			toast.success(`El programa reproceso fue creado exitosamente`)
			actualizarEstadoProduccion(id, '3')
			navigate(`/app/produccion/registro-programa/${data.id}`)
		} else {
			toast.error("Error al registrar el programa de reproceso, volver a intentar")
		}
	}

	const registroProgramaProduccion = async () => {
		const response = await fetch(`${base_url}/api/produccion/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${authTokens?.access}`
			},
			body: JSON.stringify({
				registrado_por: userID?.user_id
			})
		})
		if (response.ok) {
			const data: TProduccion = await response.json()
			toast.success(`El programa fue creado exitosamente`)
			navigate(`/app/produccion/registro-programa/${data.id}`)
		} else {
			console.log("nop no lo logre")
		}
	}


	const columns = [
		columnHelper.accessor('id', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{`${info.row.original.id}`}
				</div>
			),
			header: 'N° Programa',
		}),
		columnHelper.accessor('lotes', {
			cell: (info) => (
				<div className='font-bold '>
					{`${info.row.original.lotes.length}`}
				</div>
			),
			header: 'N° Envases',
		}),
		columnHelper.accessor('lotes', {
			cell: (info) => {
				const total_lotes = info.row.original.lotes.length
				const lotes_procesados = ((info.row.original.lotes.filter(lote => lote.bin_procesado !== true).length / total_lotes) * 100).toFixed(1)
				
				return (
					<div className='font-bold'>
						<p className='text-center'>{isNaN(Number(lotes_procesados)) ? 0 : lotes_procesados} % Envases x Procesar</p>
					</div>
				)
			},
			header: 'Envases en Proc.',
		}),
		columnHelper.accessor('lotes', {
			cell: (info) => {
				const total_lotes = info.row.original.lotes.length
				const lotes_procesados = ((info.row.original.lotes.filter(lote => lote.bin_procesado === true).length / total_lotes) * 100).toFixed(1)
				
				return (
					<div className='font-bold'>
						<p className='text-center'>{isNaN(Number(lotes_procesados)) ? 0 : lotes_procesados} % Envases Procesados</p>
					</div>
				)
			},
			header: 'Envases en Proc.',
		}),
		columnHelper.accessor('estado', {
			cell: (info) => {
				const estado = info.row.original.estado_label
				return  (
					<div className='font-bold w-full flex items-center flex-wrap'>
						<p className='text-center'>{estado}</p>
					</div>
	
				)
			},
			header: 'Estado',
		}),
		columnHelper.display({
			id:'actions',
			cell: (info) => (
				<div className='font-bold truncate'>
					<Tooltip title='Rendimiento CDC'>
						<Link to={`/app/proyeccion-rendimiento/${info.row.original.id}/`}>
							<button className='w-full rounded-md h-12 bg-zinc-300 flex items-center justify-center p-2'>
								<p className='text-black m-0'>Rendimiento CDC</p>
							</button>
						</Link>
					</Tooltip>
				</div>

			),
			header: 'Rendimiento Programa',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const estado = info.row.original.estado
				
				return (
					<div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>

					{
						estado === '0' || estado === '1' && estado <= '2'
							? (
								<Tooltip title='Iniciar Producción'>
									<button
										type='button'
										onClick={() => actualizarEstadoProduccion(id, '2')}
										className='w-16 rounded-md h-12 bg-amber-600 flex items-center justify-center p-2 hover:scale-105'>
										<FaPlay style={{ fontSize: 25, color: 'white' }}/>
									</button>
								</Tooltip>
								)
							: null
					}

					{
						estado === '2'
							? (
								<Tooltip title='Pausar Producción'>
									<button
										type='button'
										onClick={() => actualizarEstadoProduccion(id, '0')}
										className='w-16 rounded-md h-12 bg-blue-500 flex items-center justify-center p-2 hover:scale-105'>
										<FaPause style={{ fontSize: 25, color: 'white' }}/>
									</button>
								</Tooltip>
								)
							: null
					}

					{
						(info.row.original.lotes.every(lote => lote.bin_procesado === true && info.row.original.lotes.length > 0)) && (
							info.row.original.tarjas_resultantes.length > 0 && info.row.original.tarjas_resultantes.every(tarja => tarja.cc_tarja === true)
						) && (info.row.original.operarios.length > 0) && info.row.original.estado !== '5'
							? (
								<Tooltip title='Terminar Producción'>
									<button
										type='button'
										onClick={() => {
											estado === '5' ? {} : actualizarEstadoProduccion(id, '5')
										}}
										className='w-16 rounded-md h-12 bg-red-500 flex items-center justify-center p-2 hover:scale-105'>
										<FaStop style={{ fontSize: 25, color: 'white' }}/>
									</button>
								</Tooltip>
								)
							: null
					}

					{
							info.row.original.estado === '5'
								? (
									<Tooltip title='Iniciar Reproceso'>
										<button 
											type='button'
											onClick={() => registrarReproceso(id)}
											className='w-16 rounded-md h-12 bg-orange-500 flex items-center justify-center p-2 hover:scale-105'>
											<TfiReload style={{ fontSize: 30, color: 'white', fontWeight: 'bold'}}/>
										</button>
									</Tooltip>
									)
								: null
						}
					</div>
				);
			},
			header: 'Controles'
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				

				return (
					<div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>

						<Link to={`${`/app/produccion/programa/${id}/`}`}>
							<Tooltip title='Terminar Producción'>
								<button className='w-16 rounded-md h-12 bg-[#40be75] hover:bg-[#49bb78] flex items-center justify-center p-2 hover:scale-105'>
									<HeroEye style={{ fontSize: 35, color: 'white' }}/>
								</button>
							</Tooltip>
						</Link>
					

						{
							info.row.original.lotes.length > 0
								? (
									<>
										<Tooltip title='Detalle envases del lote en Programa'>
											<Link to={`/app/pdf-detalle-envases/${id}`}>
												<button className='w-16 rounded-md h-12 bg-red-500 flex items-center justify-center p-2 hover:scale-105'>
													<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
												</button>
											</Link>
										</Tooltip>

										<Tooltip title='Documento de entrada a proceso'>
											<Link to={`/app/pdf-documento-entrada/${id}`}>
												<button className='w-16 rounded-md h-12 bg-red-500 flex items-center justify-center p-2 hover:scale-105'>
													<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
												</button>
											</Link>
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

	

	console.log(data.map(lote => lote.estado))



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
		<PageWrapper name='Lista Programas'>
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
							placeholder='Busca programa...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>

				{
					data.length >= 1 && data.some(programa => programa.estado !== '5') 
						? null
							: (
								<SubheaderRight>
									<Tooltip title='Registro Programa de produccion'>
										<button
											type='button'
											onClick={() => registroProgramaProduccion()}
											className='w-full rounded-md h-12 bg-blue-700 flex items-center justify-center p-2 hover:scale-105 px-2'>
											<span className='text-lg text-white'>Registrar Programa de Producción</span>
										</button>
									</Tooltip>
								</SubheaderRight>
							)
				} 
			</Subheader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
					<CardHeader>

						<CardHeaderChild>
							<CardTitle>Programas</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} registros
							</Badge>
						</CardHeaderChild>

						<CardHeaderChild className='lg:w-[70%] sm:w-full md:w-full'>
							<div className='flex items-center gap-3 '>
								<ModalRegistro
									open={informePro}
									setOpen={setInformePro}
									title='Informe de Producción'
									icon={
									<div className='flex items-center gap-1.5'>
											<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
										<span className='text-md font-semibold'>Generar Informe de Producción</span>
									</div>
									}
									width={`w-full md:w-full px-4 sm:py-3 md:py-3 lg:py-auto text-white bg-red-700 hover:bg-red-600 hover:scale-105`}
									size={800}
								>
									<FormularioInformeProduccion setOpen={setInformePro}/>
								</ModalRegistro>

								<ModalRegistro
									open={informeKgOp}
									setOpen={setInformeinformeKgOp}
									title='Informe de Kilos por Operario'
									icon={
									<div className='flex items-center gap-1.5'>
										<FaFilePdf style={{ fontSize: 20, color: 'white'}}/>
										<span className='text-md font-semibold'>Generar Informe de Kilos por Operario</span>
									</div>
									}
									width={`w-full md:w-full px-4 sm:py-3 md:py-3 lg:py-0 text-white bg-red-700 hover:bg-red-600 hover:scale-105`}
									size={700}
								>
									<FormularioKilosOperarios setOpen={setInformePro}/>
								</ModalRegistro>

								<ModalRegistro
									open={informeResOp}
									setOpen={setInformeinformeResOp}
									title='Informe de Operarios Resumido'
									icon={
									<div className='flex items-center gap-1.5'>
										<FaFilePdf style={{ fontSize: 20}}/>
										<span className='text-md font-semibold'>Generar Informe de Operarios Resumido</span>
									</div>
									}
									width={`w-full md:w-full px-4 sm:py-3 md:py-3 lg:py-0 text-white bg-red-700 hover:bg-red-600 hover:scale-105`}
									size={500}
								>
									<FormularioResumen setOpen={setInformePro}/>
								</ModalRegistro>

							</div>
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-x-auto'>
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaProgramas;

