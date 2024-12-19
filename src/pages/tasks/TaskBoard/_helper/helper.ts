import { Task } from '../../../../types/app/Tasks.type';

/**
 * Reordena una lista de tareas moviendo el elemento en 'startIndex' a la posición 'endIndex'.
 * @param list Lista original de tareas
 * @param startIndex Índice inicial del elemento a mover
 * @param endIndex Índice final al que se mueve el elemento
 * @returns Lista de tareas reordenadas
 */
export const reorder = (list: Task[], startIndex: number, endIndex: number): Task[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Mueve un ítem desde una lista fuente (source) a una lista destino (destination).
 * @param source Lista de tareas origen
 * @param destination Lista de tareas destino
 * @param droppableSource Datos del droppable origen {index, droppableId}
 * @param droppableDestination Datos del droppable destino {index, droppableId}
 * @returns Un objeto que mapea el droppableId a la lista correspondiente tras el movimiento
 */
export const move = (
  source: Task[],
  destination: Task[],
  droppableSource: { index: number; droppableId: string },
  droppableDestination: { index: number; droppableId: string }
): { [key: string]: Task[] } => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  return {
    [droppableSource.droppableId]: sourceClone,
    [droppableDestination.droppableId]: destClone,
  };
};
