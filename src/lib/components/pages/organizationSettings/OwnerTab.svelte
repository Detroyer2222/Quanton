<script lang="ts">
	import { getImageUrl } from '$lib/pocketbase/functions/utils';
	import { Collections, type UsersRecord } from '$lib/types';
	import type { PageData } from '../../../../routes/app/settings/organization/$types';

	let { data }: { data: PageData } = $props();

	const owner: UsersRecord = data.organization.expand.owner;
	let avatarLoadError = $state(false);
</script>

<div class="space-y-6">
	<div class="text-center">
		<h3 class="mb-2 text-lg font-semibold">Organization Owner</h3>
	</div>

	<div class="card bg-base-200 mx-auto max-w-md shadow-md">
		<div class="card-body items-center text-center">
			<div class="avatar mb-4">
				<div class="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
					{#if avatarLoadError}
						<div class="skeleton h-24 w-24 rounded-full"></div>
					{:else}
						<img
							src={getImageUrl(Collections.Users, owner.id, owner.avatar ?? '', '144x144')}
							alt="Owner avatar"
							loading="lazy"
							onerror={() => (avatarLoadError = true)}
						/>
					{/if}
				</div>
			</div>

			<div class="space-y-3">
				<div>
					<h4 class="text-base-content text-xl font-bold">
						{owner.username}
					</h4>
					<p class="text-base-content/70">{owner.email}</p>
				</div>
			</div>

			<div class="stats stats-vertical bg-base-100 mt-4 shadow">
				<div class="stat">
					<div class="stat-title">Member Since</div>
					<div class="stat-value text-sm">
						{owner.created
							? new Date(owner.created).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})
							: 'Unknown'}
					</div>
				</div>

				<div class="stat">
					<div class="stat-title">Organization Created</div>
					<div class="stat-value text-sm">
						{new Date(data.organization.created).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
