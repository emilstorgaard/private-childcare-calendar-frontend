import { notesApi } from '$lib/api/notes';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const notes = await notesApi.getAll(fetch);
    return { notes };
  } catch (err) {
    throw error(503, 'Kunne ikke hente noter fra serveren. Prøv igen senere.');
  }
};