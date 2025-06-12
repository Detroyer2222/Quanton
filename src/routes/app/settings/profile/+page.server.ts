import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	userUpdateUsernameSchema,
	type UserUpdateUsername
} from '$lib/server/validation/user.schema';
import { validateFormData } from '$lib/server/validation/validation';
import { Collections } from '$lib/types';

export const load = (async (event) => {
	if (!event.locals.user) {
		redirect(302, '/login');
	}
	return {
		user: event.locals.user,
		data: {} // Provide an appropriate value for the required 'data' property
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateUsername: async ({ locals, request }) => {
		console.log('Updating username...');
		const { formData, errors } = await validateFormData(
			await request.formData(),
			userUpdateUsernameSchema
		);

		if (errors) {
			return fail(400, {
				data: formData,
				errors
			});
		}

		const validatedData = formData as UserUpdateUsername;

		try {
			if (!locals.user) {
				return fail(401, {
					data: formData,
					errors: {
						message: 'User not authenticated.'
					}
				});
			}
			const response = await locals.pb.collection(Collections.Users).update(locals.user.id, {
				username: validatedData.username
			});

			if (!response) {
				return fail(500, {
					data: formData,
					errors: {
						message: 'Failed to update username. Please try again later.'
					}
				});
			}
			locals.user = response;
			return {
				status: 200,
				data: {
					message: 'Username updated successfully.'
				}
			};
		} catch (error) {
			return fail(500, {
				data: formData,
				errors: {
					message:
						error instanceof Error
							? error.message
							: 'An error has occurred while updating the username. Please contact support.'
				}
			});
		}
	}
};
