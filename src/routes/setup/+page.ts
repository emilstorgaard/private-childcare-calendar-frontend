import { settingsApi } from '$lib/api/settings';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const settings = await settingsApi.get(fetch);
  return { settings };
};