import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import toast from 'react-hot-toast'
import { Link as Ln } from 'react-router-dom'
import { Skeleton } from '@mui/material';
import { format } from '@formkit/tempo';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}



const headCells = [
  {
    id: 'rut',
    numeric: false,
    disablePadding: false,
    label: 'Rut',
  },  
  {
    id: 'nombre',
    numeric: false,
    disablePadding: false,
    label: 'Nombre',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'telefono',
    numeric: false,
    disablePadding: false,
    label: 'Telefono',
  },
  {
    id: 'numero_contrato',
    numeric: false,
    disablePadding: false,
    label: 'N° Contrato',
  },
  {
    id: 'direccion',
    numeric: false,
    disablePadding: false,
    label: 'Dirección',
  },
  {
    id: 'fecha_creacion',
    numeric: false,
    disablePadding: false,
    label: 'Fecha_creacion',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, handleDeleteClick, selected } = props;

  return (
    <Toolbar
      sx={{
        display: 'flex',
        gap: 2,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
      }}
      className={`${numSelected > 0 ? 'bg-[#f4f7fc]' : ''} overflow-x-scroll py-1`}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} Seleccionado{numSelected > 1 ? 's' : ''}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Productores
        </Typography>
      )}
      
      {
        numSelected === 0
          ? (

              <Ln to={`/app/registro-productores`}>
                <div className='w-34 md:w-48 lg:w-52 p-1.5 border border-[#224871] rounded-md bg-[#f4f7fc] hover:bg-[#224871] hover:text-white transition-all ease-in flex items-center justify-center text-center text-[#224871]'>
                  <span className='font-semibold'>Agregar Productores</span>
                </div>
              </Ln>

            )
          : null
      }

      {
        numSelected <= 1 && numSelected > 0 
          ? (
            <> 
              <Tooltip title='Detalle'>
                <Ln to={`/app/productores/${selected}`}>
                  <button type='button' className='bg-[#224871] hover:bg-[#224871c0] px-5 py-1.5 rounded-md text-white hover:scale-105'>
                    Detalles
                  </button>
                </Ln>
              </Tooltip>
              <Tooltip title='Editar'>
                <Ln to={`/app/edicion-productores/${selected}`}>
                  <button type='button' className='bg-[#224871] hover:bg-[#224871b0] px-5 py-1.5 rounded-md text-white hover:scale-105'>
                    Editar
                  </button>
                </Ln>
              </Tooltip>
              
            </>
            )
          : null
      }

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <button type='button' onClick={handleDeleteClick} className='bg-red-800 hover:bg-red-700 px-5 py-1.5 rounded-md text-white hover:scale-105'>
            Eliminar
          </button>
        </Tooltip>
      ) : null 
      }
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function TablaProductores({ data, setData, token, loading }) {
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('fecha_creacion');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const base_url = import.meta.env.VITE_BASE_URL

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleDeleteClick = async () => {
    try {

      const response = await fetch(`${base_url}/api/item-delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selected }),
      });

      if (response.ok){
        toast.success('Item eliminado con exito')
      } else {
        toast.error('No se ha podido eliminar')
      }

      const newData = data.filter(item => !selected.includes(item.id));
      setData(newData);

      setSelected([]);
  
    } catch (error) {
      console.error("Error al eliminar elementos:", error);

    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, data],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleDeleteClick={handleDeleteClick}
          selected={selected}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750, 
            '& thead th:nth-child(1)': {
              width: '20px',
            },
            '& thead th:nth-child(2)': {
              textAlign: 'left',
              width: '12%',
            },
            '& tr > *:nth-child(3)': { 
            textAlign: 'left',
            width: '12%'
            },
            '& tr > *:nth-child(4)': { 
              textAlign: 'left',
              width: '12%'
            },
            '& tr > *:nth-child(5)': { 
              textAlign: 'left',
              width: '12%'
            },
            '& tr > *:nth-child(6)': { 
              textAlign: 'left',
              width: '13%'
            },
            '& tfoot > td': {
              width: '100%'
            }}}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    {loading ? (
                      <TableCell colSpan="6">
                        <Skeleton className='w-full'/>
                      </TableCell>
                    ) : (
                      <>
                        <TableCell>{row.rut_productor}</TableCell>
                        <TableCell className='text-center text-clip overflow-hidden'>{row.nombre}</TableCell>
                        <TableCell className='text-clip overflow-hidden'>{row.email}</TableCell>
                        <TableCell className='text-clip overflow-hidden'>{row.telefono}</TableCell>
                        <TableCell className='text-clip overflow-hidden'><p className='relative left-7'>{row.numero_contrato}</p></TableCell>
                        <TableCell className='text-clip overflow-hidden'>{row.direccion}</TableCell>

                        <TableCell className='text-clip overflow-hidden'>{format(row.fecha_creacion, { date: 'short', time: 'short' })}</TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component=""
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}