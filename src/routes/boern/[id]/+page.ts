import { childrenApi } from '$lib/api/children';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const child = await childrenApi.getById(Number(params.id), fetch);
    return { child };
  } catch (err) {
    throw error(503, 'Kunne ikke hente børn fra serveren. Prøv igen senere.');
  }
};