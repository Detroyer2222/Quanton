import { createInsertSchema } from 'drizzle-zod';
import { user } from '../db/schema';

export const userSchema = createInsertSchema(user);
