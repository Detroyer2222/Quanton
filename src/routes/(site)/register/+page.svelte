<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { CircleX } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import { toast } from 'svelte-sonner';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	$inspect(form);
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
				<form
					class="card-body"
					action="?/register"
					method="post"
					use:enhance={() => {
						return async ({ result, update }) => {
							switch (result.type) {
								case 'error':
									toast.error(
										form?.errors?.message ||
											'Registration failed. Please try again or contact support.'
									);
									await applyAction(result);
									break;
							}
						};
					}}
				>
					<fieldset class="fieldset flex flex-col space-y-2">
						<legend class="fieldset-legend">Email</legend>
						<input
							class="input input-lg"
							class:input-primary={!form?.errors?.fieldErrors?.email}
							class:input-error={form?.errors?.fieldErrors?.email}
							type="email"
							name="email"
							value={(form?.data?.email as string) ?? ''}
							placeholder="Enter your Email"
							required
						/>

						{#if form?.errors?.fieldErrors?.email}
							{#each form?.errors?.fieldErrors?.email as error}
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
							class:input-primary={!form?.errors?.fieldErrors?.username}
							class:input-error={form?.errors?.fieldErrors?.username}
							type="text"
							name="username"
							value={(form?.data?.username as string) ?? ''}
							placeholder="Enter your Uswername"
							required
						/>

						{#if form?.errors?.fieldErrors?.username}
							{#each form?.errors?.fieldErrors?.username as error}
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
							class:input-primary={!form?.errors?.fieldErrors?.password}
							class:input-error={form?.errors?.fieldErrors?.password}
							type="password"
							name="password"
							placeholder="Enter your Password"
							required
						/>

						{#if form?.errors?.fieldErrors?.password}
							{#each form?.errors?.fieldErrors?.password as error}
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
							class:input-primary={!form?.errors?.fieldErrors?.confirmPassword}
							class:input-error={form?.errors?.fieldErrors?.confirmPassword}
							type="password"
							name="confirmPassword"
							placeholder="Enter your Password"
							required
						/>

						{#if form?.errors?.fieldErrors?.confirmPassword}
							{#each form?.errors?.fieldErrors?.confirmPassword as error}
								<p class="label text-error text-wrap">
									{error}
								</p>
							{/each}
						{/if}

						{#if form?.errors?.message}
							<div role="alert" class="alert alert-error">
								<CircleX />
								<span>{form?.errors?.message}</span>
							</div>
						{/if}

						<div class="flex flex-row justify-between">
							<a href="/login" class="link link-hover">
								Already have an Account?
								<br /> Login now
							</a>
							<a class="link link-hover">Forgot password?</a>
						</div>
						<button class="btn btn-neutral mt-4" type="submit">Register</button>
					</fieldset>
				</form>
			</div>
		</div>
	</div>
</section>
