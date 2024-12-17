import { Strategy } from '../../../../types/app/Strategies.type';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody, CardFooter } from '../../../../components/ui/Card';
import TableTemplate from '../../../../templates/common/TableParts.template';
import { useAppSelector } from '../../../../store/hook';
import { RootState } from '../../../../store/rootReducer';


const StrategiesList = () => {
  const { strategies } = useAppSelector((state: RootState) => state.client)



  const columnHelper = createColumnHelper<Strategy>();
  const columns = [
    columnHelper.accessor('name', {
      cell: (info) => (
        <div>
          <span >{info.row.original.name}</span>
        </div>
      ),
      header: 'Nombre de la estrategia',
    }),
    columnHelper.accessor('expectedReturn', {
      cell: (info) => (
        <div>
          <span >{info.row.original.expectedReturn}%</span>
        </div>
      ),
      header: 'Rentabilidad esperada',
    }),
    columnHelper.accessor('status', {
      cell: (info) => (
        <div>
          <span >{info.row.original.status}</span>
        </div>
      ),
      header: 'Estado',
    }),
  ]

  const table = useReactTable({
		data: strategies,
		columns,
		getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
	});

  return (
    <Container>
      <Card>
        <CardBody className={`overflow-auto`}>
          <TableTemplate 
            className='table-fixed max-md:min-w-[70rem]' 
            table={table}
            hasFooter={false}
          />
        </CardBody>
      </Card>
    </Container>
  )
}

export default StrategiesList
