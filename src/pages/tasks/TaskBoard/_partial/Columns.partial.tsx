import React, { FC } from 'react';
import classNames from 'classnames';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';
import ColumnCardWrapperPartial from './ColumnCardWrapper.partial';
import TColumnsData, { TColumnData } from '../_types/columns.type';
import Button from '../../../../components/ui/Button';
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../../../../components/ui/Dropdown';
import { Task } from '../../../../types/app/Tasks.type'; // Importar el tipo Task
import Badge from '../../../../components/ui/Badge';
import Icon from '../../../../components/icon/Icon';

interface IColumnsPartialProps {
  // tasksData es ahora un objeto indexado por columnKey que almacena arrays de Task
  tasksData: Record<string, Task[]>;
  columnsData: TColumnsData;
  // setTasksData actualiza el estado con la misma estructura de tasksData
  setTasksData: (tasks: Record<string, Task[]>) => void;
}

const ColumnsPartial: FC<IColumnsPartialProps> = ({ tasksData, columnsData, setTasksData }) => {
  return (
    <>
      {Object.keys(columnsData).map((columnKey) => {
        const columnData: TColumnData = columnsData[columnKey];
        const tasksInColumn = tasksData[columnKey] || [];

        return (
          <div
            key={columnKey}
            data-component-name='ColumnsPart'
            className='flex flex-col rounded-2xl border border-zinc-300/25 p-4 pb-0 dark:border-zinc-800/50'
          >
            <div className={classNames(`w-[20rem] xl:w-[22rem] 2xl:w-[28rem]`)}>
              <div className='mb-4 flex basis-full items-center'>
                <div className='flex grow items-center gap-2'>
                  <Icon icon={columnData.icon} size='text-2xl' />
                  <span className='text-2xl font-semibold'>{columnData.title}</span>
                  <Badge
                    variant='outline'
                    className='border-transparent px-2'
                    rounded='rounded-full'
                  >
                    {tasksInColumn.length}
                  </Badge>
                </div>
                <div>
                  <Dropdown>
                    <DropdownToggle hasIcon={false}>
                      <Button icon='HeroEllipsisVertical' />
                    </DropdownToggle>
                    <DropdownMenu placement='bottom-end'>
                      <div className='px-4 text-sm font-bold'>Item actions</div>
                      <DropdownItem icon='HeroArchiveBox'>Archive All</DropdownItem>
                      <DropdownItem icon='HeroTrash'>Delete All</DropdownItem>
                      <div className='border-t-2 border-zinc-500/25 px-4 py-2 text-sm font-bold dark:border-zinc-500/50'>
                        Column actions
                      </div>
                      <DropdownItem icon='HeroSquaresPlus'>Set column limit</DropdownItem>
                      <DropdownItem icon='HeroPencil'>Edit details</DropdownItem>
                      <DropdownItem icon='HeroEyeSlash'>Hide from view</DropdownItem>
                      <DropdownItem icon='HeroTrash'>Delete</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>

              <Droppable droppableId={columnKey}>
                {(providedDroppable: DroppableProvided, snapshotDroppable: DroppableStateSnapshot) => (
                  <div
                    data-component-name='ColumnsPart/Droppable'
                    className={classNames('rounded-xl', {
                      'border border-dashed border-blue-500 bg-blue-500/10':
                        snapshotDroppable.isDraggingOver,
                    })}
                    {...providedDroppable.droppableProps}
                    ref={providedDroppable.innerRef}
                  >
                    <ColumnCardWrapperPartial
                      columnKey={columnKey}
                      columnsData={columnsData}
                      tasksData={tasksData}
                      setTasksData={setTasksData}
                    />
                    <div className='py-2'>{providedDroppable.placeholder}</div>
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ColumnsPartial;
