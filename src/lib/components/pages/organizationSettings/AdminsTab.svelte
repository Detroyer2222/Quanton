<script lang="ts">
	import type { PageData } from '../../../../routes/app/settings/organization/$types';
	import type { UsersRecord } from '$lib/types';
	import ManipulateMemberForm from '$lib/components/forms/organizationSettings/ManipulateMemberForm.svelte';
	import Pager from '$lib/components/tables/Pager.svelte';
	import { OrganizationRoles } from '$lib/rbac/constants';
	import { ShieldOff, CircleOff } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let admins = data.organization.expand.admins || [];
	let trimmedAdmins: UsersRecord[] = $state([]);
</script>

<ul class="list bg-base-100 rounded-box shadow-md">
	<li class="p-4 pb-2 text-xs tracking-wide opacity-60">Organization Admins:</li>

	{#each trimmedAdmins as admin}
		<li class="list-row">
			<div class="list-col-grow">
				<div>{admin.username}</div>
				<div class="text-xs font-semibold opacity-60">
					{#if data.role === OrganizationRoles.Admin}
						{admin.id}
					{/if}
				</div>
			</div>

			<ManipulateMemberForm
				data={data.addAdminForm}
				action="revokeAdmin"
				buttonColor="btn-error"
				tooltip="Revoke Admin rights"
				organizationId={data.organization.id}
				memberId={admin.id}
				role={data.role}
				successMessage="Admin privileges revoked!"
				failureMessage="Failed to revoke admin privileges. Please try again."
			>
				<ShieldOff />
			</ManipulateMemberForm>

			<ManipulateMemberForm
				data={data.addAdminForm}
				action="removeMember"
				buttonColor="btn-error"
				tooltip="Remove Member"
				organizationId={data.organization.id}
				memberId={admin.id}
				role={data.role}
				successMessage="Removed member from organization!"
				failureMessage="Failed to remove member. Please try again."
			>
				<CircleOff />
			</ManipulateMemberForm>
		</li>
	{/each}
</ul>
<Pager rows={admins} bind:trimmedRows={trimmedAdmins} />
