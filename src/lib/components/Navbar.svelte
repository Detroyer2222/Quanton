<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		start,
		links,
		end
	}: { start: Snippet; links: { href: string; label: string }[]; end: Snippet } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="navbar-start">
		{@render start()}
	</div>
	<div class="navbar-center gap-4">
		{#each links as { href, label }}
			<a class="btn btn-ghost" {href}>{label}</a>
		{/each}
	</div>
	<div class="navbar-end">
		{@render end()}
	</div>
</div>
