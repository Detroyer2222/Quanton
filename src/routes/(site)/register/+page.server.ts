import type { PageServerLoad, Actions } from './$types';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async (event) => {
	if (event.locals.user) {
		return redirect(303, '/dashboard');
	}
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		// Basic validation for email and password
		if (!auth.validateEmail(email)) {
			return fail(400, {
				errors: {
					email: ['Invalid email (must be a valid email format)']
				}
			});
		}

		// Compare passwords
		if (password !== confirmPassword) {
			return fail(400, {
				data: formData,
				errors: {
					confirmPassword: ['Passwords do not match']
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
		if (existingUser) {
			return fail(400, {
				data: formData,
				errors: {
					message: 'Email already registered'
				}
			});
		}

		const userId = auth.generateUserId();
		const passwordHash = await auth.generatePasswordHash(password);

		try {
			await db.insert(table.user).values({
				id: userId,
				email,
				passwordHash
			});

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			return fail(500, {
				data: formData,
				errors: {
					message: 'An error has occurred while registering the user. Please contact support.'
				}
			});
		}
		return redirect(302, '/dashboard');
	}
};
