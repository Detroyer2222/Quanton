import { Collections } from '$lib/types';
import z from 'zod/v4';
import { authenticatePocketbase } from './validation';

export const organizationCreateSchema = z.object({
	name: z
		.string()
		.min(1, 'Organization name is required.')
		.max(100, 'Organization name must be at most 100 characters.')
		.refine(
			async (name) => {
				try {
					const pb = await authenticatePocketbase();
					const existingOrganization = await pb.collection(Collections.Organizations).getFullList({
						filter: `name = "${name}"`
					});

					// Check for unknown
					if (existingOrganization[0]) {
						console.log('Organization name is already taken:', name);
						return false; // Organization name is taken
					} else {
						console.log('Organization name is available:', name);
						return true;
					}
				} catch (error) {
					console.error('Error checking organization name availability:', error);
					return false; // If there's an error, treat it as unavailable
				}
			},
			{ error: 'Organization Name already taken.', abort: true }
		),
	description: z.string().max(255, 'Description must be at most 255 characters.').optional(),
	logo: z
		.file()
		.max(5 * 1024 * 1024, 'Logo must be at most 5MB.')
		.mime(
			['image/png', 'image/jpeg', 'image/webp'],
			'Invalid file type. Only PNG, JPEG, and WebP are allowed.'
		)
		.optional()
});
export type OrganizationCreateSchema = typeof organizationCreateSchema;

export const organizationUpdateSchema = z.object({
	name: z
		.string()
		.min(1, 'Organization name is required.')
		.max(100, 'Organization name must be at most 100 characters.')
		.optional()
		.refine(
			async (name) => {
				try {
					const pb = await authenticatePocketbase();
					const existingOrganization = await pb.collection(Collections.Organizations).getFullList({
						filter: `name = "${name}"`
					});

					// Check for unknown
					if (existingOrganization[0]) {
						console.log('Organization name is already taken:', name);
						return false; // Organization name is taken
					} else {
						console.log('Organization name is available:', name);
						return true;
					}
				} catch (error) {
					console.error('Error checking organization name availability:', error);
					return false; // If there's an error, treat it as unavailable
				}
			},
			{ error: 'Organization Name already taken.', abort: true }
		),
	description: z.string().max(255, 'Description must be at most 255 characters.').optional(),
	logo: z
		.file()
		.max(5 * 1024 * 1024, 'Logo must be at most 5MB.')
		.mime(
			['image/png', 'image/jpeg', 'image/webp'],
			'Invalid file type. Only PNG, JPEG, and WebP are allowed.'
		)
		.optional()
});
export type OrganizationUpdateSchema = typeof organizationUpdateSchema;

export const addMembersSchema = z.object({
	organizationId: z.string().min(1, 'Organization ID is required.'),
	members: z.string().min(1, 'At least one member is required.')
});
export type AddMembersSchema = typeof addMembersSchema;

export const manipulateMemberSchema = z.object({
	organizationId: z.string().min(1, 'Organization ID is required.'),
	userId: z.string().min(1, 'User ID is required.')
});
export type ManipulateMemberSchema = typeof manipulateMemberSchema;
