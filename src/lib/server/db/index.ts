import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

let databaseUrl: string, databaseAuthToken: string;

if (dev) {
	if (!env.DEV_DATABASE_URL) throw new Error('DEV_DATABASE_URL is not set');
	if (!env.DEV_DATABASE_AUTH_TOKEN) throw new Error('DEV_DATABASE_AUTH_TOKEN is not set');

	databaseUrl = env.DEV_DATABASE_URL;
	databaseAuthToken = env.DEV_DATABASE_AUTH_TOKEN;
} else {
	if (!env.PROD_DATABASE_URL) throw new Error('PROD_DATABASE_URL is not set');
	if (!env.PROD_DATABASE_AUTH_TOKEN) throw new Error('PROD_DATABASE_AUTH_TOKEN is not set');

	databaseUrl = env.PROD_DATABASE_URL;
	databaseAuthToken = env.PROD_DATABASE_AUTH_TOKEN;
}

const client = createClient({
	url: databaseUrl,
	authToken: databaseAuthToken
});

export const db = drizzle(client, { schema });
