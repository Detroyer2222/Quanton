import type { UsersResponse } from '.';

export type OrganizationsExpand = {
	owner: UsersResponse;
	admins: UsersResponse[];
	members: UsersResponse[];
};
