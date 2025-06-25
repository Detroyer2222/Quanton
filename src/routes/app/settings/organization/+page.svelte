<script lang="ts">
	import type { PageData } from './$types';
	import CreateOrganizationForm from '$lib/components/forms/organizationSettings/CreateOrganizationForm.svelte';
	import UpdateOrganizationForm from '$lib/components/forms/organizationSettings/UpdateOrganizationForm.svelte';
	import MembersTab from '$lib/components/pages/organizationSettings/MembersTab.svelte';
	import AdminsTab from '$lib/components/pages/organizationSettings/AdminsTab.svelte';
	import OwnerTab from '$lib/components/pages/organizationSettings/OwnerTab.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full w-full flex-col space-y-6">
	{#if data.organization}
		<!-- In Organization -->
		<div class="flex h-full w-full flex-col justify-start gap-6">
			<UpdateOrganizationForm
				data={data.organizationUpdateForm}
				role={data.role}
				organization={data.organization}
			/>

			<div class="tabs tabs-lift">
				<label class="tab">
					Members
					<input class="hidden" type="radio" name="organization-tabs" checked />
				</label>
				<div class="tab-content bg-base-100 border-base-300 space-y-4 p-6">
					<MembersTab {data} />
				</div>

				<label class="tab"
					>Admins
					<input class="hidden" type="radio" name="organization-tabs" />
				</label>
				<div class="tab-content bg-base-100 border-base-300 p-6">
					<AdminsTab {data} />
				</div>

				<label class="tab">
					Owner
					<input class="hidden" type="radio" name="organization-tabs" />
				</label>
				<div class="tab-content bg-base-100 border-base-300 p-6">
					<OwnerTab {data} />
				</div>
			</div>
		</div>
	{:else}
		<!-- Not in Organization: Show create org form -->
		<CreateOrganizationForm data={data.organizationForm} />
	{/if}
</div>
