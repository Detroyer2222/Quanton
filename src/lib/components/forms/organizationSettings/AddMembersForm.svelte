<script lang="ts">
	import type { AddMembersSchema } from '$lib/server/validation/organization.schema';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	let {
		data,
		organizationId
	}: { data: SuperValidated<Infer<AddMembersSchema>>; organizationId: string } = $props();

	const { form, errors, enhance, delayed } = superForm(data, {
		onError({ result }) {
			toast.error(result.error.message || 'Failed to add members. Please try again.');
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Members added successfully!');
			}
		}
	});
</script>

<form action="?/addMembers" method="post" class="flex flex-row justify-between" use:enhance>
	<input type="text" name="organizationId" class="hidden" value={organizationId} />
	<input
		type="text"
		name="members"
		placeholder="Add Members by ; separated Usernames"
		class="input input-primary w-1/2"
		bind:value={$form.members}
		required
	/>

	{#if $errors.members}
		{#each $errors.members as error}
			<p class="label text-error text-wrap">
				{error}
			</p>
		{/each}
	{/if}

	<button type="submit" class="btn btn-primary" disabled={$delayed}>
		{#if $delayed}
			<span class="loading loading-spinner"></span>
			Adding Members...
		{:else}
			Add Members
		{/if}
	</button>
</form>
