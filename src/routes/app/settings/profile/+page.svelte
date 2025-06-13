<script lang="ts">
	import { User } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { getImageUrl } from '$lib/pocketbase/utils';
	import { Collections } from '$lib/types';

	let { data }: { data: PageData } = $props();
	const {
		form: avatarForm,
		errors: avatarErrors,
		enhance: avatarEnhance,
		capture: avatarCapture,
		restore: avatarRestore,
		delayed: avatarDelayed
	} = superForm(data.avatarForm, {
		dataType: 'json',
		onError({ result }) {
			toast.error(result.error.message || 'Failed to update avatar. Please try again.');
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Avatar updated successfully!');
			}
		}
	});
	const avatarFile = fileProxy(avatarForm, 'avatar');
	let fileInput: HTMLInputElement | null = null;
	function openFileInput() {
		if (fileInput) {
			fileInput.click();
		}
	}

	const {
		form: usernameForm,
		errors: usernameErrors,
		enhance: usernameEnhance,
		capture: usernameCapture,
		restore: usernameRestore
	} = superForm(data.usernameForm, {
		onError({ result }) {
			toast.error(result.error.message || 'Failed to update username. Please try again.');
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Username updated successfully!');
			}
		}
	});
	let disableUpdateUsername = $derived(data.user.username === $usernameForm.username);

	const {
		form: emailForm,
		errors: emailErrors,
		enhance: emailEnhance
	} = superForm(data.changeEmailForm, {
		onError({ result }) {
			toast.error(
				result.error.message ||
					'An unexpected error occurred while sending the email change request.'
			);
		}
	});
	let emailChangeRequestSent = $state(false);

	export const avatarSnapshot = { avatarCapture, avatarRestore };
	export const usernameSnapshot = { usernameCapture, usernameRestore };
	let imageLoadError = $state(false);
</script>

<div class="flex h-full w-full flex-col space-y-6">
	<form
		action="?/updateAvatar"
		method="post"
		class="flex w-full flex-col space-y-5"
		enctype="multipart/form-data"
		use:avatarEnhance
	>
		<fieldset
			class="fieldset bg-base-200 border-base-300 rounded-box flex size-fit w-2/3 flex-col space-y-4 border p-4"
		>
			<legend class="fieldset-legend">Change User Avatar</legend>
			<div class="flex flex-row space-x-4">
				{#if imageLoadError}
					<button
						type="button"
						class="skeleton flex h-36 w-36 cursor-pointer items-center justify-center"
						onclick={openFileInput}
						aria-label="Click to upload avatar"
					>
						<User class=" h-26 w-26" />
					</button>
				{:else}
					<img
						src={getImageUrl(Collections.Users, data.user.id, data.user.avatar, '144x144')}
						alt="UserAvatar"
						class="h-36 w-36"
						loading="lazy"
						onerror={() => (imageLoadError = true)}
					/>
				{/if}

				<div class="w-2/5 self-end">
					<input
						type="file"
						class="file-input"
						name="avatar"
						accept=".png,.jpg,.jpeg, .webp"
						bind:files={$avatarFile}
						bind:this={fileInput}
					/>
					<p class="label">PNG, JPEG, WEBP(144x144px)</p>
					{#if $avatarErrors.avatar}
						{#each $avatarErrors.avatar as error}
							<p class="label text-error text-wrap">
								{error}
							</p>
						{/each}
					{/if}
				</div>
			</div>
			<button type="submit" class="btn btn-primary" disabled={$avatarDelayed}>
				{#if $avatarDelayed}
					<span class="loading loading-spinner"></span>
					Uploading
				{:else}
					Upload Avatar
				{/if}
			</button>
		</fieldset>
	</form>

	<form
		action="?/updateUsername"
		method="post"
		class="flex w-full flex-col space-y-5"
		use:usernameEnhance
	>
		<fieldset
			class="fieldset bg-base-200 border-base-300 rounded-box flex w-2/3 flex-col space-y-4 border p-4"
		>
			<legend class="fieldset-legend">Change Username</legend>

			<div class="flex flex-col">
				<input
					type="text"
					class="input"
					placeholder="Username"
					name="username"
					bind:value={$usernameForm.username}
				/>
				<p class="label">Alphanumerical Only</p>
			</div>

			{#if $usernameErrors.username}
				{#each $usernameErrors.username as error}
					<p class="label text-error text-wrap">
						{error}
					</p>
				{/each}
			{/if}
			<button type="submit" class="btn btn-primary" disabled={disableUpdateUsername}>
				Update Username
			</button>
		</fieldset>
	</form>

	<fieldset
		class="fieldset bg-base-200 border-base-300 rounded-box flex w-2/3 flex-col space-y-4 border p-4"
	>
		<legend class="fieldset-legend">Change Email</legend>
		<form
			action="?/changeEmail"
			method="post"
			class="flex w-full flex-col space-y-5"
			use:emailEnhance
		>
			<div class="flex flex-col">
				<label class="label" for="email">Current Email</label>
				<input
					id="email"
					type="email"
					class="input input-ghost"
					name="email"
					bind:value={$emailForm.email}
					readonly
				/>
			</div>

			<input
				type="email"
				class="input"
				placeholder="New Email"
				name="newEmail"
				bind:value={$emailForm.newEmail}
			/>

			{#if $emailErrors.newEmail}
				{#each $emailErrors.newEmail as error}
					<p class="label text-error text-wrap">
						{error}
					</p>
				{/each}
			{/if}

			<button type="submit" class="btn btn-primary" disabled={emailChangeRequestSent}>
				Request Email Change
			</button>
		</form>
	</fieldset>
</div>
