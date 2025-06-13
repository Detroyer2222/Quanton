import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { userRegisterSchema } from '$lib/server/validation/user.schema';
import { Collections } from '$lib/types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = (async () => {
	const form = await superValidate(zod4(userRegisterSchema));
	return {
		data: {},
		form
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async ({ locals, request }) => {
		console.log('Register action called');
		const form = await superValidate(request, zod4(userRegisterSchema));
		console.log(form);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const result = await locals.pb.collection(Collections.Users).create({
				email: form.data.email,
				username: form.data.username,
				password: form.data.password,
				passwordConfirm: form.data.confirmPassword
			});
			console.log('User created successfully:', result);
			const emailResult = await locals.pb
				.collection(Collections.Users)
				.requestVerification(form.data.email);
			console.log('Verification email sent:', emailResult);
		} catch (error) {
			return message(
				form,
				error +
					'\n An error occurred while registering the user. Please try again or contact support.',
				{
					status: 500
				}
			);
		}

		throw redirect(303, '/login?registered=true');
	}
};
