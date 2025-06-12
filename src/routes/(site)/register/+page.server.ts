import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { validateFormData } from '$lib/server/validation/validation';
import { userRegisterSchema, type UserRegister } from '$lib/server/validation/user.schema';
import { Collections } from '$lib/types';

export const load = (async () => {
	return { data: {} };
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async ({ locals, request }) => {
		console.log('Register action called');
		const { formData, errors } = await validateFormData(
			await request.formData(),
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

		try {
			console.log('Attempting to create user with data:', validatedData);
			const result = await locals.pb.collection(Collections.Users).create({
				email: validatedData.email,
				username: validatedData.username,
				password: validatedData.password,
				passwordConfirm: validatedData.confirmPassword
			});
			console.log('User created successfully:', result);
			const emailResult = await locals.pb
				.collection(Collections.Users)
				.requestVerification(validatedData.email);
			console.log('Verification email sent:', emailResult);
		} catch (error) {
			return fail(500, {
				data: formData,
				errors: {
					message:
						error instanceof Error
							? error.message
							: 'An error has occurred while registering the user. Please contact support.'
				}
			});
		}

		throw redirect(303, '/login?registered=true');
	}
};
