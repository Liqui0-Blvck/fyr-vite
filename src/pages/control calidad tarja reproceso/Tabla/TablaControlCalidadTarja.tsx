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
import { TControlCalidadTarja, TEnvases, TProductor } from '../../../types/registros types/registros.types';
import ModalRegistro from '../../../components/ModalForm.modal';
import useDarkMode from '../../../hooks/useDarkMode';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';
import { Tooltip } from 'antd';
import { useAuth } from '../../../context/authContext';
import { useAuthenticatedFetch } from '../../../hooks/useAxiosFunction';
import { cargolabels } from '../../../utils/generalUtils';
import { variedadFilter } from '../../../constants/options.constants';
import { GiTestTubes } from 'react-icons/gi';
import FormularioControlCalidadTarjaResultante from '../../programa reproceso/Formularios Produccion/Formulario Control Calidad Tarja/FormularioControlCalidadTarja';


const columnHelper = createColumnHelper<TControlCalidadTarja>();




interface IControlProps {
	data: TControlCalidadTarja[] | []
	refresh: Dispatch<SetStateAction<boolean>>
}

const TablaControlCalidadTarja: FC<IControlProps> = ({ data, refresh }) => {
	const { perfilData } = useAuth()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
	const [modalStatus, setModalStatus] = useState<boolean>(false);
	const [detalleModalStatus, setDetalleModalStatus] = useState<boolean>(false);
	const { isDarkTheme } = useDarkMode()
	const { authTokens, validate } = useAuth()
	const base_url = process.env.VITE_BASE_URL_DEV
	
	

	

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

	const updateEstadoLote = async (id: number, estado: string, setOpen: Dispatch<SetStateAction<boolean>>) => {
    console.log(estado);
    const res = await fetch(`${base_url}/api/estado-update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens?.access}` 
      },
      body: JSON.stringify({  
        estado_recepcion: estado
      })
    });

    if (res.ok) {
			setOpen(false)
			refresh(true)

    } else {
      console.log("Errores sobre errores");
    }
  }




	const columns = [
		columnHelper.accessor('tarja', {
			cell: (info) => (
				<div className='font-bold '>{`${info.row.original.tarja}`}</div>
			),
			header: 'N° Tarja',
		}),
		columnHelper.accessor('codigo_tarja', {
			cell: (info) => (
				<div className='font-bold '>{`${info.row.original.codigo_tarja}`}</div>
			),
			header: 'Código Tarja',
		}),
		columnHelper.accessor('variedad', {
			cell: (info) => {
				const variedad = info.row.original.variedad;
				const variedadLabel = variedad ? variedadFilter.find(variety => variety.value === variedad)?.label : 'No disponible';
				return <div className='font-bold'>{variedadLabel ? variedadLabel : 'No disponible'}</div>;
			},
			header: 'Variedad',
		}),
		columnHelper.accessor('estado_cc_label', {
			cell: (info) => (
				<div className='font-bold'>{`${info.row.original.estado_cc_label}`}</div>
			),
			header: 'Estado',
		}),
		columnHelper.accessor('fecha_creacion', {
			cell: (info) => (
				<div className='font-bold'>{`${format(info.row.original.fecha_creacion, {date: 'long', time: 'short'}, 'es')}`}</div>
			),
			header: 'Fecha Creación',
		}),
		columnHelper.display({
			id: 'actions',
			cell: (info) => {
				const [edicionModalStatus, setEdicionModalStatus] = useState<boolean>(false);
				const [calibracionModalStatus, setCalibracionModalStatus] = useState<boolean>(false);
				const id = info.row.original.id;


				return (
					<div className='h-full w-full flex justify-center gap-2 flex-wrap'>
						<Link to={`/app/tarjas-cc-reproceso/${info.row.original.tarja}`}
							className={`w-16 px-1 h-12 
								${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'}
								 hover:scale-105 rounded-md flex items-center justify-center`}>
							<HeroEye style={{ fontSize: 32 }} />
						</Link>

						{
							cargolabels(perfilData).includes('CDC Jefatura', 'Administrador') && info.row.original.estado_cc !== '3'
								? (
									<ModalRegistro
											open={calibracionModalStatus}
											setOpen={setCalibracionModalStatus}
											title='Calibración Tarja Reproceso'
											textTool='Calibrar Tarja Reproceso'
											size={900}
											width={`w-16 h-12 dark:bg-[#7124b5] dark:hover:bg-[#8647bc] bg-[#7124b5] hover:bg-[#8647bc] text-white hover:scale-105`}
											icon={<GiTestTubes style={{ fontSize: 25 }}
											/>}
										>
											<FormularioControlCalidadTarjaResultante refresh={refresh} isOpen={setCalibracionModalStatus} id_lote={id} />
										</ModalRegistro>
									)
								: null
						}

						{
							cargolabels(perfilData).includes('CDC Jefatura', 'Administrador')
								? (
									<ModalRegistro
										open={edicionModalStatus}
										setOpen={setEdicionModalStatus}
										title='Edición Comercializador'
										textTool='Editar'
										size={500}
										width={`w-16 px-1 h-12 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
										icon={<HeroPencilSquare style={{ fontSize: 25 }}
										/>}
									>
										hola
										{/* <FormularioEdicionControlCalidad  id_lote={info.row.original.id} refresh={refresh} setOpen={setEdicionModalStatus} updateEstado={updateEstadoLote}/> */}
									</ModalRegistro>
									)
								: null
						}

						{
							cargolabels(perfilData).includes('CDC Jefatura', 'Administrador')
								? (
									<Tooltip title='Eliminar'>
										<button onClick={async () => await asisteDelete(id)} type='button' className={`w-16 px-1 h-12 bg-red-800 ${isDarkTheme ? 'text-white' : 'text-white'} rounded-md flex items-center justify-center hover:scale-105`}>
											<HeroXMark style={{ fontSize: 25 }} />
										</button>
									</Tooltip>
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
		<PageWrapper name='Lista Control Calidad Tarjas Reproceso'>
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
							<CardTitle>Controles de Calidad Tarjas Reproceso</CardTitle>
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

export default TablaControlCalidadTarja;
