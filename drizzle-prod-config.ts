import { defineConfig } from 'drizzle-kit';

if (!process.env.PROD_DATABASE_URL) throw new Error('PROD_DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema/index.ts',
	dialect: 'turso',
	dbCredentials: {
		authToken: process.env.PROD_DATABASE_AUTH_TOKEN,
		url: process.env.PROD_DATABASE_URL
	},
	verbose: true,
	strict: true
});
