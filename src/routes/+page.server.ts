import type { PageServerLoad } from './$types';
import * as auth from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
	const sessionToken = cookies.get(auth.sessionCookieName);
	// If no session token is present, redirect to login
	// If session token is present, validate it and redirect accordingly
	if (!sessionToken) {
		return redirect(303, '/');
	}
	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		return redirect(303, '/dashboard');
	} else if (user) {
		return redirect(303, '/login');
	}
}) satisfies PageServerLoad;
