<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Info, User } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { toast } from 'svelte-sonner';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let username = $state(data.user.username);
	let disableUpdateUsername = $derived(username === data.user.username);
</script>

<div class="flex h-full w-full flex-col space-y-6">
	<form
		action="?/updateAvatar"
		method="post"
		class="flex w-full flex-col space-y-5"
		enctype="multipart/form-data"
		use:enhance
	>
		<fieldset
			class="fieldset bg-base-200 border-base-300 rounded-box flex size-fit flex-col space-y-4 border p-4"
		>
			<legend class="fieldset-legend">User Avatar</legend>
			<div role="alert" class="alert alert-info flex w-full flex-row gap-2">
				<Info class="h-8 w-8" />
				<span>Cooming Soon!</span>
			</div>
			<div class="flex flex-row space-x-4">
				<div class="skeleton flex h-36 w-36 cursor-pointer items-center justify-center">
					<User class=" h-26 w-26" />
				</div>
				<div class="w-2/5 self-end">
					<input type="file" class="file-input" name="avatar" />
					<p class="label">SVG, PNG, JPG (144x144px)</p>
				</div>
			</div>
			<button type="submit" class="btn btn-primary" disabled={true}> Upload Avatar </button>
		</fieldset>
	</form>

	<form
		action="?/updateUsername "
		method="post"
		class="flex w-full flex-col space-y-5"
		use:enhance={() => {
			return async ({ result, update }) => {
				switch (result.type) {
					case 'success':
						toast.success('Username updated successfully!');
						await update();
						break;
					case 'error':
						toast.error(form?.errors?.message);
						await applyAction(result);
						break;
					default:
						toast.error('Failed to update username. Please try again.');
						await applyAction(result);
						break;
				}
			};
		}}
	>
		<fieldset
			class="fieldset bg-base-200 border-base-300 rounded-box flex w-2/3 flex-col space-y-4 border p-4"
		>
			<legend class="fieldset-legend">Username</legend>

			<input
				type="text"
				class="input"
				placeholder="Username"
				name="username"
				bind:value={username}
			/>
			<p class="label">Alphanumerical Only</p>

			{#if form?.errors?.fieldErrors?.username}
				{#each form?.errors?.fieldErrors?.username as error}
					<p class="label validator-hint">
						{error}
					</p>
				{/each}
			{/if}
			<button type="submit" class="btn btn-primary" disabled={disableUpdateUsername}>
				Update Username
			</button>
		</fieldset>
	</form>
</div>
