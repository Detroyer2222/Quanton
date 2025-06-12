import { z, ZodError, ZodObject } from 'zod/v4';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import {
	PRIVATE_POCKETBASE_VALIDATION_USER,
	PRIVATE_POCKETBASE_VALIDATION_PASSWORD
} from '$env/static/private';
import Pocketbase from 'pocketbase';
import { type TypedPocketBase, Collections } from '$lib/types';

/**
 * @description
 * Validates form data against a provided Zod schema.
 * @param formData
 * @param schema
 * @returns An object containing the validated form data and any validation errors.
 */
export async function validateFormData(formData: FormData, schema: ZodObject) {
	const body = Object.fromEntries(formData.entries());

	try {
		const data = await schema.parseAsync(body);
		return {
			formData: data,
			errors: null
		};
	} catch (error) {
		console.error('Validation error:', error);
		const errors = z.flattenError(error as ZodError);
		return {
			formData: body,
			errors: errors
		};
	}
}

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
