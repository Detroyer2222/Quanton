import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import {
	PRIVATE_POCKETBASE_VALIDATION_USER,
	PRIVATE_POCKETBASE_VALIDATION_PASSWORD
} from '$env/static/private';
import Pocketbase from 'pocketbase';
import { type TypedPocketBase, Collections } from '$lib/types';

export async function authenticatePocketbase(): Promise<TypedPocketBase> {
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const auth = await pb
		.collection(Collections.Superusers)
		.authWithPassword(PRIVATE_POCKETBASE_VALIDATION_USER, PRIVATE_POCKETBASE_VALIDATION_PASSWORD);

	if (!pb.authStore.isValid) {
		throw new Error('Pocketbase authentication failed. Please check your credentials.');
	}
	return pb as TypedPocketBase;
}
