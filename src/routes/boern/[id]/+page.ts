import { childrenApi } from '$lib/api/children';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const child = await childrenApi.getById(Number(params.id), fetch);
  return { child };
};