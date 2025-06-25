<script lang="ts">
	import AddMembersForm from '$lib/components/forms/organizationSettings/AddMembersForm.svelte';
	import ManipulateMemberForm from '$lib/components/forms/organizationSettings/ManipulateMemberForm.svelte';
	import Pager from '$lib/components/tables/Pager.svelte';
	import { OrganizationRoles } from '$lib/rbac/constants';
	import { ShieldCheck, CircleOff } from 'lucide-svelte';
	import type { PageData } from '../../../../routes/app/settings/organization/$types';
	import type { UsersRecord } from '$lib/types';

	let { data }: { data: PageData } = $props();

	let members = data.organization.expand.members || [];
	let trimmedMembers: UsersRecord[] = $state([]);
</script>

<AddMembersForm data={data.addMembersForm} organizationId={data.organization.id} />

<ul class="list bg-base-100 rounded-box shadow-md">
	<li class="p-4 pb-2 text-xs tracking-wide opacity-60">Organization Members:</li>

	{#each trimmedMembers as member}
		<li class="list-row">
			<div class="list-col-grow">
				<div>{member.username}</div>
				<div class="text-xs font-semibold opacity-60">
					{#if data.role === OrganizationRoles.Admin}
						{member.id}
					{/if}
				</div>
			</div>

			<ManipulateMemberForm
				data={data.addAdminForm}
				action="addAdmin"
				buttonColor="btn-success"
				tooltip="Promote to Admin"
				organizationId={data.organization.id}
				memberId={member.id}
				role={data.role}
				successMessage="Member promoted to Admin!"
				failureMessage="Failed to promote member. Please try again."
			>
				<ShieldCheck />
			</ManipulateMemberForm>

			<ManipulateMemberForm
				data={data.addAdminForm}
				action="removeMember"
				buttonColor="btn-error"
				tooltip="Remove Member"
				organizationId={data.organization.id}
				memberId={member.id}
				role={data.role}
				successMessage="Removed member from organization!"
				failureMessage="Failed to remove member. Please try again."
			>
				<CircleOff />
			</ManipulateMemberForm>
		</li>
	{/each}
</ul>
<Pager rows={members} bind:trimmedRows={trimmedMembers} />
