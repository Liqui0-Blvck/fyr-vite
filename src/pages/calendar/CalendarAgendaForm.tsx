import { useFormik } from 'formik'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { useSubmitButton } from '../../hooks/useSubmitButton'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { generateUID } from '../../utils/generateUID'
import { RootState } from '../../store/rootReducer'
import Input from '../../components/form/Input'
import Label from '../../components/form/Label'
import Select from '../../components/form/Select'
import Textarea from '../../components/form/Textarea'
import Button from '../../components/ui/Button'
import Validation from '../../components/form/Validation'
import { createEvent } from '../../store/slices/calendar/calendarSlice'
import toast from 'react-hot-toast'


interface ICalendarAgendaFormProps {
  isClosed: Dispatch<SetStateAction<boolean>>
}

const CalendarAgendaForm: FC<ICalendarAgendaFormProps> = ({ isClosed }) => {
  const { isSubmitting, handleSubmit } = useSubmitButton()
  const { user } = useAppSelector((state: RootState) => state.auth.user)
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      eventType: '',
      priority: '',
      start: '',
      end: '',
    },
    onSubmit: (values) => {
      handleSubmit(async () => {
        //@ts-ignore
        await dispatch(createEvent({
          id: generateUID(),
          title: values.title,
          description: values.description,
          date: values.date,
          location: values.location,
          eventType: values.eventType,
          start: values.start,
          end: values.end,
          priority: values.priority,
          invitees: [], // Puedes agregar los invitados de alguna manera si es necesario
          organizer: user?.uid,
        })).unwrap()
        toast.success('Evento creado correctamente')
        isClosed(true)
      })
    }
  })

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <Label htmlFor="title">Título</Label>
        <Validation
          isTouched={formik.touched.title}
          isValid={formik.isValid}
          invalidFeedback="El título es requerido"
        >
          <Input
            name="title"
            id="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Ingrese el título del evento"
          />
        </Validation>
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          name="description"
          id="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Descripción del evento"
          className="h-32"
        />
      </div>

      <div className='flex gap-5'>
        <div className='w-full'>
          <Label htmlFor="date">Fecha</Label>
          <Validation
            isTouched={formik.touched.date}
            isValid={formik.isValid}
            invalidFeedback="La fecha es requerida"
          >
            <Input
              name="date"
              id="date"
              type="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Validation>
        </div>

        <div className='w-full'>
          <Label htmlFor="start">Hora Inicio</Label>
          <Validation
            isTouched={formik.touched.start}
            isValid={formik.isValid}
            invalidFeedback="La hora es requerida"
          >
            <Input
              name="start"
              id="start"
              type="time"
              value={formik.values.start}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Validation>
        </div>
        
        <div className='w-full'>
          <Label htmlFor="end">Hora Termino</Label>
          <Validation
            isTouched={formik.touched.end}
            isValid={formik.isValid}
            invalidFeedback="La hora es requerida"
          >
            <Input
              name="end"
              id="end"
              type="time"
              value={formik.values.end}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Validation>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Ubicación</Label>
        <Input
          name="location"
          id="location"
          value={formik.values.location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Lugar del evento"
        />
      </div>

      <div>
        <Label htmlFor="eventType">Tipo de Evento</Label>
        <Select
          name="eventType"
          id="eventType"
          value={formik.values.eventType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Selecciona el tipo de evento</option>
          <option value="Conference">Conferencia</option>
          <option value="Meeting">Reunión</option>
          <option value="Webinar">Webinar</option>
          <option value="Seminar">Seminario</option>
          <option value="Workshop">Taller</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="priority">Prioridad</Label>
        <Select
          name="priority"
          id="priority"
          value={formik.values.priority}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Selecciona la prioridad</option>
          <option value="Low">Baja</option>
          <option value="Medium">Media</option>
          <option value="High">Alta</option>
        </Select>
      </div>

      <div className="flex justify-end gap-5 mt-5">
        <Button variant="outline" onClick={() => isClosed(false)}>
          Cancelar
        </Button>

        <Button variant="solid" onClick={() => formik.handleSubmit()} isDisable={isSubmitting}>
          Agregar Evento
        </Button>
      </div>
    </div>
  )
}

export default CalendarAgendaForm
