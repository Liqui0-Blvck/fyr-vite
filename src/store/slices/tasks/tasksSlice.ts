import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tasks } from '../../../mocks/Data'; // Asegurarnos que 'tasks' concuerde con el tipo Task
import { Task } from '../../../types/app/Tasks.type';
import { move, reorder } from '../../../pages/tasks/TaskBoard/_helper/helper';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: tasks, // Asegurarnos que 'tasks' sea un array de Task
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    /**
     * Crea una nueva tarea.
     */
    createTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },

    /**
     * Reemplaza la lista completa de tareas (por ejemplo, tras una carga desde el servidor).
     */
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },

    /**
     * Actualiza una tarea existente, buscándola por su id.
     */
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },

    /**
     * Elimina una tarea por ID.
     */
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },

    /**
     * Establece el estado de carga.
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Establece el error en la carga o manipulación de tareas.
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Reordena las tareas dentro de la misma columna.
     * Se asume que las tareas en 'columnId' están filtradas previamente
     * o se aplica lógica adicional para identificar las afectadas.
     */
    reorderTaskList: (
      state,
      action: PayloadAction<{ columnId: string; startIndex: number; endIndex: number }>
    ) => {
      const { columnId, startIndex, endIndex } = action.payload;
      const filteredTasks = state.tasks.filter(task => task.columnId === columnId);
      const otherTasks = state.tasks.filter(task => task.columnId !== columnId);

      const reordered = [...otherTasks, ...reorder(filteredTasks, startIndex, endIndex)];
      state.tasks = reordered;
    },

    /**
     * Mueve una tarea de una columna a otra.
     * Este reducer espera que se le pasen los IDs de las columnas y los índices correspondientes.
     */
    moveTaskBetweenColumns: (
      state,
      action: PayloadAction<{
        sourceColumnId: string;
        destinationColumnId: string;
        droppableSourceIndex: number;
        droppableDestinationIndex: number;
      }>
    ) => {
      const { sourceColumnId, destinationColumnId, droppableSourceIndex, droppableDestinationIndex } = action.payload;

      const sourceTasks = state.tasks.filter(task => task.columnId === sourceColumnId);
      const destinationTasks = state.tasks.filter(task => task.columnId === destinationColumnId);
      const otherTasks = state.tasks.filter(task => task.columnId !== sourceColumnId && task.columnId !== destinationColumnId);

      const moved = move(
        sourceTasks,
        destinationTasks,
        { index: droppableSourceIndex, droppableId: sourceColumnId },
        { index: droppableDestinationIndex, droppableId: destinationColumnId }
      );

      // Actualizar columnId en las tareas movidas
      const updatedSource = moved[sourceColumnId].map(task => ({ ...task, columnId: sourceColumnId }));
      const updatedDestination = moved[destinationColumnId].map(task => ({ ...task, columnId: destinationColumnId }));

      state.tasks = [...otherTasks, ...updatedSource, ...updatedDestination];
    },
  },
});

export const {
  createTask,
  setTasks,
  updateTask,
  deleteTask,
  setLoading,
  setError,
  reorderTaskList,
  moveTaskBetweenColumns,
} = tasksSlice.actions;

export default tasksSlice.reducer;
