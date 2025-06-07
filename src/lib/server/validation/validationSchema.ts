import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { db } from '../db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';

export const userRegisterSchema = z
	.object({
		email: z
			.email('Invalid email format.')
			.max(255, 'Email must be at most 255 characters.')
			.refine(
				async (email) => {
					const results = await db.select().from(table.user).where(eq(table.user.email, email));
					const existingUser = results.at(0);
					return !existingUser;
				},
				{ error: 'Email already registered.', abort: true }
			),
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

export const userLoginSchema = z
	.object({
		email: z.email('Invalid email format.').refine(
			async (email) => {
				const results = await db.select().from(table.user).where(eq(table.user.email, email));
				const existingUser = results.at(0);
				return !!existingUser;
			},
			{ error: 'Email not registered.', abort: true }
		),
		password: z.string().refine(
			async (password) => {
				return password.length >= 6 && password.length <= 255;
			},
			{ error: 'Wrong Password', abort: true }
		)
	})
	.refine(
		async (data) => {
			const results = await db.select().from(table.user).where(eq(table.user.email, data.email));
			const existingUser = results.at(0);
			if (!existingUser) {
				return false;
			}
			const validPassword = await auth.verifyPasswordHash(
				existingUser?.passwordHash,
				data.password
			);
			return validPassword;
		},
		{
			message: 'Wrong Password',
			path: ['password'],
			abort: true
		}
	);

export type UserLogin = z.infer<typeof userLoginSchema>;
