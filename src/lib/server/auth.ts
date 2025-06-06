import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase, encodeBase32LowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { hash, verify } from '@node-rs/argon2';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { id: table.user.id, username: table.user.username },
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

/**
 * @description
 * Generates a session token for user authentication.
 * @returns A new User ID with 120 bits of entropy, encoded in base32.
 */
export function generateUserId(): string {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

/**
 * @description
 * Validates a username based on specific criteria:
 * - Must be a string.
 * - Must be between 3 and 31 characters long.
 * - Must contain only alphanumeric characters (A-Z, a-z, 0-9).
 * @param username The username to validate.
 * @returns The username if it meets the criteria, otherwise false.
 */
export function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[A-Za-z0-9]+$/.test(username)
	);
}

/**
 * @description
 * Validates a password based on specific criteria:
 * - Must be a string.
 * - Must be between 6 and 255 characters long.
 * - Must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
 * @param password The password to validate.
 * @returns The password if it meets the criteria, otherwise false.
 */
export function validatePassword(password: unknown): password is string {
	return (
		typeof password === 'string' &&
		password.length >= 6 &&
		password.length <= 255 &&
		/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)
	);
}

/**
 * @description
 * Generates a secure hash of the provided password using Argon2.
 * @param password The password to hash.
 * @returns
 */
export async function generatePasswordHash(
	password: string,
	salt: Uint8Array<ArrayBufferLike>
): Promise<string> {
	return hash(password, {
		// recommended minimum parameters
		salt,
		memoryCost: 19456,
		timeCost: 3,
		outputLen: 32,
		parallelism: 1
	});
}

/**
 * @description
 * Verifies a password against a stored hash using Argon2.
 * @param password The password to verify.
 * @param hash The stored hash to compare against.
 * @returns A boolean indicating whether the password matches the hash.
 */
export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
	return verify(password, hash, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 3,
		outputLen: 32,
		parallelism: 1
	});
}

/**
 * @description
 * Validates an email address based on specific criteria:
 * - Must be a string.
 * - Must be between 3 and 255 characters long.
 * - Must match a standard email format.
 * @param email The email to validate.
 * @returns The email if it meets the criteria, otherwise false.
 */
export function validateEmail(email: unknown): email is string {
	return (
		typeof email === 'string' &&
		email.length >= 3 &&
		email.length <= 255 &&
		/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
			email
		)
	);
}
