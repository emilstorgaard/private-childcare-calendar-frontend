import { api } from './client';
import type { CalendarNote, CalendarNoteRequest } from '$lib/types';

export const notesApi = {
  getAll: (fetchFn?: typeof fetch) =>
    api.get<CalendarNote[]>('/api/notes', fetchFn),

  getById: (id: number, fetchFn?: typeof fetch) =>
    api.get<CalendarNote>(`/api/notes/${id}`, fetchFn),

  create: (data: CalendarNoteRequest) =>
    api.post<CalendarNote>('/api/notes', data),

  update: (id: number, data: CalendarNoteRequest) =>
    api.put<void>(`/api/notes/${id}`, data),

  remove: (id: number) =>
    api.delete<void>(`/api/notes/${id}`)
};