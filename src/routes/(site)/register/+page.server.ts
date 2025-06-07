import type { PageServerLoad, Actions } from './$types';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { validateFormData } from '$lib/server/validation/validation';
import { userRegisterSchema, type UserRegister } from '$lib/server/validation/schema/user.schema';

export const load = (async (event) => {
	if (event.locals.user) {
		return redirect(303, '/dashboard');
	}
	return { data: {} };
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async (event) => {
		const { formData, errors } = await validateFormData(
			await event.request.formData(),
			userRegisterSchema
		);

		console.log(errors);

		if (errors) {
			return fail(400, {
				data: formData,
				errors
			});
		}

		const validatedData = formData as UserRegister;

		const userId = auth.generateUserId();
		const passwordHash = await auth.generatePasswordHash(validatedData.password);
		const userName = auth.generateUsername();
		try {
			await db.insert(table.user).values({
				id: userId,
				email: validatedData.email,
				username: userName,
				passwordHash
			});

			const { error, message } = await auth.createSession(event, userId);
			if (error) {
				return fail(500, {
					data: formData,
					errors: {
						message
					}
				});
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
