import { api } from './client';
import type { CalendarEvent } from '$lib/types';

export const calendarApi = {
  getEvents: (start: string, end: string, fetchFn?: typeof fetch) =>
    api.get<CalendarEvent[]>(
      `/api/calendar/events?start=${start}&end=${end}`,
      fetchFn
    )
};