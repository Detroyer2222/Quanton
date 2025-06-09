// src/lib/stores/theme.svelte.ts

let currentTheme = $state('dracula');

// Toggle and setter helpers
function toggleTheme() {
	currentTheme = getSwapTheme();

	if (typeof window !== 'undefined') {
		localStorage.setItem('theme', currentTheme);
	}
}

function setTheme(theme: 'dracula' | 'silk') {
	currentTheme = theme;
}

function getSwapTheme() {
	return currentTheme === 'silk' ? 'dracula' : 'silk';
}

export { toggleTheme, setTheme, getSwapTheme };
