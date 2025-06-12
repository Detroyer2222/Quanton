<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { setTheme } from '$lib/stores/theme.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Toaster } from 'svelte-sonner';

	let { children }: { children: Snippet } = $props();

	$effect(() => {
		let initialTheme;

		if (typeof window !== 'undefined') {
			initialTheme = localStorage.getItem('theme');
			if (initialTheme === 'dracula' || initialTheme === 'silk') {
				setTheme(initialTheme);
			}
		}

		// Fallback to system preference if no theme is saved
		initialTheme = document.documentElement.getAttribute('data-theme') ?? 'dracula';
		if (initialTheme === 'dracula' || initialTheme === 'silk') {
			setTheme(initialTheme);
		}
	});
</script>

<Toaster position="top-right" richColors theme="dark" />
<div>
	{@render children()}
</div>

<Footer />
