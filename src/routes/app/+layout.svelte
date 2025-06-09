<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Navbar from '$lib/components/Navbar.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const links = [
		{ href: 'about', label: 'About' },
		{ href: 'contact', label: 'Contact' },
		{ href: 'privacy', label: 'Privacy' }
	];
</script>

{#snippet start()}
	<a class="btn btn-ghost text-xl" href="/dashboard">Quanton App</a>
{/snippet}

{#snippet end()}{/snippet}

<Navbar {start} {links} {end} />

<div>
	{@render children()}
</div>
