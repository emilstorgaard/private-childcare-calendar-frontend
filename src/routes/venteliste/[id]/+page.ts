import { waitingListApi } from '$lib/api/waitinglist';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const entry = await waitingListApi.getById(Number(params.id), fetch);
  return { entry };
};