import { api } from './client';
import type { Child, ChildRequest } from '$lib/types';

export const childrenApi = {
  getAll: (fetchFn?: typeof fetch) =>
    api.get<Child[]>('/api/children', fetchFn),

  getById: (id: number, fetchFn?: typeof fetch) =>
    api.get<Child>(`/api/children/${id}`, fetchFn),

  create: (data: ChildRequest) =>
    api.post<Child>('/api/children', data),

  update: (id: number, data: ChildRequest) =>
    api.put<void>(`/api/children/${id}`, data),

  remove: (id: number) =>
    api.delete<void>(`/api/children/${id}`)
};