import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async (event) => {
	if (event.locals.user) {
		return redirect(303, '/dashboard');
	} else {
		return redirect(303, '/login');
	}
}) satisfies PageServerLoad;
