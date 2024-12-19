import React, { FC, useMemo, useState } from 'react';
import { Editable, Slate, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import Avatar from '../../../../components/Avatar';
import Icon from '../../../../components/icon/Icon';
import TaskEditPartial from './TaskEdit.partial';
import { Task } from '../../../../types/app/Tasks.type';

interface IColumnCardPartialProps {
  columnKey: string;
  task: Task;
  tasksData: Record<string, Task[]>; 
  setTasksData: (tasks: Record<string, Task[]>) => void;
  index: number;
}

const ColumnCardPartial: FC<IColumnCardPartialProps> = ({
  columnKey,
  task,
  tasksData,
  setTasksData,
  index,
}) => {
  const [editPanelStatus, setEditPanelStatus] = useState<boolean>(false);
  const editor = useMemo(() => withReact(createEditor()), []);

  // Preparar el contenido de la descripción.
  // Asumimos que task.description es un JSON string de Slate. Si no fuera así, adaptar la lógica.
  let initialSlateValue: Descendant[] = [];
  if (task.description) {
    try {
      initialSlateValue = JSON.parse(task.description) as Descendant[];
    } catch {
      // Si no se puede parsear, usar un bloque de texto plano.
      initialSlateValue = [{ type: 'paragraph', children: [{ text: task.description }] }];
    }
  } else {
    // Si no hay descripción, usar un bloque vacío.
    initialSlateValue = [{ type: 'paragraph', children: [{ text: '' }] }];
  }

  // Preparar el avatar del usuario asignado.
  // task.assignedTo podría no contener información detallada del usuario, solo userId y role.
  const assignedUserId = task.assignedTo?.userId || 'Sin asignar';

  return (
    <>
      <CardHeader>
        <CardHeaderChild>
          <CardTitle className='text-xl'>
            <div onClick={() => setEditPanelStatus(true)} role='presentation'>
              <div>{task.title}</div>
              {/* Antes se mostraba "subtitle", se elimina por no existir en Task */}
            </div>
          </CardTitle>
        </CardHeaderChild>
        <CardHeaderChild>
          <Avatar
            // No tenemos imagen del usuario, así que no pasamos `src`.
            // Usamos el userId como fallback para el nombre.
            name={assignedUserId}
            className='!w-8'
          />
        </CardHeaderChild>
      </CardHeader>

      <CardBody>
        <div className='flex flex-wrap gap-4'>
          <div className='flex gap-2'>
            {/* Badge para adjuntos si existen */}
            {!!task?.attachments?.length && (
              <Badge
                variant='outline'
                rounded='rounded-full'
                className='border-transparent'
              >
                <small className='flex items-center gap-2'>
                  <Icon icon='HeroPaperClip' />
                  {task.attachments.length}
                </small>
              </Badge>
            )}
            {/* Campos como items, label, etc. no existen, se eliminan */}
          </div>

          {/* El campo img ya no existe, se elimina el fragmento de código que lo mostraba */}

          <div className='basis-full'>
            <Slate editor={editor} initialValue={initialSlateValue}>
              <Editable readOnly placeholder='Enter some plain text...' />
            </Slate>
          </div>
        </div>
      </CardBody>

      <TaskEditPartial
        task={task}
        isOpen={editPanelStatus}
        setIsOpen={setEditPanelStatus}
        columnKey={columnKey}
        tasksData={tasksData}
        setTasksData={setTasksData}
        index={index}
      />
    </>
  );
};

export default ColumnCardPartial;
