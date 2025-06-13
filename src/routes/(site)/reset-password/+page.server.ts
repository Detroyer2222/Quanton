import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { userPasswordResetSchema } from '$lib/server/validation/user.schema';
import { Collections } from '$lib/types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = (async () => {
	// Always create both forms but only populate the relevant one
	const requestForm = await superValidate(zod4(userPasswordResetSchema));

	return {
		data: {},
		requestForm
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	requestReset: async ({ locals, request }) => {
		const form = await superValidate(request, zod4(userPasswordResetSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await locals.pb.collection(Collections.Users).requestPasswordReset(form.data.email);

			return message(form, {
				text: "If an account with that email exists, we've sent you a password reset link. Please check your email."
			});
		} catch {
			// Don't reveal if email exists or not for security
			return message(form, {
				text: "If an account with that email exists, we've sent you a password reset link. Please check your email."
			});
		}
	}
};
