<script lang="ts">
	import '../app.css';
	import { getTheme } from '$lib/stores/theme.svelte';

	let { children } = $props();
</script>

<div data-theme={getTheme} class="bg-light-500 dark:bg-dark-500">
	{@render children()}
</div>

<!-- 
Add Footer here
Lnks to /about, /contact, /privacy, /terms

-->
