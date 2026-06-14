import { closuresApi } from '$lib/api/closures';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const closures = await closuresApi.getAll(fetch);
  return { closures };
};