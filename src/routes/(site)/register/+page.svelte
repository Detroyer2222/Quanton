<script lang="ts">
	import { CircleX } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';

	let { data }: { data: PageData; form: ActionData } = $props();

	const { form, errors, enhance, capture, restore } = superForm(data.form, {
		onResult({ result }) {
			switch (result.type) {
				case 'error':
					toast.error('Registration failed. Please try again or contact support.');
					break;
			}
		}
	});
	export const snapshot = { capture, restore };
</script>

<section class="flex h-screen flex-col items-center justify-center">
	<div class="hero bg-base-200 min-h-screen">
		<div class="hero-content flex-col lg:flex-row-reverse">
			<div class="self-start text-center lg:text-left">
				<h1 class="inline text-5xl font-bold text-nowrap">Join Quanton</h1>
				<p class="py-6">
					Ready to dive into the world of Quanton? <br />
					Join us now and start your journey towards managin your organization
				</p>
			</div>
			<div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
				<form class="card-body" action="?/register" method="post" use:enhance>
					<fieldset class="fieldset flex flex-col space-y-2">
						<legend class="fieldset-legend">Email</legend>
						<input
							class="input input-lg"
							class:input-primary={!$errors.email}
							class:input-error={$errors.email}
							type="email"
							name="email"
							bind:value={$form.email}
							placeholder="Enter your Email"
							required
						/>

						{#if $errors.email}
							{#each $errors.email as error}
								<p class="label text-error text-wrap">
									{error}
								</p>
							{/each}
						{/if}
					</fieldset>
					<fieldset class="fieldset flex flex-col space-y-2">
						<legend class="fieldset-legend">Username</legend>
						<input
							class="input input-lg"
							class:input-primary={!$errors.username}
							class:input-error={$errors.username}
							type="text"
							name="username"
							bind:value={$form.username}
							placeholder="Enter your Uswername"
							required
						/>

						{#if $errors.username}
							{#each $errors.username as error}
								<p class="label text-error text-wrap">
									{error}
								</p>
							{/each}
						{/if}
					</fieldset>
					<fieldset class="flex flex-col space-y-2">
						<legend class="fieldset-legend">Password</legend>
						<input
							class="input input-lg"
							class:input-primary={!$errors.password}
							class:input-error={$errors.password}
							type="password"
							name="password"
							placeholder="Enter your Password"
							required
						/>

						{#if $errors.password}
							{#each $errors.password as error}
								<p class="label text-error text-wrap">
									{error}
								</p>
							{/each}
						{/if}
					</fieldset>
					<fieldset class="flex flex-col space-y-2">
						<legend class="fieldset-legend">Confirm Password</legend>
						<input
							class="input input-lg"
							class:input-primary={!$errors.confirmPassword}
							class:input-error={$errors.confirmPassword}
							type="password"
							name="confirmPassword"
							placeholder="Enter your Password"
							required
						/>

						{#if $errors.confirmPassword}
							{#each $errors.confirmPassword as error}
								<p class="label text-error text-wrap">
									{error}
								</p>
							{/each}
						{/if}

						{#if $errors?._errors}
							{#each $errors?._errors as error}
								<div role="alert" class="alert alert-error">
									<CircleX />
									<span>{error}</span>
								</div>
							{/each}
						{/if}

						<div class="flex flex-row justify-between">
							<a href="/login" class="link link-hover">
								Already have an Account?
								<br /> Login now
							</a>
							<a class="link link-hover" href="/reset-password">Forgot password?</a>
						</div>
						<button class="btn btn-neutral mt-4" type="submit">Register</button>
					</fieldset>
				</form>
			</div>
		</div>
	</div>
</section>
