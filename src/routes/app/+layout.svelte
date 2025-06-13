<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Navbar from '$lib/components/Navbar.svelte';
	import { User } from 'lucide-svelte';
	import { getImageUrl } from '$lib/pocketbase/utils';
	import { Collections } from '$lib/types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const links = [
		{ href: 'dashboard', label: 'Dashboard' },
		{ href: 'organization', label: 'Organization' }
	];
	$inspect(data);
	let imageLoadError = $state(false);
</script>

{#snippet start()}
	<a class="btn btn-ghost text-xl" href="/dashboard">Quanton App</a>
{/snippet}

{#snippet end()}
	<div class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
			<div class="w-10 rounded-full">
				{#if imageLoadError}
					<User class="mx-auto h-8 w-8" />
				{:else}
					<img
						class="mx-auto h-8 w-8"
						src={getImageUrl(Collections.Users, data.user.id, data.user.avatar, '32x32')}
						alt="User Avatar"
						loading="lazy"
						onerror={() => (imageLoadError = true)}
					/>
				{/if}
			</div>
		</div>
		<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
			<li>{data.user.username}</li>
			<li><a href="settings/profile">Profile</a></li>
			<li><a href="settings/organization">Organization Settings</a></li>
			<li><a href="/logout">Logout</a></li>
		</ul>
	</div>
{/snippet}

<Navbar {start} {links} {end} />

<div>
	{@render children()}
</div>
