import React, { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { useTranslation } from 'react-i18next';
import OffCanvas, { OffCanvasBody, OffCanvasHeader } from '../../../../components/ui/OffCanvas';
import { Task } from '../../../../types/app/Tasks.type';
import Badge from '../../../../components/ui/Badge';
import Icon from '../../../../components/icon/Icon';
import RichText from '../../../../components/RichText';
import { move } from '../_helper/helper';
import Avatar from '../../../../components/Avatar';
import Button from '../../../../components/ui/Button';
import Card, { CardBody, CardHeader, CardHeaderChild } from '../../../../components/ui/Card';

interface ICommentTextProps {
  text: string;
}

const CommentText: FC<ICommentTextProps> = ({ text }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  let initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];
  try {
    initialValue = text ? (JSON.parse(text) as Descendant[]) : initialValue;
  } catch {
    initialValue = [{ type: 'paragraph', children: [{ text }] }];
  }

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable readOnly placeholder='Enter some plain text...' />
    </Slate>
  );
};

interface ITaskEditPartialProps {
  task: Task;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  columnKey: string;
  tasksData: Record<string, Task[]>;
  setTasksData: Dispatch<SetStateAction<Record<string, Task[]>>>;
  index: number;
}

const TaskEditPartial: FC<ITaskEditPartialProps> = ({
  task,
  isOpen,
  columnKey,
  tasksData,
  setTasksData,
  index,
  setIsOpen,
}) => {
  const { i18n } = useTranslation();
  const isNewItem = !task.id;

  // Parse description to Slate format
  let initialDescription: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];
  if (task.description) {
    try {
      initialDescription = JSON.parse(task.description) as Descendant[];
    } catch {
      initialDescription = [{ type: 'paragraph', children: [{ text: task.description }] }];
    }
  }

  const formik = useFormik({
    initialValues: {
      title: task.title || '',
      groupId: columnKey || '',
      description: initialDescription,
      newComment: [] as Descendant[],
    },
    onSubmit: (values) => {
      const sourceList = tasksData[columnKey] || [];
      const destList = tasksData[values.groupId] || [];
      const RESULT = move(
        sourceList,
        destList,
        {
          index,
          droppableId: columnKey,
        },
        { index: 0, droppableId: values.groupId },
      );
      setTasksData({ ...tasksData, ...RESULT });
    },
  });

  const editor = useMemo(() => withReact(createEditor()), []);
  const [editDescStatus, setEditDescStatus] = useState<boolean>(false);

  const assignedUserId = task.assignedTo?.userId || 'Unassigned';
  const createdAtFormatted = dayjs(task.createdAt).locale(i18n.language).format('LLL');

  return (
    <OffCanvas
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogClassName='max-md:max-w-full md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl'
    >
      <OffCanvasHeader>
        {isNewItem ? (
          'New Task'
        ) : (
          <div className='flex gap-4'>
            <span>{task.title}</span>
            <span className='text-zinc-500'>#{task.id}</span>
          </div>
        )}
      </OffCanvasHeader>
      <OffCanvasBody>
        <div className='-mx-4 grid grid-cols-12 [&>*]:border-zinc-500/25 dark:[&>*]:border-zinc-500/50'>
          <div className='col-span-12 flex items-center gap-4 border-b px-4 pb-4'>
            <Badge
              color='emerald'
              variant='outline'
              className='flex gap-2 border-transparent'
            >
              <Icon icon='HeroPlayCircle' />
              {task.status || 'Open'}
            </Badge>
            <span>{assignedUserId}</span>
            <span className='text-zinc-500'>
              opened on {createdAtFormatted}
            </span>
          </div>
        </div>
        <div className='-mx-4 grid h-full grid-cols-12 [&>*]:border-zinc-500/25 dark:[&>*]:border-zinc-500/50'>
          <div className='col-span-12 p-4 md:col-span-8 md:border-e'>
            <div className='-mx-4 grid grid-cols-12 gap-y-4'>
              <div className='col-span-12 flex items-center px-4'>
                <div className='flex grow items-center gap-2'>
                  <Avatar
                    // Sin imagen, sólo asignamos el userId como nombre
                    name={assignedUserId}
                    className='!w-8'
                  />
                  <span>{assignedUserId}</span>
                  <span className='text-zinc-500'>
                    on {createdAtFormatted}
                  </span>
                </div>
                <div className='shrink-0'>
                  {editDescStatus ? (
                    <>
                      <Button
                        color='red'
                        onClick={() => setEditDescStatus(!editDescStatus)}
                      >
                        Cancel
                      </Button>
                      <Button
                        color='emerald'
                        variant='solid'
                        onClick={() => setEditDescStatus(!editDescStatus)}
                      >
                        Update
                      </Button>
                    </>
                  ) : (
                    <Button
                      className='!px-0'
                      onClick={() => setEditDescStatus(!editDescStatus)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className='col-span-12 border-b border-zinc-500/25 px-4 pb-4 dark:border-zinc-500/50'>
                {editDescStatus ? (
                  <RichText
                    id='description'
                    value={formik.values.description}
                    handleChange={(event) => {
                      formik.setFieldValue('description', event).catch(() => {});
                    }}
                  />
                ) : (
                  <Slate
                    editor={editor}
                    initialValue={initialDescription}
                  >
                    <Editable readOnly placeholder='Enter some plain text...' />
                  </Slate>
                )}
              </div>

              {task.comments && task.comments.map((comment) => {
                const commentCreatedAt = dayjs(comment.createdAt).locale(i18n.language).format('LLL');
                return (
                  <div key={comment.id} className='col-span-12 px-4'>
                    <Card className='shadow-lg'>
                      <CardHeader>
                        <CardHeaderChild>
                          <Avatar
                            // No tenemos info detallada del usuario de comentarios. Usamos userId.
                            name={comment.userId}
                            className='w-8'
                          />
                          <span>{comment.userId}</span>
                          <span className='text-zinc-500'>
                            {commentCreatedAt}
                          </span>
                        </CardHeaderChild>
                      </CardHeader>
                      <CardBody>
                        <CommentText text={comment.text} />
                      </CardBody>
                    </Card>
                  </div>
                );
              })}

              <div className='col-span-12 px-4'>
                <RichText
                  id='newComment'
                  value={formik.values.newComment}
                  handleChange={(event) => {
                    formik.setFieldValue('newComment', event).catch(() => {});
                  }}
                  placeholder='Leave a comment'
                />
              </div>
              <div className='col-span-12 flex px-4'>
                <div className='grow' />
                <div className='shrink-0'>
                  <Button color='emerald' variant='outline'>
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-span-12 p-4 md:col-span-4'>
            <div className='-mx-4 grid grid-cols-12 gap-y-4'>
              <div className='col-span-12 border-b border-zinc-500/25 px-4 pb-4 dark:border-zinc-500/50'>
                <table className='w-full text-zinc-500'>
                  <tbody className='[&>tr>td]:py-2'>
                    <tr>
                      <td>
                        <b>Assignees</b>
                      </td>
                      <td>
                        <div className='flex items-center gap-2'>
                          <Avatar name={assignedUserId} className='w-8' />
                          <span>{assignedUserId}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>Team</b>
                      </td>
                      <td>No team info</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Attachments</b>
                      </td>
                      <td>
                        <ul className='list-disc'>
                          {task.attachments?.map((att, idx) => (
                            <li key={idx} className='flex items-center gap-2'>
                              <Icon icon='HeroPaperClip' />
                              <span>{att}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='col-span-12 px-4'>
                <div className='flex flex-col gap-4'>
                  <div>
                    <Button icon='HeroArrowTopRightOnSquare'>
                      Open in new tab
                    </Button>
                  </div>
                  <div>
                    <Button icon='HeroDocumentDuplicate'>Copy link</Button>
                  </div>
                  <div>
                    <Button icon='HeroDocumentDuplicate'>
                      Copy link project
                    </Button>
                  </div>
                  <div>
                    <Button icon='HeroDocumentDuplicate'>Archive</Button>
                  </div>
                  <div>
                    <Button
                      icon='HeroDocumentDuplicate'
                      color='red'
                      variant='outline'
                    >
                      Delete from project
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </OffCanvasBody>
    </OffCanvas>
  );
};

export default TaskEditPartial;
