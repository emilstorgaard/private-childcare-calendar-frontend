import { dashboardApi } from '$lib/api/dashboard';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const dashboard = await dashboardApi.get(fetch);
  return { dashboard };
};