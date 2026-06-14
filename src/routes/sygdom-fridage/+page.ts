import { dayStatusApi } from '$lib/api/daystatus';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const statuses = await dayStatusApi.getAll(fetch);
  return { statuses };
};