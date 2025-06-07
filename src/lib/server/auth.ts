/**
 * @module auth
 *
 * Provides authentication utilities for session management, password hashing, and user identification.
 *
 * ## Features
 * - Session creation, validation, renewal, and invalidation
 * - Secure session token generation and cookie management
 * - User ID generation (UUID v4)
 * - Password hashing and verification using Argon2
 *
 * ## Functions
 * - `createSession(event, userLogin)`: Creates a new session for a user, stores it in the database, and sets a session cookie.
 * - `generateSessionToken()`: Generates a secure, random session token encoded in base64url.
 * - `validateSessionToken(token)`: Validates a session token, checks for expiration, renews if necessary, and returns session/user info.
 * - `invalidateSession(sessionId)`: Deletes a session from the database by its ID.
 * - `setSessionTokenCookie(event, token, expiresAt)`: Sets the session token as a cookie in the response.
 * - `deleteSessionTokenCookie(event)`: Deletes the session token cookie from the response.
 * - `generateUserId()`: Generates a new UUID v4 string for user identification.
 * - `generatePasswordHash(password)`: Hashes a password securely using Argon2.
 * - `verifyPasswordHash(password, hash)`: Verifies a password against a stored Argon2 hash.
 *
 * ## Types
 * - `SessionValidationResult`: The result type of `validateSessionToken`, containing session and user information.
 *
 * @remarks
 * - Session tokens are hashed before storage for security.
 * - Session expiration and renewal are handled automatically.
 * - Password hashing uses recommended Argon2 parameters for security.
 */
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { hash, verify } from '@node-rs/argon2';
import { v4 as uuidv4 } from 'uuid';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const sessionCookieName = 'auth-session';

/**
 * @description
 * Creates a new session for a user and sets a session cookie.
 * @param event The request event containing the cookies.
 * @param userId The ID of the user for whom the session is being created.
 * @returns An object indicating success or failure of session creation.
 */
export async function createSession(
	event: RequestEvent,
	userId: string
): Promise<{ error: boolean; message: string }> {
	const token = generateSessionToken();

	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId: userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};

	try {
		await db.insert(table.session).values(session);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return {
			error: true,
			message: 'An error occurred while creating the session. Please try again later.'
		};
	}

	setSessionTokenCookie(event, token, session.expiresAt);

	return { error: false, message: 'Session created successfully.' };
}

function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

/**
 * @description
 * Validates a session token, checks for expiration, and renews if necessary.
 * @param token The session token to validate.
 * @returns An object containing the session and user information, or null if invalid.
 */
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

/**
 * @description
 * Invalidates a session by deleting it from the database.
 * @param sessionId The ID of the session to invalidate.
 */
export async function invalidateSession(sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

/**
 * @description
 * Deletes the session token cookie from the response.
 * @param event The request event containing the cookies.
 */
export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

/**
 * @description
 * Generates a new User ID.
 * @returns A UUID v4 string representing the User ID.
 */
export function generateUserId(): string {
	return uuidv4();
}

/**
 * @description
 * Generates a random username in the format "user_<random_string>".
 * @returns A string representing the generated username.
 */
export function generateUsername(): string {
	const randomString = Math.random().toString(36).substring(2, 10);
	return `user_${randomString}`;
}

/**
 * @description
 * Generates a secure hash of the provided password using Argon2.
 * @param password The password to hash.
 * @returns
 */
export async function generatePasswordHash(password: string): Promise<string> {
	return hash(password, {
		// recommended minimum parameters
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
export function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
	// Use the verify function from Argon2 to check the password against the hash
	return verify(password, hash, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 3,
		outputLen: 32,
		parallelism: 1
	});
}
