import { api } from './client';
import type { DayStatus, DayStatusRequest } from '$lib/types';

export const dayStatusApi = {
  getAll: (fetchFn?: typeof fetch) =>
    api.get<DayStatus[]>('/api/daystatus', fetchFn),

  getById: (id: number, fetchFn?: typeof fetch) =>
    api.get<DayStatus>(`/api/daystatus/${id}`, fetchFn),

  create: (data: DayStatusRequest) =>
    api.post<DayStatus>('/api/daystatus', data),

  update: (id: number, data: DayStatusRequest) =>
    api.put<void>(`/api/daystatus/${id}`, data),

  remove: (id: number) =>
    api.delete<void>(`/api/daystatus/${id}`)
};