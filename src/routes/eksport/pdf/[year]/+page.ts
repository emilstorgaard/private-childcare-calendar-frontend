import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const year = Number(params.year);

  if (isNaN(year) || year < 2020 || year > 2100) {
    throw error(400, 'Ugyldigt år');
  }

  return { year };
};