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

export const userLoginSchema = z.object({
	email: z.email('Invalid email format.').max(255, 'Email must be at most 255 characters.'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters.')
		.max(255, 'Password must be at most 255 characters.')
});

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

export const userUpdateAvatarSchema = z.object({
	avatar: z
		.file()
		.min(1, 'Avatar is required.')
		.max(5 * 1024 * 1024, 'Avatar must be at most 5MB.')
		.mime(
			['image/png', 'image/jpeg', 'image/webp'],
			'Invalid file type. Only PNG, JPEG, and WebP are allowed.'
		)
});

export const userRequestEmailChangeSchema = z
	.object({
		email: z.email('Invalid email format.').max(255, 'Email must be at most 255 characters.'),
		newEmail: z
			.email('Invalid email format.')
			.min(1, 'Email is required.')
			.max(255, 'Email must be at most 255 characters.')
			.refine(
				async (email) => {
					try {
						const pb = await authenticatePocketbase();
						const existingUser = await pb.collection(Collections.Users).getFullList({
							filter: `email = "${email}"`
						});
						// Check for unknown
						if (existingUser[0]) {
							return false; // Email is taken
						} else {
							return true;
						}
					} catch (error) {
						console.error('Error checking email availability:', error);
						return false; // If there's an error, treat it as unavailable
					}
				},
				{ error: 'Email already taken.', abort: true }
			)
	})
	.refine((data) => data.email !== data.newEmail, {
		message: 'New email must be different from the current email.',
		path: ['newEmail']
	});

export const userPasswordResetSchema = z.object({
	email: z.email('Invalid email format.').max(255, 'Email must be at most 255 characters.')
});

export const userConfirmPasswordResetSchema = z
	.object({
		token: z.string().min(1, 'Reset token is required.'),
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
