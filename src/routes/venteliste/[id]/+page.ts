import { waitingListApi } from '$lib/api/waitinglist';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {


  try {
    const entry = await waitingListApi.getById(Number(params.id), fetch);
    return { entry };
  } catch (err) {
    throw error(503, 'Kunne ikke hente venteliste fra serveren. Prøv igen senere.');
  }
};