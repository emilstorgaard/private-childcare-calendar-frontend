import { waitingListApi } from '$lib/api/waitinglist';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const entries = await waitingListApi.getAll(fetch);
  return { entries };
};