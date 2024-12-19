import { createRef, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useTranslation } from 'react-i18next';
import { DateSelectArg, EventApi, EventClickArg, EventContentArg } from '@fullcalendar/core';
import dayjs from 'dayjs';
import colors from 'tailwindcss/colors';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../components/ui/Card';
import Button from '../components/ui/Button';
import Calendar, { TViewMode, useCalendarView } from '../components/CalendarOld';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../components/ui/Dropdown';
import { TIcons } from '../types/icons.type';
import Avatar from '../components/Avatar';
import Modal, { ModalBody, ModalFooter, ModalHeader } from './ui/Modal';
import { Event } from '../types/app/Events.type';
import Badge from './ui/Badge';
import Icon from './icon/Icon';
import { format } from '@formkit/tempo';
import { useAppDispatch, useAppSelector } from '..//store/hook';
import { RootState } from '../store/rootReducer';
import { updateEvent } from '../store/slices/calendar/calendarSlice';

interface ICalendarPartialProps {
  height?: string | number;
  open?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  events?: Event[];
  type?: string;
	form?: boolean
	formAction?: Dispatch<SetStateAction<boolean>>;
}


const CalendarPartial: FC<ICalendarPartialProps> = ({ height, open, setIsOpen, events, form, formAction }) => {
	const { t } = useTranslation();

	const ref = createRef<FullCalendar>();
	const {
		viewMode,
		changeViewMode,
		next,
		prev,
		today,
		title: currentDate,
	} = useCalendarView(ref);

	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [initialEvents, setInitialEvents] = useState<any[]>([]);
	const { user } = useAppSelector((state: RootState) => state.auth.user);
	const dispatch = useAppDispatch()
	
	console.log(selectedEvent)

	


	useEffect(() => {
		if (events && events.length > 0) {
			const formattedEvents = events.map((event) => {
				const startDateTime = `${event.date} ${event.start}`; // Combina la fecha y la hora de inicio
				const endDateTime = `${event.date} ${event.end}`; // Combina la fecha y la hora de finalización
	
				let backgroundColor: string = colors.emerald['500']; // Color de fondo por defecto
				let borderColor: string = colors.emerald['500']; // Color de borde por defecto
	
				// Puedes cambiar los colores dependiendo del tipo de evento
				if (event.priority === 'High') {
					backgroundColor = colors.red['500'];
					borderColor = colors.red['500'];
				} else if (event.priority === 'Medium') {
					backgroundColor = colors.orange['500'];
					borderColor = colors.orange['500'];
				} else if (event.priority === 'Low') {
					backgroundColor = colors.green['500'];
					borderColor = colors.green['500'];
				}
	
				return {
					id: event.id,
					title: event.title,
					start: dayjs(startDateTime).toDate(), // Convierte la cadena combinada en un objeto Date
					end: dayjs(endDateTime).toDate(),     // Convierte la cadena combinada en un objeto Date
					backgroundColor: backgroundColor,  // Asigna el color de fondo
					borderColor: borderColor,          // Asigna el color del borde
					extendedProps: {
						description: event.description,
						location: event.location,
						eventType: event.eventType,
						priority: event.priority,
					},
				};
			});
	
			setInitialEvents(formattedEvents);  // Actualiza el estado de los eventos
		}
	}, [events]); // Se ejecutará cada vez que 'events' cambie
	

	const CALENDAR_VIEW: {
		[key in TViewMode]: { key: TViewMode; text: string; icon: TIcons };
	} = {
		timeGridDay: { key: 'timeGridDay', text: 'Día', icon: 'HeroCalendar' },
		timeGridWeek: { key: 'timeGridWeek', text: 'Semana', icon: 'HeroTableCells' },
		dayGridMonth: { key: 'dayGridMonth', text: 'Mes', icon: 'HeroCalendarDays' },
		listWeek: { key: 'listWeek', text: 'Lista', icon: 'HeroClipboardDocumentCheck' },
	};


	const handleDateSelect = (_selectInfo: DateSelectArg) => {


    
		// eslint-disable-next-line no-alert
    // setIsOpen!(true);
		// const title = prompt('Please enter a new title for your event');
		// const calendarApi = selectInfo.view.calendar;

		// calendarApi.unselect(); // clear date selection

		// if (title) {
		// 	calendarApi.addEvent({
		// 		id: title,
		// 		title,
		// 		start: selectInfo.startStr,
		// 		end: selectInfo.endStr,
		// 		allDay: selectInfo.allDay,
		// 	});
		// }
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		// eslint-disable-next-line no-restricted-globals,no-alert
		const event = clickInfo.event;

		if (setIsOpen){
			setIsOpen(true)
			const selectedInfo = events?.find((item) => item.id === event.id);
			if(selectedInfo){
				setSelectedEvent(selectedInfo);
			}
    }
		// if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
		// 	clickInfo.event.remove();
		// }
	};

	const renderEventContent = (eventContent: EventContentArg) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// const { user, ...rest }: { user?: TUser } = eventContent.event.extendedProps;

		return (
			<div className='overflow-hidden'>
				{/* {user && <Avatar src={user.image?.thumb} className='me-2 w-6' />} */}
				<i className='pe-2 '>{eventContent.event.title}</i>
			</div>
		);
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);

	// console.log(currentEvents)

	const handleEvents = (events: EventApi[]) => {
		setCurrentEvents(events);
	};

	return (
		<>
      {
      open! && setIsOpen!
      && (
        <Modal
          isOpen={open}
          setIsOpen={setIsOpen}
        >
          <ModalHeader>
            <h3>Fecha Agendada</h3>
          </ModalHeader>
          <ModalBody>
						<Card className="w-full max-w-3xl mx-auto">
							<CardHeader>
								<CardTitle className="text-2xl font-bold">{selectedEvent?.title}</CardTitle>
								{selectedEvent?.status && (
									<Badge variant={selectedEvent?.status === 'Completed' ? 'solid' : selectedEvent?.status === 'Cancelled' ? 'outline' : 'default'}>
										{selectedEvent?.status}
									</Badge>
								)}
							</CardHeader>
							<CardBody className="space-y-4">
								{selectedEvent?.description && (
									<p className="text-muted-foreground">{selectedEvent?.description}</p>
								)}

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-center space-x-2">
										<Icon icon='HeroCalendar' className="h-5 w-5 text-muted-foreground" />
										<span>{format(selectedEvent?.date!, { date: 'full' }, 'es' )}</span>
									</div>

									{selectedEvent?.location && (
										<div className="flex items-center space-x-2">
											<Icon icon='HeroMapPin' className="h-5 w-5 text-muted-foreground" />
											<span>{selectedEvent?.location}</span>
										</div>
									)}

									{selectedEvent?.duration && (
										<div className="flex items-center space-x-2">
											<Icon icon='HeroClock' className="h-5 w-5 text-muted-foreground" />
											<span>{selectedEvent?.duration}</span>
										</div>
									)}

									{selectedEvent?.organizer && (
										<div className="flex items-center space-x-2">
											<Icon icon='HeroUser' className="h-5 w-5 text-muted-foreground" />
											<span>Organizer: {
												selectedEvent?.organizer === user?.uid ? 'You' : `${user?.first_name! + user?.last_name}`
												}</span>
										</div>
									)}

									{selectedEvent?.eventType && (
										<div className="flex items-center space-x-2">
											<Icon icon='HeroTag' className="h-5 w-5 text-muted-foreground" />
											<span>Type: {selectedEvent?.eventType}</span>
										</div>
									)}

									{selectedEvent?.priority && (
										<div className="flex items-center space-x-2">
											<Badge
												color={selectedEvent?.priority === 'High' ? 'red' : selectedEvent?.priority === 'Medium' ? 'amber' : 'emerald'}
												variant={selectedEvent?.priority === 'High' ? 'outline' : selectedEvent?.priority === 'Medium' ? 'default' : 'solid'}>
												Priority: {selectedEvent?.priority}
											</Badge>
										</div>
									)}

									{selectedEvent?.reminder && (
										<div className="flex items-center space-x-2">
											<Icon icon='HeroBell' className="h-5 w-5 text-muted-foreground" />
											<span>Reminder set</span>
										</div>
									)}

									{selectedEvent?.recurrence && (
										<div className="flex items-center space-x-2">
											<Icon icon='HeroCubeTransparent' className="h-5 w-5 text-muted-foreground animate-pin" />
											<span>Recurrence: {selectedEvent?.recurrence}</span>
										</div>
									)}
								</div>

								{selectedEvent?.invitees && selectedEvent?.invitees.length > 0 && (
									<div className="mt-4">
										<h3 className="text-lg font-semibold mb-2">Invitees</h3>
										<div className="flex items-center space-x-2">
											<Icon icon='HeroUsers' className="h-5 w-5 text-muted-foreground" />
											<span>{selectedEvent?.invitees.join(', ')}</span>
										</div>
									</div>
								)}

								{selectedEvent?.tags && selectedEvent?.tags.length > 0 && (
									<div className="mt-4">
										<h3 className="text-lg font-semibold mb-2">Tags</h3>
										<div className="flex flex-wrap gap-2">
											{selectedEvent?.tags.map((tag, index) => (
												<Badge key={index} variant="outline">{tag}</Badge>
											))}
										</div>
									</div>
								)}

								{(selectedEvent?.start || selectedEvent?.end) && (
									<div className="mt-4">
										<h3 className="text-lg font-semibold mb-2">Time</h3>
										<div className="space-y-2">
											{selectedEvent?.start && (
												<div className="flex items-center space-x-2">
													<span className="font-medium">Start:</span>
													<span>{format(dayjs(`${selectedEvent?.date} ${selectedEvent?.start}`).toDate(), { date: 'full' }, 'es' )}</span>
												</div>
											)}
											{selectedEvent?.end && (
												<div className="flex items-center space-x-2">
													<span className="font-medium">End:</span>
													<span>{format(dayjs(`${selectedEvent?.date} ${selectedEvent?.end}`).toDate(), { date: 'full' }, 'es' )}</span>
												</div>
											)}
										</div>
									</div>
								)}

								<div className="mt-4 text-sm text-muted-foreground">
									{selectedEvent?.createdAt && <p>Created: {format(selectedEvent?.createdAt, { date: 'full' }, 'es' )}</p>}
									{selectedEvent?.updatedAt && <p>Last updated: {format(selectedEvent?.updatedAt, { date: 'full' }, 'es' )}</p>}
								</div>
							</CardBody>
						</Card>
          </ModalBody>
					<ModalFooter>
						<Button
							variant='solid'
							color='red'
							onClick={() => {
								dispatch(
									updateEvent({
										id: selectedEvent?.id!,
										eventData: {
											...selectedEvent,
											status: 'Cancelled',
										},
									})
								)
							}}
						>
						Cancelar Evento	
						</Button>

						<Button
							variant='solid'
							color='emerald'
							onClick={() => {
								dispatch(
									updateEvent({
										id: selectedEvent?.id!,
										eventData: {
											...selectedEvent,
											status: 'Completed',
										},
									})
								)
							}}
							>
							Confirmar Evento
						</Button>
					</ModalFooter>
        </Modal>
      )
      }
      <Card className='!w-full !h-full'>
          <CardHeader>
						
            <CardHeaderChild>
              <Button>{currentDate}</Button>
              <Button onClick={() => prev(true)} icon='HeroChevronDoubleLeft' />
              <Button onClick={() => prev()} icon='HeroChevronLeft' />
              <Button onClick={() => today()} icon='HeroCalendar' />
              <Button onClick={() => next()} icon='HeroChevronRight' />
              <Button onClick={() => next(true)} icon='HeroChevronDoubleRight' />
              <Dropdown>
                <DropdownToggle>
                  <Button color='zinc' icon={CALENDAR_VIEW[viewMode].icon}>
                    {t(CALENDAR_VIEW[viewMode].text)}
                  </Button>
                </DropdownToggle>
                <DropdownMenu placement='bottom-end'>
                  {Object.values(CALENDAR_VIEW).map((item) => (
                    <DropdownItem
                      key={item.key}
                      isActive={viewMode === item.key}
                      onClick={() => changeViewMode(item.key)}
                      icon={item.icon}>
                      {item.text}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </CardHeaderChild>
						{
						form && (
							<CardHeaderChild>
								<Button
									variant='solid'
									color='emerald'
									className='!ml-auto'
									onClick={() => formAction!(true)}
								>
									Agregar Evento
								</Button>
							</CardHeaderChild>
						)
						}
          </CardHeader>
          <CardBody>
            <Calendar
              ref={ref}
              height={height}
							// initialEvents={initialEvents}
							events={initialEvents}
              editable
              selectable
              selectMirror
              dayMaxEvents={3}
              locale={'es'}
              select={handleDateSelect}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
              eventsSet={handleEvents}
              eventClassNames='truncate'
            />
          </CardBody>
        </Card>
    </>
	);
};
CalendarPartial.defaultProps = {
	height: 400,
};

export default CalendarPartial;
