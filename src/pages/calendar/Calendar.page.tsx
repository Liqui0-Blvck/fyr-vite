import React, { useEffect, useState } from 'react'
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper'
import Subheader, { SubheaderLeft } from '../../components/layouts/Subheader/Subheader'
import Container from '../../components/layouts/Container/Container'
import CalendarPartial from '../../components/Calendar'
import { useAppDispatch, useAppSelector } from '../../store/hook'
import { RootState } from '../../store/rootReducer'
import { fetchEvents } from '../../store/slices/calendar/calendarSlice'
import Loading from '../../components/Loading'

const CalendarPage = () => {
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const { events, loading } = useAppSelector((state: RootState) => state.calendar)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchEvents())
  }, [])

  return (
    <PageWrapper title='Agenda y Calendario'>
      <Container breakpoint={null} className='!w-full !h-full'>
        {
          loading
            ? <Loading />
            : <CalendarPartial height={600} setIsOpen={setOpenModalDetail} open={openModalDetail} type='view' events={events} />
        }
      </Container>
    </PageWrapper>
  )
}

export default CalendarPage
