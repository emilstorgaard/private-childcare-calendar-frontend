import { api } from './client';
import type { Dashboard } from '$lib/types';

export const dashboardApi = {
  get: (fetchFn?: typeof fetch) =>
    api.get<Dashboard>('/api/dashboard', fetchFn)
};