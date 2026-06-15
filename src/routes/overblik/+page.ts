import { dashboardApi } from '$lib/api/dashboard';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const dashboard = await dashboardApi.get(fetch);
  return { dashboard };
  } catch (err) {
    throw error(503, 'Kunne ikke hente dashboard fra serveren. Prøv igen senere.');
  }
};