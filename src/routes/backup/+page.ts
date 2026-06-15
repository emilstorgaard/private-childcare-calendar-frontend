import { backupApi } from '$lib/api/backup';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const backups = await backupApi.getAll(fetch);
    return { backups };
  } catch (err) {
    throw error(503, 'Kunne ikke hente backups fra serveren. Prøv igen senere.');
  }
};