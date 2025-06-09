import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async (event) => {
	if (event.locals.user) {
		return redirect(303, '/dashboard');
	} else {
		redirect(303, '/home');
	}
}) satisfies PageServerLoad;
