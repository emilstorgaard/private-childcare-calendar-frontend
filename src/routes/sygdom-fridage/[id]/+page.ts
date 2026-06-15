import { dayStatusApi } from '$lib/api/daystatus';
import { childrenApi } from '$lib/api/children';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const [status, children] = await Promise.all([
      dayStatusApi.getById(Number(params.id), fetch),
      childrenApi.getAll(fetch)
    ]);
    return { status, children };
  } catch (err) {
    throw error(503, 'Kunne ikke hente status fra serveren. Prøv igen senere.');
  }
};