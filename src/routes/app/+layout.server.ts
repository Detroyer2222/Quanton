import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}
	return {
		user: locals.user,
		data: {} // Provide an appropriate value for the required 'data' property
	};
}) satisfies LayoutServerLoad;
