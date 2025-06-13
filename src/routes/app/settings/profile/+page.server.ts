import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	userRequestEmailChangeSchema,
	userUpdateAvatarSchema,
	userUpdateUsernameSchema
} from '$lib/server/validation/user.schema';
import { Collections, type UsersResponse } from '$lib/types';
import { message, superValidate, withFiles } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = (async ({ locals }) => {
	const avatarForm = await superValidate(zod4(userUpdateAvatarSchema));
	const usernameForm = await superValidate(locals.user, zod4(userUpdateUsernameSchema), {
		errors: false
	});
	const changeEmailForm = await superValidate(locals.user, zod4(userRequestEmailChangeSchema), {
		errors: false
	});

	return {
		user: locals.user,
		data: {}, // Provide an appropriate value for the required 'data' property
		avatarForm,
		usernameForm,
		changeEmailForm
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateUsername: async ({ locals, request }) => {
		console.log('Updating username...');
		const form = await superValidate(request, zod4(userUpdateUsernameSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			if (!locals.user) {
				return message(form, 'User not authenticated. Please log in to update your username.', {
					status: 401
				});
			}

			const response = await locals.pb
				.collection(Collections.Users)
				.update<UsersResponse>(locals.user.id, {
					username: form.data.username
				});

			if (!response) {
				return message(form, 'Failed to update username. Please try again later.', {
					status: 500
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
			return message(
				form,
				error instanceof Error
					? error.message
					: 'An error has occurred while updating the username. Please contact support.'
			);
		}
	},

	updateAvatar: async ({ locals, request }) => {
		console.log('Updating avatar...');
		const form = await superValidate(request, zod4(userUpdateAvatarSchema));

		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		try {
			if (!locals.user) {
				return message(form, 'User not authenticated. Please log in to update your avatar.', {
					status: 401
				});
			}
			const response: UsersResponse = await locals.pb
				.collection(Collections.Users)
				.update<UsersResponse>(locals.user.id, {
					avatar: form.data.avatar
				});

			if (!response) {
				return message(form, 'Failed to update avatar. Please try again later.', {
					status: 500
				});
			}
			locals.user.avatar = response.avatar;
			return {
				status: 200,
				data: {
					message: 'Avatar updated successfully.'
				}
			};
		} catch (error) {
			return message(
				form,
				error instanceof Error
					? error.message
					: 'An error has occurred while updating the avatar. Please contact support.',
				{
					status: 500
				}
			);
		}
	},

	changeEmail: async ({ locals, request }) => {
		console.log('Changing email...');
		const form = await superValidate(request, zod4(userRequestEmailChangeSchema));

		console.log('Form data:', form);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			if (!locals.user) {
				return message(form, 'User not authenticated. Please log in to change your email.', {
					status: 401
				});
			}

			const response = await locals.pb
				.collection(Collections.Users)
				.requestEmailChange(form.data.newEmail);

			if (!response) {
				return message(form, 'Failed to change email. Please try again later.', {
					status: 500
				});
			}
		} catch (error) {
			console.error('Error during email change:', error);
			return message(
				form,
				error instanceof Error
					? error.message
					: 'An error has occurred while changing the email. Please contact support.',
				{
					status: 500
				}
			);
		}
		return redirect(303, '/logout?emailChangeRequested=true');
	}
};
