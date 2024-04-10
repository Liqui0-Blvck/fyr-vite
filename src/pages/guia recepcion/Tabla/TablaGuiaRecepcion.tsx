import { Dispatch, FC, SetStateAction, useState } from 'react';
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
import { useAuth } from '../../../context/authContext';
import { format } from "@formkit/tempo"
import { TGuia } from "../../../types/registros types/registros.types"
import ModalRegistro from '../../../components/ModalRegistro';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { Tooltip } from 'antd';
import useDarkMode from '../../../hooks/useDarkMode';
import { FaFilePdf } from 'react-icons/fa6';
import { cargolabels } from '../../../utils/generalUtils';



const columnHelper = createColumnHelper<TGuia>();


interface IGuiaProps {
	data: TGuia[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}



const TablaGuiaRecepcion: FC<IGuiaProps> = ({ data, refresh }) => {
	const { authTokens, perfilData } = useAuth()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const { isDarkTheme } = useDarkMode();

	const cargosPermitidos = ['Recepcionista', 'Finanzas']

	const role = {
    username: 'Nicolas',
    cargo: 'Recepcionista',
  }


	const asisteDelete = async (id: number) => {
		const base_url = process.env.VITE_BASE_URL_DEV
		const response = await fetch(`${base_url}/api/recepcionmp/${id}/`, {
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

	const editLinkProductor = `/app/productor/`
	const createLinkProductor = `/app/registro-guia-recepcion/`

	const columns = [
		columnHelper.accessor('id', {
			cell: (info) => (
					<div className='font-bold w-20'>{`${info.row.original.id}`}</div>
			),
			header: 'N° Guia '
		}),
		columnHelper.accessor('camion', {
			cell: (info) => (
					<div className='font-bold '>{`${info.row.original.nombre_camion}`}</div>
			),
			header: 'Camión',
		}),
		columnHelper.accessor('camionero', {
			cell: (info) => (
					<div className='font-bold truncate'>{`${info.row.original.nombre_camionero}`}</div>
			),
			header: 'Conductor',
		}),
		columnHelper.accessor('comercializador', {
			cell: (info) => (
					<div className='font-bold'>{`${info.row.original.nombre_comercializador}`}</div>
			),
			header: 'Comercializador',
		}),
		columnHelper.accessor('lotesrecepcionmp', {
			cell: (info) => (
					<div className='font-bold'>{`${info.row.original.lotesrecepcionmp.length}`}</div>
			),
			header: 'Lotes',
		}),
		columnHelper.accessor('estado_recepcion', {
			cell: (info) => (
					<div className='font-bold'>{`${info.row.original.estado_recepcion_label}`}</div>
			),
			header: 'Estado',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const id = info.row.original.id;
				const [edicionModalStatus, setEdicionModalStatus] = useState(false);

				return (
					<div className={`h-full w-full flex gap-2 ${info.row.original.estado_recepcion === '4' ? 'flex-wrap justify-center' : 'flex-nowrap justify-center'}  `}>
						<Link to={`/app/recepcionmp/${info.row.original.id}`}
							className={`w-14 lg:w-14 px-1 h-12
								${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'}
								 hover:scale-105 rounded-md flex items-center justify-center`}>
							<HeroEye style={{ fontSize: 25 }} />
						</Link>

						

						{
							cargolabels(perfilData).includes('RecepcionMP', 'Administrador')
								? (
									<>
										<Link to={`/app/edicion-guia-recepcion/${info.row.original.id}`}
											className={`w-14 lg:w-14 md:14 h-12 px-1
												${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'}
												hover:scale-105 rounded-md flex items-center justify-center`}>
											<HeroPencilSquare style={{ fontSize: 25 }} />
										</Link>
										<Tooltip title='Eliminar'>
											<button onClick={async () => await asisteDelete(id)} type='button' className={`w-14 lg:w-14 md:14 px-1 h-12 bg-red-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
												<HeroXMark style={{ fontSize: 25 }} />
											</button>
										</Tooltip>
									</>
									)
								: null
						}
						{
							info.row.original.estado_recepcion === '4'
								? (
									<Link to={`/app/pdf-guia-recepcion/${info.row.original.id}`}>
										<Tooltip title='PDF'>
											<div className={`w-14 lg:w-14 md:14 px-1 h-12 bg-red-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
												<FaFilePdf style={{ fontSize: 25 }} />
											</div>
										</Tooltip>
									</Link>
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
		<PageWrapper name='Lista Guia Recepcion Materia Prima'>
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
							placeholder='Busca la guia...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				{
					cargolabels(perfilData).includes('RecepcionMP', 'Administrador')
						? (
							<SubheaderRight>
								<Link to={`${createLinkProductor}`}>
									<Button variant='solid' icon='HeroPlus'>
										Agregar Guia Recepción
									</Button>
								</Link>
							</SubheaderRight>
							)
						: null
				}
			</Subheader>
			<Container breakpoint={null} className='w-full overflow-auto'>
				<Card className='h-full w-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Guias de Recepción</CardTitle>
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
						<TableTemplate className='table-fixed max-md:min-w-[80rem]' table={table} />
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default TablaGuiaRecepcion;
