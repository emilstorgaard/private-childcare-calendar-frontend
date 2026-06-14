import { api } from './client';
import type { WaitingListEntry, WaitingListRequest } from '$lib/types';

export const waitingListApi = {
  getAll: (fetchFn?: typeof fetch) =>
    api.get<WaitingListEntry[]>('/api/waitinglist', fetchFn),

  getById: (id: number, fetchFn?: typeof fetch) =>
    api.get<WaitingListEntry>(`/api/waitinglist/${id}`, fetchFn),

  create: (data: WaitingListRequest) =>
    api.post<WaitingListEntry>('/api/waitinglist', data),

  update: (id: number, data: WaitingListRequest) =>
    api.put<void>(`/api/waitinglist/${id}`, data),

  remove: (id: number) =>
    api.delete<void>(`/api/waitinglist/${id}`)
};