import type { TypedPocketBase, UsersRecord } from '$lib/pocketbase';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			pb: TypedPocketBase;
			user: UsersRecord | null;
		}
		interface PageData {
			data: Record<string, string>;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
