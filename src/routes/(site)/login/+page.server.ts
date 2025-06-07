import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { validateFormData } from '$lib/server/validation/validation';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import { userLoginSchema, type UserLogin } from '$lib/server/validation/schema/user.schema';

export const load = (async (event) => {
	if (event.locals.user) {
		return redirect(303, '/dashboard');
	}
	return { data: {} };
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async (event) => {
		const { formData, errors } = await validateFormData(
			await event.request.formData(),
			userLoginSchema
		);

		if (errors) {
			return fail(400, {
				data: formData,
				errors
			});
		}
		const validatedData = formData as UserLogin;

		const user = await db
			.select()
			.from(table.user)
			.where(eq(table.user.email, validatedData.email))
			.limit(1)
			.then((results) => results[0]);

		if (!user) {
			return fail(400, {
				data: formData,
				errors: {
					message: 'User not found.'
				}
			});
		}

		const { error, message } = await auth.createSession(event, user.id);
		if (error) {
			return fail(500, {
				data: formData,
				errors: {
					message: message
				}
			});
		}

		// Redirect to the dashboard after successful login
		return redirect(302, '/dashboard');
	}
};
