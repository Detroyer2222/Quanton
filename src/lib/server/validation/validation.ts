import { z, ZodError, ZodObject } from 'zod/v4';

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
