import { OrganizationRoles } from '$lib/rbac/constants';
import { type TypedPocketBase, type OrganizationsRecord, Collections } from '$lib/types';

export async function findUserOrganization(
	pb: TypedPocketBase,
	userId: string
): Promise<OrganizationsRecord | null> {
	try {
		const organization = await pb
			.collection(Collections.Organizations)
			.getFirstListItem(`members~"${userId}"`);

		if (organization) {
			return organization as OrganizationsRecord;
		}

		return null;
	} catch (error) {
		console.error('Error fetching user organization:', error);
		return null;
	}
}

export function getUserRole(organization: OrganizationsRecord, userId: string): OrganizationRoles {
	if (organization.owner === userId || organization.admins?.includes(userId)) {
		return OrganizationRoles.Admin;
	}

	if (organization.members?.includes(userId)) {
		return OrganizationRoles.Member;
	}

	return OrganizationRoles.Undefined;
}
