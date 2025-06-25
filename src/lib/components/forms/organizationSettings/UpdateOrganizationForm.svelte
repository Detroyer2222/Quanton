<script lang="ts">
	import { getImageUrl } from '$lib/pocketbase/functions/utils';
	import { OrganizationRoles } from '$lib/rbac/constants';
	import type { OrganizationUpdateSchema } from '$lib/server/validation/organization.schema';
	import { Collections, type OrganizationsRecord } from '$lib/types';
	import { Building2 } from 'lucide-svelte';
	import { fileProxy, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	let {
		data,
		role,
		organization
	}: {
		data: SuperValidated<Infer<OrganizationUpdateSchema>>;
		role: OrganizationRoles;
		organization: OrganizationsRecord;
	} = $props();

	const { form, errors, enhance, delayed, isTainted, tainted } = superForm(data);
	const logoFile = fileProxy(form, 'logo');
	let logoInput: HTMLInputElement | null = null;
	function openFileInput() {
		if (logoInput) {
			logoInput.click();
		}
	}

	let hasUserAccess = $derived(role === OrganizationRoles.Admin);
	let imageLoadError = $state(false);
</script>

<form
	action="?/updateOrganization"
	method="post"
	class="flex w-full flex-col space-y-5"
	enctype="multipart/form-data"
	use:enhance
>
	<fieldset class="flex flex-col">
		<legend class="fieldset-legend">Organization Name</legend>
		<input
			type="text"
			name="name"
			class="input input-bordered w-full"
			bind:value={$form.name}
			disabled={!hasUserAccess}
		/>
		{#if $errors.name}
			{#each $errors.name as error}
				<p class="label text-error text-wrap">
					{error}
				</p>
			{/each}
		{/if}
	</fieldset>

	<fieldset class="fieldset flex size-fit flex-row">
		<legend class="fieldset-legend">Logo</legend>
		<button
			class={{
				'flex h-36 w-36 items-center justify-center': true,
				'cursor-pointer': hasUserAccess,
				'cursor-not-allowed': !hasUserAccess
			}}
			onclick={openFileInput}
			aria-label="Upload Organization Logo"
		>
			{#if imageLoadError}
				<div class="skeleton flex h-36 w-36 items-center justify-center">
					<Building2 class=" h-26 w-26" />
				</div>
			{:else}
				<img
					src={getImageUrl(
						Collections.Organizations,
						organization.id,
						organization.logo ?? '',
						'144x144'
					)}
					alt="UserAvatar"
					class="h-36 w-36"
					loading="lazy"
					onerror={() => (imageLoadError = true)}
				/>
			{/if}
		</button>

		<div class="w-3/5 self-end">
			<input
				type="file"
				class="file-input"
				name="logo"
				accept=".png,.jpg,.jpeg, .webp"
				bind:files={$logoFile}
				bind:this={logoInput}
				disabled={!hasUserAccess}
			/>
			<p class="label">PNG, JPEG, WEBP(144x144px)</p>
			{#if $errors.logo}
				{#each $errors.logo as error}
					<p class="label text-error text-wrap">
						{error}
					</p>
				{/each}
			{/if}
		</div>
	</fieldset>

	<fieldset class="fieldset flex flex-col">
		<legend class="fieldset-legend">Description</legend>
		<div class="flex flex-col">
			<textarea
				name="description"
				class="textarea textarea-bordered w-full"
				placeholder="Description (optional)"
				rows="3"
				bind:value={$form.description}
				disabled={!hasUserAccess}
			></textarea>

			{#if $errors.name}
				{#each $errors.name as error}
					<p class="label text-error text-wrap">
						{error}
					</p>
				{/each}
			{/if}
		</div>
	</fieldset>

	{#if role === OrganizationRoles.Admin}
		<!-- content here -->
		<button type="submit" class="btn btn-primary" disabled={$delayed || !isTainted($tainted)}>
			{#if $delayed}
				<span class="loading loading-spinner"></span>
				Updating
			{:else}
				Update Organization
			{/if}
		</button>
	{/if}
</form>
