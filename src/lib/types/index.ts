/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
	Superusers = '_superusers',
	Organizations = 'organizations',
	Users = 'users'
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T };

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString;
	collectionId: string;
	collectionName: Collections;
} & ExpandType<T>;

export type AuthSystemFields<T = unknown> = {
	email: string;
	emailVisibility: boolean;
	username: string;
	verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type SuperusersRecord = {
	created?: IsoDateString;
	email: string;
	emailVisibility?: boolean;
	id: string;
	password: string;
	tokenKey: string;
	updated?: IsoDateString;
	verified?: boolean;
};

export type OrganizationsRecord = {
	admins?: RecordIdString[];
	created?: IsoDateString;
	description?: string;
	id: string;
	logo?: string;
	members?: RecordIdString[];
	name: string;
	owner?: RecordIdString;
	updated?: IsoDateString;
};

export type UsersRecord = {
	avatar?: string;
	created?: IsoDateString;
	email: string;
	emailVisibility?: boolean;
	id: string;
	password: string;
	tokenKey: string;
	updated?: IsoDateString;
	username: string;
	verified?: boolean;
};

// Response types include system fields and match responses from the PocketBase API
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> &
	AuthSystemFields<Texpand>;
export type OrganizationsResponse<Texpand = unknown> = Required<OrganizationsRecord> &
	BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_superusers: SuperusersRecord;
	organizations: OrganizationsRecord;
	users: UsersRecord;
};

export type CollectionResponses = {
	_superusers: SuperusersResponse;
	organizations: OrganizationsResponse;
	users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>;
	collection(idOrName: 'organizations'): RecordService<OrganizationsResponse>;
	collection(idOrName: 'users'): RecordService<UsersResponse>;
};
