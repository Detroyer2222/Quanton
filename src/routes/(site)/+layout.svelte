<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Navbar from '$lib/components/Navbar.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const links = [
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' },
		{ href: '/privacy', label: 'Privacy' }
	];
</script>

{#snippet start()}
	<a class="btn btn-ghost text-xl" href="/">Quanton</a>
{/snippet}

{#snippet end()}
	<div class="flex gap-2">
		<a class="btn btn-soft px-4" href="login">Log in</a>
		<a class="btn btn-soft btn-primary" href="register">Sign up</a>
	</div>
{/snippet}

<Navbar {start} {links} {end} />

{@render children()}
