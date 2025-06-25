import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setTheme, getSwapTheme, toggleTheme } from './theme.svelte';

describe('theme store', () => {
  beforeEach(() => {
    setTheme('dracula');
    delete (global as any).window;
    vi.restoreAllMocks();
  });

  it('getSwapTheme returns the opposite of the current theme', () => {
    setTheme('dracula');
    expect(getSwapTheme()).toBe('silk');
    setTheme('silk');
    expect(getSwapTheme()).toBe('dracula');
  });

  it('toggleTheme stores the new theme when window is defined', () => {
    const setItem = vi.fn();
    (global as any).window = {};
    (global as any).localStorage = { setItem };
    toggleTheme();
    expect(setItem).toHaveBeenCalledWith('theme', 'silk');
    expect(getSwapTheme()).toBe('dracula');
  });

  it('toggleTheme works without window defined', () => {
    expect(() => toggleTheme()).not.toThrow();
    expect(getSwapTheme()).toBe('dracula');
  });
});
