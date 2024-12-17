import React, { useEffect, useState } from 'react'
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper'
import Subheader, { SubheaderLeft } from '../../components/layouts/Subheader/Subheader'
import Container from '../../components/layouts/Container/Container'
import CalendarPartial from '../../components/Calendar'
import { useAppDispatch, useAppSelector } from 'src/store/hook'
import { RootState } from 'src/store/rootReducer'
import { fetchEvents } from 'src/store/slices/calendar/calendarSlice'

const CalendarPage = () => {
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const { events } = useAppSelector((state: RootState) => state.calendar)
  const dispatch = useAppDispatch()

  console.log(events)

  useEffect(() => {
    dispatch(fetchEvents())
  }, [])

  return (
    <PageWrapper title='Agenda y Calendario'>
      <Subheader>
        <SubheaderLeft>
          <h1>Agenda y Calendario</h1>
        </SubheaderLeft>
      </Subheader>
      <Container breakpoint={null} className='w-full h-full'>
        <CalendarPartial height={600} setIsOpen={setOpenModalDetail} open={openModalDetail} type='view' events={events} />
      </Container>
    </PageWrapper>
  )
}

export default CalendarPage
