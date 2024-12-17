// types/Event.ts
export interface Event {
  id?: string; // Unique ID for the event (can be generated with Firebase)
  title: string; // Event title
  description?: string; // Optional description of the event
  date: string; // Date of the event
  location?: string; // Location where the event will take place (optional)
  status?: string //'Scheduled' | 'Completed' | 'Cancelled'; // Event status
  attendee?: string; // Name of the attendee(s) (optional)
  organizer?: string; // Name of the event organizer (optional)
  eventType?: string //'Conference' | 'Meeting' | 'Workshop' | 'Webinar' | 'Seminar' | 'Other'; // Type of event
  duration?: string; // Duration of the event (e.g., "2 hours")
  priority?: string //'Low' | 'Medium' | 'High'; // Event priority
  createdAt?: string; // Timestamp when the event was created
  updatedAt?: string; // Timestamp when the event was last updated
  reminder?: boolean; // Whether a reminder is set for the event
  invitees?: string[]; // List of invitees or participants
  recurrence?: string // 'Daily' | 'Weekly' | 'Monthly' | 'Annually'; // Recurrence of the event, if any
  tags?: string[]; // Tags for the event (e.g., ['work', 'meeting', 'urgent'])
  start?: string; // Start date and time of the event
  end?: string; // End date and time of the event
}
