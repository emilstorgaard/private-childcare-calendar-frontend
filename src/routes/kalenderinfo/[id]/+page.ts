import { notesApi } from '$lib/api/notes';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const note = await notesApi.getById(Number(params.id), fetch);
  return { note };
};