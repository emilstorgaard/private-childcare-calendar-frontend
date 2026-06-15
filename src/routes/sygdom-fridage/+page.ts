import { dayStatusApi } from '$lib/api/daystatus';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const statuses = await dayStatusApi.getAll(fetch);
    return { statuses };
  } catch (err) {
    throw error(503, 'Kunne ikke hente statuses fra serveren. Prøv igen senere.');
  }
};