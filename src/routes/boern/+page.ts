import { childrenApi } from '$lib/api/children';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
     const children = await childrenApi.getAll(fetch);
  return { children };
  } catch (err) {
    throw error(503, 'Kunne ikke hente børn fra serveren. Prøv igen senere.');
  }
};