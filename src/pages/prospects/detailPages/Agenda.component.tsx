import React, { useEffect, useState } from 'react'
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper'
import Container from '../../../components/layouts/Container/Container'
import CalendarPartial from '../../../components/Calendar'
import CalendarAgendaForm from '../../../pages/calendar/CalendarAgendaForm'
import Modal, { ModalBody, ModalHeader } from '../../../components/ui/Modal'
import { useAppDispatch, useAppSelector } from '../../../store/hook'
import { RootState } from '../../../store/rootReducer'
import { fetchEvents } from '../../../store/slices/calendar/calendarSlice'

const Agenda = () => {
  const [openModalForm, setOpenModalForm] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)

  const { events } = useAppSelector((state: RootState) => state.calendar)
  const dispatch = useAppDispatch()

  console.log(events)

  useEffect(() => {
    dispatch(fetchEvents())
  }, [])


  return (
    <PageWrapper title='Agenda' className='w-full'>
      <Container margin='mx-0' breakpoint={null} className='!w-full !p-0'>
        {
          openModalForm && (
            <Modal
              isOpen={openModalForm}
              setIsOpen={setOpenModalForm}
            >
              <ModalHeader>
                <h1 className='text-2xl font-bold'>Agregar evento</h1>
              </ModalHeader>
              <ModalBody>
                <CalendarAgendaForm isClosed={setOpenModalForm}/>
              </ModalBody>
            </Modal>
          )
        }
        <CalendarPartial 
          height={500} 
          open={openModalDetail} 
          setIsOpen={setOpenModalDetail} 
          events={events}
          type='view' 
          form={true} 
          formAction={setOpenModalForm}/>
      </Container>
    </PageWrapper>
  )
}

export default Agenda
