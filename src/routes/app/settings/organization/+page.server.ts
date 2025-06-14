import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// Ensure user is loaded
	return {
		user: locals.user
	};
}) satisfies PageServerLoad;
