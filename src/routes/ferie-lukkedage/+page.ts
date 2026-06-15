import { closuresApi } from '$lib/api/closures';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const closures = await closuresApi.getAll(fetch);
    return { closures };
  } catch (err) {
    throw error(503, 'Kunne ikke hente lukkedage fra serveren. Prøv igen senere.');
  }
};