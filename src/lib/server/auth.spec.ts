import { describe, it, expect } from 'vitest';
import {
  generateUserId,
  generateUsername,
  generatePasswordHash,
  verifyPasswordHash
} from './auth';

// These tests focus on the small helper utilities that don't require
// database access or request events.

describe('auth utility functions', () => {
  it('generateUserId returns a valid UUID v4', () => {
    const id = generateUserId();
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidV4Regex);
  });

  it('generateUsername returns a string starting with "user_"', () => {
    const username = generateUsername();
    expect(username.startsWith('user_')).toBe(true);
    expect(username.length).toBeGreaterThan('user_'.length);
  });

  it('password hash verifies successfully', async () => {
    const password = 's3cureP@ssword!';
    const hash = await generatePasswordHash(password);
    const valid = await verifyPasswordHash(hash, password);
    expect(valid).toBe(true);
  });

  it('wrong password fails verification', async () => {
    const hash = await generatePasswordHash('correct');
    const valid = await verifyPasswordHash(hash, 'wrong');
    expect(valid).toBe(false);
  });
});
