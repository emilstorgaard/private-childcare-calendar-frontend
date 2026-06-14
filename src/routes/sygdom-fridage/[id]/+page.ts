import { dayStatusApi } from '$lib/api/daystatus';
import { childrenApi } from '$lib/api/children';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const [status, children] = await Promise.all([
    dayStatusApi.getById(Number(params.id), fetch),
    childrenApi.getAll(fetch)
  ]);
  return { status, children };
};