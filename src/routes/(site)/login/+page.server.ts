import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async (event) => {
	if (event.locals.user) {
		return redirect(303, '/dashboard');
	}
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		// Basic validation for username and password
		if (!auth.validateEmail(email)) {
			return fail(400, {
				errors: {
					email: ['Invalid email (must be a valid email format)']
				}
			});
		}

		if (!auth.validatePassword(password)) {
			return fail(400, {
				data: formData,
				errors: {
					password: [
						'Invalid password (min 6, max 255 characters)',
						'Must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
					]
				}
			});
		}
		const results = await db.select().from(table.user).where(eq(table.user.email, email));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, {
				data: formData,
				errors: {
					message: 'Incorrect username or password'
				}
			});
		}

		const validPassword = await auth.verifyPasswordHash(existingUser.passwordHash, password);
		if (!validPassword) {
			return fail(400, {
				data: formData,
				errors: {
					message: 'Incorrect password'
				}
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		// Redirect to the dashboard after successful login
		return redirect(302, '/dashboard');
	}
};
