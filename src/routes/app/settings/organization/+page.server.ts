import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	addMembersSchema,
	manipulateMemberSchema,
	organizationCreateSchema,
	organizationUpdateSchema
} from '$lib/server/validation/organization.schema';
import { Collections, type OrganizationsResponse, type UsersResponse } from '$lib/types';
import { fail } from '@sveltejs/kit';
import type { OrganizationsExpand } from '$lib/types/expandTypes';

export const load = (async ({ locals, parent }) => {
	// Ensure user and organization is loaded
	await parent();

	const expandedOrganization = await locals.pb
		.collection(Collections.Organizations)
		.getOne<OrganizationsResponse<OrganizationsExpand>>(locals.organization.id, {
			expand: 'admins, members, owner'
		});

	const organizationForm = await superValidate(zod4(organizationCreateSchema));
	const organizationUpdateForm = await superValidate(
		locals.organization,
		zod4(organizationUpdateSchema),
		{ errors: false }
	);
	const addMembersForm = await superValidate(zod4(addMembersSchema));
	const removeMemberForm = await superValidate(zod4(manipulateMemberSchema));
	const addAdminForm = await superValidate(zod4(manipulateMemberSchema));
	const removeAdminForm = await superValidate(zod4(manipulateMemberSchema));

	return {
		user: locals.user,
		role: locals.role,
		organization: expandedOrganization,
		organizationForm,
		organizationUpdateForm,
		addMembersForm,
		removeMemberForm,
		addAdminForm,
		removeAdminForm
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createOrganization: async ({ locals, request }) => {
		console.log('Creating organization...');
		const form = await superValidate(request, zod4(organizationCreateSchema));

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

			const response = await locals.pb.collection(Collections.Organizations).create({
				name: form.data.name,
				description: form.data.description,
				owner: locals.user.id,
				admins: [locals.user.id],
				members: [locals.user.id]
			});

			if (!response) {
				return message(form, 'Failed to create organization. Please try again later.', {
					status: 500
				});
			}
		} catch (error) {
			return message(
				form,
				error instanceof Error
					? error.message
					: 'An error has occurred while updating the username. Please contact support.'
			);
		}
	},
	updateOrganization: async ({ locals, request }) => {
		console.log('Updating organization...');
		const form = await superValidate(request, zod4(organizationUpdateSchema));

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
				.collection(Collections.Organizations)
				.update(locals.organization.id, {
					name: form.data.name,
					description: form.data.description
				});

			if (!response) {
				return message(form, 'Failed to update organization. Please try again later.', {
					status: 500
				});
			}
		} catch (error) {
			return message(
				form,
				error instanceof Error
					? error.message
					: 'An error has occurred while updating the organization. Please contact support.'
			);
		}
	},
	addMembers: async ({ locals, request }) => {
		const form = await superValidate(request, zod4(addMembersSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (!locals.user) {
			return message(form, 'User not authenticated. Please log in to add members.', {
				status: 401
			});
		}

		const members = form.data.members.split(';').map((member) => member.trim());
		const newMembers: string[] = [];

		for (const member of members) {
			try {
				const user = await locals.pb
					.collection<UsersResponse>(Collections.Users)
					.getFirstListItem(`username="${member}"`, {
						fields: 'id, username'
					});

				if (user) {
					newMembers.push(user.id);
				}
			} catch (error) {
				console.error(`Error processing member ${member}:`, error);
				return message(form, `Failed to process member: ${member}. Please check the username.`, {
					status: 400
				});
			}
		}

		try {
			const response = await locals.pb
				.collection<OrganizationsResponse<OrganizationsExpand>>(Collections.Organizations)
				.update(form.data.organizationId, {
					'members+': newMembers
				});
			console.log('Response from adding members:', response);

			if (!response) {
				return message(form, 'Failed to add members. Please try again later.', {
					status: 500
				});
			}
		} catch (error) {
			console.error('Error checking organization members:', error);
			return message(form, 'An error occurred while checking organization members.', {
				status: 500
			});
		}
	},
	removeMember: async ({ locals, request }) => {
		const form = await superValidate(request, zod4(manipulateMemberSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (!locals.user) {
			return message(form, 'User not authenticated. Please log in to remove members.', {
				status: 401
			});
		}

		try {
			const response = await locals.pb
				.collection<OrganizationsResponse<OrganizationsExpand>>(Collections.Organizations)
				.update(form.data.organizationId, {
					'members-': [form.data.userId]
				});

			if (!response) {
				return message(form, 'Failed to remove member. Please try again later.', {
					status: 500
				});
			}
		} catch (error) {
			console.error('Error removing member:', error);
			return message(form, 'An error occurred while removing the member.', {
				status: 500
			});
		}
	},
	addAdmin: async ({ locals, request }) => {
		const form = await superValidate(request, zod4(manipulateMemberSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (!locals.user) {
			return message(form, 'User not authenticated. Please log in to add admins.', {
				status: 401
			});
		}

		try {
			const response = await locals.pb
				.collection<OrganizationsResponse<OrganizationsExpand>>(Collections.Organizations)
				.update(form.data.organizationId, {
					'admins+': [form.data.userId]
				});

			if (!response) {
				return message(form, 'Failed to add admin. Please try again later.', {
					status: 500
				});
			}
		} catch (error) {
			console.error('Error adding admin:', error);
			return message(form, 'An error occurred while adding the admin.', {
				status: 500
			});
		}
	},
	revokeAdmin: async ({ locals, request }) => {
		const form = await superValidate(request, zod4(manipulateMemberSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (!locals.user) {
			return message(form, 'User not authenticated. Please log in to revoke admin status.', {
				status: 401
			});
		}

		try {
			const response = await locals.pb
				.collection<OrganizationsResponse<OrganizationsExpand>>(Collections.Organizations)
				.update(form.data.organizationId, {
					'admins-': [form.data.userId]
				});

			if (!response) {
				return message(form, 'Failed to revoke admin status. Please try again later.', {
					status: 500
				});
			}
		} catch (error) {
			console.error('Error revoking admin:', error);
			return message(form, 'An error occurred while revoking the admin status.', {
				status: 500
			});
		}
	}
};
