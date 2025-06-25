import type { UsersRecord } from '$lib/pocketbase';
import type { OrganizationRoles } from '$lib/rbac/constants';
import type { OrganizationRecord } from '$lib/types';
import PocketBase from 'pocketbase';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			pb: PocketBase;
			user: UsersRecord | null;
			organization: OrganizationRecord | null;
			role: OrganizationRoles;
		}
		interface PageData {
			data: Record<string, string>;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
