import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	// Clear the session to log out the user
	locals.pb.authStore.clear();
	locals.user = null;

	// Check if this logout is due to email change request
	const emailChangeRequested = url.searchParams.get('email');
	
	if (emailChangeRequested === 'emailChangeRequested') {
		return redirect(303, '/login?emailChangeRequested=true');
	}

	return redirect(303, '/login');
}) satisfies PageServerLoad;
