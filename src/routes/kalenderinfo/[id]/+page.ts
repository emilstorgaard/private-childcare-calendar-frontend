import { notesApi } from '$lib/api/notes';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const note = await notesApi.getById(Number(params.id), fetch);
    return { note };
  } catch (err) {
    throw error(503, 'Kunne ikke hente note fra serveren. Prøv igen senere.');
  }
};