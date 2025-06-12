import { z } from 'zod/v4';
import { authenticatePocketbase } from './validation';
import { Collections } from '$lib/types';

export const userRegisterSchema = z
	.object({
		email: z.email('Invalid email format.').max(255, 'Email must be at most 255 characters.'),
		username: z
			.string({ error: 'Username is required.' })
			.min(3, 'Username must be at least 3 characters.')
			.max(50, 'Username must be at most 50 characters.'),
		password: z
			.string({ error: 'Password is required.' })
			.min(8, 'Password must be at least 8 characters.')
			.max(255, 'Password must be at most 255 characters.')
			.regex(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
				'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
			),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword']
	});
export type UserRegister = z.infer<typeof userRegisterSchema>;

export const userLoginSchema = z.object({
	email: z.email('Invalid email format.').max(255, 'Email must be at most 255 characters.'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters.')
		.max(255, 'Password must be at most 255 characters.')
});
export type UserLogin = z.infer<typeof userLoginSchema>;

export const userUpdateUsernameSchema = z.object({
	username: z
		.string({ error: 'Username is required.' })
		.min(3, 'Username must be at least 3 characters.')
		.max(50, 'Username must be at most 50 characters.')
		.refine(
			async (username) => {
				try {
					const pb = await authenticatePocketbase();
					const existingUser = await pb.collection(Collections.Users).getFullList({
						filter: `username = "${username}"`
					});
					// Check for unknown
					if (existingUser[0]) {
						console.log('Username is already taken:', username);
						return false; // Username is taken
					} else {
						console.log('Username is available:', username);
						return true;
					}
				} catch (error) {
					console.error('Error checking username availability:', error);
					return false; // If there's an error, treat it as unavailable
				}
			},
			{ error: 'Username already taken.', abort: true }
		)
});
export type UserUpdateUsername = z.infer<typeof userUpdateUsernameSchema>;
