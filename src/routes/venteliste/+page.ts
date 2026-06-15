import { waitingListApi } from '$lib/api/waitinglist';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const entries = await waitingListApi.getAll(fetch);
  return { entries };
  } catch (err) {
    throw error(503, 'Kunne ikke hente venteliste fra serveren. Prøv igen senere.');
  }
};