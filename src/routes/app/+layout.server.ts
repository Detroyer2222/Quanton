import type { LayoutServerLoad } from './$types';
import { findUserOrganization, getUserRole } from '$lib/pocketbase/functions/organization';
import { redirect } from '@sveltejs/kit';
import { OrganizationRoles } from '$lib/rbac/constants';

export const load = (async ({ locals }) => {
	// Ensure user is loaded
	if (!locals.user) {
		return redirect(303, '/login');
	}

	const organization = await findUserOrganization(locals.pb, locals.user.id);
	if (organization) {
		locals.organization = organization;
		locals.role = getUserRole(organization, locals.user.id);
	} else {
		locals.organization = null;
		locals.role = OrganizationRoles.Undefined;
	}

	return {
		user: locals.user,
		data: {} // Provide an appropriate value for the required 'data' property
	};
}) satisfies LayoutServerLoad;
