import { settingsApi } from '$lib/api/settings';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const settings = await settingsApi.get(fetch);
  return { settings };
  } catch (err) {
    throw error(503, 'Kunne ikke hente settings fra serveren. Prøv igen senere.');
  }
};