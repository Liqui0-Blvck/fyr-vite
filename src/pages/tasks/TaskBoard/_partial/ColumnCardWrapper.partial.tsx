import React, { FC } from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import classNames from 'classnames';
import ColumnCardPartial from './ColumnCard.partial';
import TColumnsData from '../_types/columns.type';
import Card from '../../../../components/ui/Card';
import { Task } from '../../../../types/app/Tasks.type';

interface IColumnCardWrapperPartialProps {
  columnKey: string;
  columnsData: TColumnsData;
  // `tasksData` es ahora un objeto que asigna keys (columnKey) a arrays de Task.
  tasksData: Record<string, Task[]>;
  // `setTasksData` actualiza el estado con la misma estructura.
  setTasksData: (tasks: Record<string, Task[]>) => void;
}

const ColumnCardWrapperPartial: FC<IColumnCardWrapperPartialProps> = ({
  columnKey,
  // columnsData,
  tasksData,
  setTasksData,
}) => {
  // Extraemos las tareas correspondientes a la columna dada.
  const cardsInTheColumn: Task[] = tasksData[columnKey] || [];

  return (
    <>
      {cardsInTheColumn.map((card, index) => (
        <Draggable key={card.id} draggableId={card.id} index={index}>
          {(providedDraggable: DraggableProvided, snapshotDraggable: DraggableStateSnapshot) => (
            <Card
              data-component-name='ColumnCardWrapperPart'
              className={classNames('shadow-sm [&:not(:nth-last-child(2))]:mb-4', {
                'border border-blue-500': snapshotDraggable.isDragging,
              })}
              ref={providedDraggable.innerRef}
              {...providedDraggable.draggableProps}
              {...providedDraggable.dragHandleProps}
              style={providedDraggable.draggableProps.style}
            >
              <ColumnCardPartial
                columnKey={columnKey}
                task={card}
                tasksData={tasksData}
                setTasksData={setTasksData}
                index={index}
              />
            </Card>
          )}
        </Draggable>
      ))}
    </>
  );
};

export default ColumnCardWrapperPartial;
