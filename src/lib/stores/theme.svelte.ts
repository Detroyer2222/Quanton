// Try to get the theme from localStorage, default to 'dark'
const stored = typeof localStorage !== 'undefined' && localStorage.getItem('theme');
const systemTheme =
	typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
let theme = $state(stored || systemTheme);

// Save theme to localStorage whenever it changes
$effect(() => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('theme', theme);
	}
});

export function toggleTheme() {
	theme = theme === 'dark' ? 'light' : 'dark';
}

export function setTheme(value: string) {
	theme = value;
}

export function getTheme() {
	return theme;
}
