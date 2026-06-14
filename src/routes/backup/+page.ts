import { backupApi } from '$lib/api/backup';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const backups = await backupApi.getAll(fetch);
  return { backups };
};