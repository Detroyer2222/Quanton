<script lang="ts">
	import type { OrganizationCreateSchema } from '$lib/server/validation/organization.schema';
	import { Building2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { fileProxy, type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';

	let { data }: { data: SuperValidated<Infer<OrganizationCreateSchema>> } = $props();

	const { form, errors, enhance, delayed } = superForm(data, {
		onError({ result }) {
			toast.error(result.error.message || 'Failed to create organization. Please try again.');
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Organization created successfully!');
			}
		}
	});
	const organizationFile = fileProxy(form, 'logo');
</script>

<div class="card bg-base-100 mx-auto max-w-lg shadow-xl">
	<div class="card-body">
		<div class="mb-4 flex items-center gap-3">
			<div class="bg-primary text-primary-content rounded-full p-3">
				<Building2 />
			</div>
			<div>
				<h2 class="card-title text-primary mb-1 text-2xl font-bold">No Organization Found</h2>
				<p class="text-base-content/70 text-lg">
					You're not part of any organization yet. Would you like to create one?
				</p>
			</div>
		</div>
		<form
			method="post"
			action="?/createOrganization"
			enctype="multipart/form-data"
			class="space-y-4"
			use:enhance
		>
			<fieldset class="fieldset flex flex-col">
				<legend class="fieldset-legend">Name</legend>
				<div class="flex flex-col">
					<input
						type="text"
						name="name"
						class="input input-bordered w-full"
						placeholder="Organization name"
						bind:value={$form.name}
						required
					/>

					{#if $errors.name}
						{#each $errors.name as error}
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

			<fieldset class="fieldset flex flex-col">
				<legend class="fieldset-legend">Logo</legend>
				<div class="flex flex-col">
					<input
						type="file"
						class="file-input"
						name="avatar"
						accept=".png,.jpg,.jpeg, .webp"
						bind:files={$organizationFile}
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
			<div class="card-actions mt-4 justify-end">
				<button type="submit" class="btn btn-primary" disabled={$delayed}>
					{#if $delayed}
						<span class="loading loading-spinner"></span>
						Creating Organization
					{:else}
						Create Organization
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
