<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/state';
	import { Building2, User } from 'lucide-svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="flex w-full flex-col items-center space-y-6 p-6">
	<!-- Centered Heading -->
	<h1 class="mb-14 text-center text-5xl font-bold">Settings</h1>

	<div class="w-4/5">
		<!-- Tabs centered -->
		<div role="tablist" class="tabs tabs-lift tabs-xl justify-center">
			<a
				role="tab"
				href="/app/settings/profile"
				class="tab"
				class:tab-active={page.url.pathname.endsWith('profile')}
			>
				<User class="mr-2 h-8 w-8" />
				Profile
			</a>
			<div class="tab-content bg-base-100 border-base-300 rounded-2xl p-6">
				{@render children()}
			</div>
			<a
				role="tab"
				href="/app/settings/organization"
				class="tab"
				class:tab-active={page.url.pathname.endsWith('organization')}
			>
				<Building2 class="mr-2 h-8 w-8" />
				Organization
			</a>
			<div class="tab-content bg-base-100 border-base-300 p-6">
				{@render children()}
			</div>
		</div>
	</div>
</div>
