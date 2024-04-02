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
import ModalRegistro from '../../../components/ModalRegistro';
// import FormularioRegistroProductores from '../Formulario Registro/FormularioRegistroProductores';
import { TProductor } from '../../../types/registros types/registros.types';
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


interface IProductorProps {
	data: TProductor[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}


type PorMientras = {

}

const columnHelper = createColumnHelper<TProductor>();



const TablaProgramas: FC<IProductorProps> = ({ data, refresh }) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false)
	const { isDarkTheme } = useDarkMode();
	const { perfilData, authTokens } = useAuth()
	const [detalleModalStatus, setDetalleModalStatus] = useState<boolean>(false);
	const [edicionModalStatus, setEdicionModalStatus] = useState<boolean>(false);
	const [informePro, setInformePro] = useState<boolean>(false)
	const [informeKgOp, setInformeinformeKgOp] = useState<boolean>(false)
	const [informeResOp, setInformeinformeResOp] = useState<boolean>(false)
	const [adicionUser, setAdicionUser] = useState<boolean>(false)
	const [contrato, setContrato] = useState<boolean>(false)

	const asisteDelete = async (id: number) => {
		const base_url = process.env.VITE_BASE_URL_DEV
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


	const columns = [
		columnHelper.accessor('rut_productor', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{/* {`${info.row.original.rut_productor}`} */}
					1
				</div>
			),
			header: 'N° Programa',
		}),
		columnHelper.accessor('nombre', {
			cell: (info) => (
				<div className='font-bold '>
					{/* {`${info.row.original.nombre}`} */}
					69 Envases
				</div>
			),
			header: 'N° Envases',
		}),
		columnHelper.accessor('email', {
			cell: (info) => (
				<div className='font-bold'>
					{/* {`${info.row.original.email}`} */}
					<p className='text-center'>0 Envases x Procesar</p>
				</div>
			),
			header: 'Envases en Proc.',
		}),
		columnHelper.accessor('telefono', {
			cell: (info) => (
				<div className='font-bold'>
					{/* {`${info.row.original.telefono}`} */}
					<p className='text-center'>69 Envases procesados</p>
					<p className=''>= 100.0 % del total</p>
				</div>

			),
			header: 'Envases Procesados',
		}),
		columnHelper.accessor('telefono', {
			cell: (info) => (
				<div className='font-bold w-full flex items-center justify-center flex-wrap'>
					{/* {`${info.row.original.telefono}`} */}
					<p className='text-center'>Producción Pausada</p>
					<FaStop />
				</div>

			),
			header: 'Estado',
		}),
		columnHelper.accessor('telefono', {
			cell: (info) => (
				<div className='font-bold truncate'>
					{/* {`${info.row.original.telefono}`} */}
					<Tooltip title='Rendimiento CDC'>
						<button className='w-full rounded-md h-12 bg-zinc-300 flex items-center justify-center p-2'>
							<p className='text-black m-0'>Rendimiento CDC</p>
						</button>
					</Tooltip>
				</div>

			),
			header: 'Rendimiento Programa',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
			
				return (
					<div className='h-full w-full flex justify-center gap-5 flex-wrap md:flex-wrap'>

					<Tooltip title='Iniciar Producción'>
						<button className='w-16 rounded-md h-12 bg-amber-600 flex items-center justify-center p-2 hover:scale-105'>
							<FaPlay style={{ fontSize: 25 }}/>
						</button>
					</Tooltip>

					<Tooltip title='Pausar Producción'>
						<button className='w-16 rounded-md h-12 bg-blue-500 flex items-center justify-center p-2 hover:scale-105'>
							<FaPause style={{ fontSize: 25 }}/>
						</button>
					</Tooltip>

					<Tooltip title='Terminar Producción'>
						<button className='w-16 rounded-md h-12 bg-red-500 flex items-center justify-center p-2 hover:scale-105'>
							<FaStop style={{ fontSize: 25 }}/>
						</button>
					</Tooltip>
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
									<HeroEye style={{ fontSize: 35 }}/>
								</button>
							</Tooltip>
						</Link>
						

						<ModalRegistro
							open={edicionModalStatus}
							setOpen={setEdicionModalStatus}
							title='Edición Productor'
							textTool='Editar'
							size={1000}
							width={`w-16 px-1 h-12 ${isDarkTheme ? 'bg-[#c9429c] hover:bg-[#ff84d6]' : 'bg-[#c9429c] hover:bg-[#ff84d6] text-white'} hover:scale-105`}
							icon={<HeroPencilSquare style={{ fontSize: 35 }} />}
						>
							Hola
							{/* <FormularioEdicionProductores refresh={refresh} setOpen={setEdicionModalStatus} id={id} /> */}
						</ModalRegistro>

						<Tooltip title='Detalle envases del lote en Programa'>
							<button className='w-16 rounded-md h-12 bg-red-500 flex items-center justify-center p-2 hover:scale-105'>
								<FaFilePdf style={{ fontSize: 25 }} />
							</button>
						</Tooltip>

						<Tooltip title='Documento de entrada a proceso'>
							<button className='w-16 rounded-md h-12 bg-red-500 flex items-center justify-center p-2 hover:scale-105'>
								<FaFilePdf style={{ fontSize: 25 }} />
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
		<PageWrapper name='ListaProgramas'>
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
					<Link to='/app/produccion/registro-programa/'>
						<Tooltip title='Detalle envases del lote en Programa'>
							<button className='w-full rounded-md h-12 bg-blue-800 flex items-center justify-center p-2 hover:scale-105 px-2'>
								<span className='text-lg '>Registrar Programa de Producción</span>
							</button>
						</Tooltip>
					</Link>
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
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

						<CardHeaderChild className='w-[20rem]'>
							<ModalRegistro
								open={informePro}
								setOpen={setInformePro}
								title='Informe de Producción'
								icon={
								<div className='flex items-center gap-1.5'>
									<FaFilePdf style={{ fontSize: 20}}/>
									<span className='text-md font-semibold'>Generar Informe de Producción</span>
								</div>
								}
								width={`w-full md:w-full px-4 py-3 ${isDarkTheme ? 'bg-red-700 hover:bg-red-600' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
								size={800}
							>
								<FormularioInformeProduccion setOpen={setInformePro}/>
							</ModalRegistro>
						</CardHeaderChild>

						<CardHeaderChild className='w-[23.5rem]'>
							<ModalRegistro
								open={informeKgOp}
								setOpen={setInformeinformeKgOp}
								title='Informe de Kilos por Operario'
								icon={
								<div className='flex items-center gap-1.5'>
									<FaFilePdf style={{ fontSize: 20}}/>
									<span className='text-md font-semibold'>Generar Informe de Kilos por Operario</span>
								</div>
								}
								width={`w-full md:w-full px-4 py-3 ${isDarkTheme ? 'bg-red-700 hover:bg-red-600' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
								size={700}
							>
								<FormularioKilosOperarios setOpen={setInformePro}/>
							</ModalRegistro>
						</CardHeaderChild>

						<CardHeaderChild className='w-[24rem]'>
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
								width={`w-full md:w-full px-4 py-3 ${isDarkTheme ? 'bg-red-700 hover:bg-red-600' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
								size={500}
							>
								<FormularioResumen setOpen={setInformePro}/>
							</ModalRegistro>
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

