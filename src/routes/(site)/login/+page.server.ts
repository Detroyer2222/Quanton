import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { validateFormData } from '$lib/server/validation/validation';
import { userLoginSchema, type UserLogin } from '$lib/server/validation/user.schema';
import { Collections } from '$lib/types';

export const load = (async () => {
	return {
		data: {}
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async ({ locals, request }) => {
		const { formData, errors } = await validateFormData(await request.formData(), userLoginSchema);

		if (errors) {
			return fail(400, {
				data: formData,
				errors
			});
		}
		const validatedData = formData as UserLogin;

		try {
			await locals.pb
				.collection(Collections.Users)
				.authWithPassword(validatedData.email, validatedData.password);
			if (!locals.pb.authStore.isValid) {
				locals.pb.authStore.clear();
				return fail(400, {
					data: {},
					errors: {
						message: 'Invalid email or password.'
					}
				});
			}
		} catch (error) {
			return fail(500, {
				data: {},
				errors: {
					message: error instanceof Error ? error.message : 'An unexpected error occurred.'
				}
			});
		}

		// Redirect to the dashboard after successful login
		return redirect(302, 'app/dashboard');
	}
};
