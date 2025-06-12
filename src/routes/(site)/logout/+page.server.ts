import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// Clear the session to log out the user
	locals.pb.authStore.clear();
	locals.user = null;

	return redirect(303, '/login');
}) satisfies PageServerLoad;
