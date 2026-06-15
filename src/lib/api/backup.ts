import { api } from './client';
import { API_BASE_URL } from '$lib/config';
import type { BackupFile } from '$lib/types';

export const backupApi = {
  getAll: (fetchFn?: typeof fetch) =>
    api.get<BackupFile[]>('/api/backup', fetchFn),

  create: () =>
    api.post<BackupFile>('/api/backup', {}),

  remove: (fileName: string) =>
    api.delete<void>(`/api/backup/${encodeURIComponent(fileName)}`),

  // Restore by existing backup in the list (without restart)
  restore: (fileName: string) =>
    api.post<{ message: string }>(
      `/api/backup/${encodeURIComponent(fileName)}/restore`,
      {}
    ),

  // Download by direct link
  downloadUrl: (fileName: string) =>
    `${API_BASE_URL}/api/backup/${encodeURIComponent(fileName)}/download`,

  // Upload a backup file (saved to the list)
  upload: async (file: File): Promise<BackupFile> => {
    const formData = new FormData();
    formData.append('backupFile', file);

    const res = await fetch(`${API_BASE_URL}/api/backup/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? 'Upload fejlede.');
    }

    return res.json();
  }
};