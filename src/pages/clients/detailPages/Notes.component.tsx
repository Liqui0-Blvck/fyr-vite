
import { useEffect, useId, useState } from "react"
import Textarea from "../../../components/form/Textarea"
import Icon from "../../../components/icon/Icon"
import Button from "../../../components/ui/Button"
import Card, { CardBody, CardHeader, CardTitle } from "../../../components/ui/Card"
import { format } from "@formkit/tempo"
import { useAppDispatch, useAppSelector } from "../../../store/hook"
import { RootState } from "../../../store/rootReducer"
import { useParams } from "react-router-dom"
import { addNote, deleteNote, getNotesByLead, updateNote } from "../../../store/slices/prospect/prospectSlice"
import toast from "react-hot-toast"
import { useFormik } from "formik"
import { useSubmitButton } from "../../../hooks/useSubmitButton"
import Validation from "../../../components/form/Validation"
import Modal, { ModalBody, ModalFooter, ModalHeader } from "../../../components/ui/Modal"
import { generateUID } from "../../../utils/generateUID"
import { Notes } from "../../../types/app/Notes.type"
import PageWrapper from "../../../components/layouts/PageWrapper/PageWrapper"


const NotesComponent = () => {
  const { user } = useAppSelector((state: RootState) => state.auth.user)
  const { id } = useParams()
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [selectedNote, setSelectedNote] = useState<Notes | null>(null)
  const { notes } = useAppSelector((state: RootState) => state.prospect)
  const { handleSubmit, isSubmitting } = useSubmitButton()
  const { handleSubmit: handleSubmitEdit, isSubmitting: isSubmittingEdit } = useSubmitButton()
  

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      content: ""
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {}

      if (!values.content.trim()) {
        errors.content = "La nota no puede estar vacía"
      }

      return errors
    },
    onSubmit: (values) => {
      try{
        handleSubmit(async() => {
          await dispatch(addNote({
            id: generateUID(),
            content: values.content,
            leadID: id!,
            userID: user?.uid!
          })).unwrap()
          toast.success("Nota agregada exitosamente")
          formik.resetForm()
          dispatch(getNotesByLead({ leadID: id!, userID: user?.uid! }))

        })
      } catch (error) {
        toast.error("Ocurrió un error al agregar la nota")
      }
    }
  })

  const formikEdit = useFormik({
    enableReinitialize: true,
    initialValues: {
      content_editable: selectedNote?.content || ""
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {}

      if (!values.content_editable.trim()) {
        errors.content_editable = "La nota no puede estar vacía"
      }

      return errors
    },
    onSubmit: (values) => {
      try{
        handleSubmitEdit(async() => {
          await dispatch(updateNote({
            ...selectedNote!,
            updatedAt: new Date().toISOString(),
            content: values.content_editable,
          })).unwrap()
          toast.success("Nota editada exitosamente")
          setEdit(false)
          dispatch(getNotesByLead({ leadID: id!, userID: user?.uid! }))

        })
      } catch (error) {
        toast.error("Ocurrió un error al editar la nota")
      }
    }
  })
  const dispatch = useAppDispatch()

  useEffect(() => {
      dispatch(getNotesByLead({ leadID: id!, userID: user?.uid! }))
  }, [])

  return (
    <PageWrapper title="Notas">
    {
      openModalDelete && (
        <Modal
          isOpen={openModalDelete}
          setIsOpen={setOpenModalDelete}
          >
          <ModalHeader>
            <h4>Eliminar Nota</h4>
          </ModalHeader>
          <ModalBody>
            <p className="text-center text-2xl my-10">¿Estás seguro de que deseas eliminar esta nota?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setOpenModalDelete(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                await dispatch(deleteNote({ leadID: id!, userID: user?.uid!, noteID: selectedNote?.id!})).unwrap()
                setOpenModalDelete(false)
                toast.success("Nota eliminada exitosamente")
              }}
              variant="solid"
              color="red"
            >
              Eliminar
            </Button>
          </ModalFooter>
        </Modal>
      )
    }
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Notas</CardTitle>
        <span>Agrega notas relevantes sobre el cliente</span>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="space-y-2">
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.content}
            invalidFeedback={formik.errors.content}
            >
            <Textarea
              name="content"
              id="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Escribe una nota"
              className="min-h-[100px] resize-y"
            />
          </Validation>
          <Button 
            onClick={() => formik.handleSubmit()} 
            className="w-full sm:w-auto"
            variant="solid"
            isDisable={isSubmitting}
            >
            Guardar Nota
          </Button>
        </div>
        <span className="my-5" />
        {
          notes.length > 0 ? (
            <div 
              className="h-[300px] w-full 
              rounded-md border dark:border-zinc-700 p-4 dark:bg-zinc-800 bg-zinc-100
              overflow-hidden overflow-y-auto
              
              ">
              {notes.map((note) => (
                <div key={note.id} 
                  className="mb-4       
                  ">
                  {edit ? (
                    <div className="space-y-2">
                      <Validation
                        isTouched={formikEdit.touched.content_editable}
                        isValid={formikEdit.isValid}
                        invalidFeedback={formikEdit.errors.content_editable}
                        >
                        <Textarea
                          name="content_editable"
                          id="content_editable"
                          value={formikEdit.values.content_editable}
                          onChange={formikEdit.handleChange}
                          onBlur={formikEdit.handleBlur}
                          className="min-h-[100px] resize-y border dark:border-zinc-800 dark:bg-zinc-900 focus:bg-zinc-900"
                        />
                      </Validation>
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEdit(false)}
                        >
                          <Icon icon="HeroCancel" className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          variant="solid"
                          isDisable={isSubmittingEdit}
                          onClick={() => formikEdit.handleSubmit()}
                        >
                          <Icon icon='HeroSave' className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Card 
                      className="
                      dark:bg-zinc-900
                      dark:border-zinc-700
                      shadow-sm
                      ">
                      <CardBody className="p-4">
                        <p className="text-md mb-2">{note.content}</p>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>
                            {note.updatedAt !== note.createdAt ? 'Actualizado: ' : 'Creado: '}
                            {format(note?.updatedAt!, { date: 'full', time: 'medium'}, 'es' )}
                          </span>
                          <div className="space-x-2">

                            <Button
                              variant="solid"
                              onClick={() => {
                                setEdit(true)
                                setSelectedNote(note)
                              }}
                            >
                              <Icon icon="HeroPencil" className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setOpenModalDelete(true)
                                setSelectedNote(note)
                              }}
                              color="red"
                            >
                              <Icon icon="HeroTrash" color="red" className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          )
          : (
            <div className="w-full h-auto flex items-center justify-center">
              <p className="text-lg text-muted-foreground">No hay notas para mostrar</p>
            </div>
          )
        }
      </CardBody>
      
    </Card>
    </PageWrapper>
  )
}

export default NotesComponent