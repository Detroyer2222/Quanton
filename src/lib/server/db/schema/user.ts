import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	username: text('username').notNull(),
	passwordHash: text('password_hash').notNull()
});

export type User = typeof user.$inferSelect;
