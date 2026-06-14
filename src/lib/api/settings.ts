import { api } from './client';
import type { SystemSetting, SettingsRequest } from '$lib/types';

export const settingsApi = {
  get: (fetchFn?: typeof fetch) =>
    api.get<SystemSetting>('/api/settings', fetchFn),

  update: (data: SettingsRequest) =>
    api.put<SystemSetting>('/api/settings', data)
};