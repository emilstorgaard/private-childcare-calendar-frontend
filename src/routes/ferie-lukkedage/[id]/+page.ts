import { closuresApi } from '$lib/api/closures';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const closure = await closuresApi.getById(Number(params.id), fetch);
  return { closure };
};