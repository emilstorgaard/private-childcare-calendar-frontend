import { closuresApi } from '$lib/api/closures';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const closure = await closuresApi.getById(Number(params.id), fetch);
    return { closure };
  } catch (err) {
    throw error(503, 'Kunne ikke hente lukkedag fra serveren. Prøv igen senere.');
  }
};