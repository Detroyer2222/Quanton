import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { userLoginSchema } from '$lib/server/validation/user.schema';
import { Collections } from '$lib/types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = (async ({ url }) => {
	const form = await superValidate(zod4(userLoginSchema));
	const emailChangeRequested = url.searchParams.get('emailChangeRequested') === 'true';
	
	return {
		data: {},
		form,
		emailChangeRequested
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async ({ locals, request }) => {
		const form = await superValidate(request, zod4(userLoginSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await locals.pb
				.collection(Collections.Users)
				.authWithPassword(form.data.email, form.data.password);
			if (!locals.pb.authStore.isValid) {
				locals.pb.authStore.clear();
				return message(form, 'Invalid email or password.', {
					status: 400
				});
			}
		} catch (error) {
			return message(
				form,
				error + '\n An error occurred while logging in. Please try again or contact support.',
				{
					status: 500
				}
			);
		}

		// Redirect to the dashboard after successful login
		return redirect(302, 'app/dashboard');
	}
};
