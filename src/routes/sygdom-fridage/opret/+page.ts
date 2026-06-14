import { childrenApi } from '$lib/api/children';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const children = await childrenApi.getAll(fetch);
  return { children };
};