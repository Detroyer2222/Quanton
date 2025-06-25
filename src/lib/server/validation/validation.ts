import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import Pocketbase from 'pocketbase';
import { Collections, type TypedPocketBase } from '$lib/types';
import {
	PRIVATE_POCKETBASE_VALIDATION_USER,
	PRIVATE_POCKETBASE_VALIDATION_PASSWORD
} from '$env/static/private';

export async function authenticatePocketbase(): Promise<TypedPocketBase> {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const auth = await pb
		.collection(Collections.Superusers)
		.authWithPassword(PRIVATE_POCKETBASE_VALIDATION_USER, PRIVATE_POCKETBASE_VALIDATION_PASSWORD);

	// pb.authStore.save(PRIVATE_POCKETBASE_VALIDATION_TOKEN);
	if (!pb.authStore.isValid) {
		throw new Error('Pocketbase authentication failed. Please check your credentials.');
	}
	return pb as TypedPocketBase;
}
