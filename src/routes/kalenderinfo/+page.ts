import { notesApi } from '$lib/api/notes';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const notes = await notesApi.getAll(fetch);
  return { notes };
};