import { api } from './client';
import type { ClosurePeriod, ClosurePeriodRequest } from '$lib/types';

export const closuresApi = {
  getAll: (fetchFn?: typeof fetch) =>
    api.get<ClosurePeriod[]>('/api/closureperiods', fetchFn),

  getById: (id: number, fetchFn?: typeof fetch) =>
    api.get<ClosurePeriod>(`/api/closureperiods/${id}`, fetchFn),

  create: (data: ClosurePeriodRequest) =>
    api.post<ClosurePeriod>('/api/closureperiods', data),

  update: (id: number, data: ClosurePeriodRequest) =>
    api.put<void>(`/api/closureperiods/${id}`, data),

  remove: (id: number) =>
    api.delete<void>(`/api/closureperiods/${id}`)
};