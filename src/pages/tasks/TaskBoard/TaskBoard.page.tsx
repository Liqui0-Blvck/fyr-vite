import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'; 
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import ColumnsPartial from './_partial/Columns.partial';
import BoardPartial from './_partial/Board.partial';
import Subheader, {
  SubheaderLeft,
  SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/form/Input';
import FieldWrap from '../../../components/form/FieldWrap';
import { move, reorder } from './_helper/helper';
import { Task } from '../../../types/app/Tasks.type';
import TColumnsData, { TColumnData } from './_types/columns.type';
import { firestoreService } from '../../../config/firebase.config';
import Button from '../../../components/ui/Button';
import Modal, { ModalBody, ModalHeader } from '../../../components/ui/Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import Loading from '../../../components/Loading';

const ProjectBoardPage = () => {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [columnsData, setColumnsData] = useState<TColumnsData>({});
  const [openModalColumns, setOpenModalColumns] = useState<boolean>(false);
  const reduxTasks = useSelector((state: RootState) => state.task.tasks);

  // Estado de carga simulado
  const [loading, setLoading] = useState(true);

  // Simular un retraso de carga de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Cargar columnas desde Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(firestoreService, 'columns'), (snapshot) => {
      const colsArr: TColumnData[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as TColumnData & { order?: number };
        colsArr.push(data);
      });
  
      // Ordenar las columnas por el campo 'order'
      colsArr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  
      // Transformar a TColumnsData (un map por id)
      const cols: TColumnsData = {};
      colsArr.forEach((col) => {
        cols[col.id] = col;
      });
  
      setColumnsData(cols);
    });
  
    return () => unsub();
  }, []);
  

  // Cargar tareas desde Firestore y agrupar por columnId
  useEffect(() => {
    const unsub = onSnapshot(collection(firestoreService, 'tasks'), (snapshot) => {
      const tempTasks: Record<string, Task[]> = {};
  
      if (snapshot.empty) {
        // Si no hay documentos en Firestore, usar las tareas del slice de Redux
        reduxTasks.forEach((task) => {
          const colId = task.columnId ?? 'noColumn';
          if (!tempTasks[colId]) {
            tempTasks[colId] = [];
          }
          tempTasks[colId].push(task);
        });
      } else {
        // Si hay documentos en Firestore, mapearlos normalmente
        snapshot.forEach((doc) => {
          const data = doc.data() as Task;
          const colId = data.columnId ?? 'noColumn';
          
          if (!tempTasks[colId]) {
            tempTasks[colId] = [];
          }
          tempTasks[colId].push(data);
        });
      }
  
      // Asegurar que cada columna del columnsData tenga un array aunque sea vacío
      Object.keys(columnsData).forEach((colId) => {
        if (!tempTasks[colId]) {
          tempTasks[colId] = [];
        }
      });
  
      // Aplicar filtro si existe
      if (globalFilter) {
        setTasks(filterTasksByKeyword(tempTasks, globalFilter));
      } else {
        setTasks(tempTasks);
      }
    });
  
    return () => unsub();
  }, [columnsData, globalFilter, reduxTasks]);
  

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const ITEMS = reorder(tasks[source.droppableId], source.index, destination.index);
      setTasks({ ...tasks, [source.droppableId]: ITEMS });
    } else {
      const RESULT = move(
        tasks[source.droppableId],
        tasks[destination.droppableId],
        source,
        destination,
      );
      setTasks({ ...tasks, ...RESULT });

      // Actualizar la columna de la tarea en Firestore
      const movedTask = RESULT[destination.droppableId][destination.index];
      const taskRef = doc(firestoreService, 'tasks', movedTask.id);
      await updateDoc(taskRef, { columnId: destination.droppableId });
    }
  };

  function filterTasksByKeyword(tasksDB: Record<string, Task[]>, keyword: string): Record<string, Task[]> {
    const filteredTasks: Record<string, Task[]> = {};
    const kw = keyword.toLowerCase();

    for (const column in tasksDB) {
      filteredTasks[column] = tasksDB[column].filter((task) => {
        const titleMatch = task.title.toLowerCase().includes(kw);
        const descriptionMatch = (task.description ?? '').toLowerCase().includes(kw);
        const tagsMatch = task.tags?.some((tag) => tag.toLowerCase().includes(kw)) ?? false;
        return titleMatch || descriptionMatch || tagsMatch;
      });
    }

    return filteredTasks;
  }

  useEffect(() => {
    // Si ya teníamos tareas cargadas, filtrarlas en el cliente
    if (globalFilter && Object.keys(tasks).length > 0) {
      setTasks(filterTasksByKeyword(tasks, globalFilter));
    } else if (!globalFilter && Object.keys(columnsData).length > 0) {
      // Recargar desde la base original (se hace automáticamente por el onSnapshot)
    }
  }, [globalFilter]);

  return (
    <PageWrapper name='Tablero Tareas'>
      {
        openModalColumns && (
          <Modal
            isOpen={openModalColumns}
            setIsOpen={setOpenModalColumns}
          >
            <ModalHeader>
              <h2>Añadir Fase o Columna</h2>
            </ModalHeader>
            <ModalBody>
              <div>
                Hola
              </div>
            </ModalBody>
          </Modal>
        )
      }
      <Subheader>
        <SubheaderLeft>
          <FieldWrap
            className='w-full'
            firstSuffix={<Icon className='mx-2' icon='HeroFunnel' />}
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
            }
          >
            <Input
              id='example'
              name='example'
              placeholder='Filter by keyword or by field'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='w-full'
            />
          </FieldWrap>
        </SubheaderLeft>
        <SubheaderRight>
         <Button
          variant='solid'
          onClick={() => {
            setOpenModalColumns(true);
          }}
          >
            Añadir Fase o Columna
         </Button>
        </SubheaderRight>
      </Subheader>
      <Container breakpoint={null} className='h-full max-w-full overflow-auto'>
        {
          loading 
            ? <Loading />
            : (
              <DragDropContext onDragEnd={onDragEnd}>
                <BoardPartial>
                  <ColumnsPartial
                    columnsData={columnsData}
                    tasksData={tasks}
                    setTasksData={setTasks}
                  />
                </BoardPartial>
              </DragDropContext>
            )
        }
      </Container>
    </PageWrapper>
  );
};

export default ProjectBoardPage;
