<script lang="ts">
	import { CircleX, Mail } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	let { data }: { data: PageData; form: ActionData } = $props();

	const { form, errors, enhance, capture, restore } = superForm(data.form);
	export const snapshot = { capture, restore };

	// Show email change notification when redirected from logout
	onMount(() => {
		if (data.emailChangeRequested) {
			toast.success(
				'Email change request sent! Please check your new email to confirm the change.'
			);
		}
	});
</script>

<section class="flex h-screen flex-col items-center justify-center">
	<div class="hero bg-base-200 min-h-screen">
		<div class="hero-content flex-col lg:flex-row-reverse">
			<div class="self-start text-center lg:text-left">
				<h1 class="inline text-5xl font-bold text-nowrap">Welcome Back to Quanton</h1>
			</div>
			<div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
				<div class="card-body">
					{#if data.emailChangeRequested}
						<div role="alert" class="alert alert-info mb-4">
							<Mail class="h-6 w-6" />
							<div>
								<h3 class="font-bold">Email Change Requested</h3>
								<div class="text-xs">Please check your new email to confirm the change.</div>
							</div>
						</div>
					{/if}

					<form action="?/login" method="post" use:enhance>
						<fieldset class="fieldset flex flex-col space-y-2">
							<legend class="fieldset-legend">Email</legend>
							<input
								class="input input-primary input-lg validator"
								type="email"
								name="email"
								placeholder="Enter your Email"
								bind:value={$form.email}
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
						<fieldset class="flex flex-col space-y-2">
							<legend class="fieldset-legend">Password</legend>
							<input
								class="input input-primary input-lg validator"
								type="password"
								name="password"
								placeholder="Enter your Password"
								bind:value={$form.password}
								required
							/>

							{#if $errors.password}
								{#each $errors.password as error}
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
								<a href="/register" class="link link-hover">
									Don't have an Account? <br />
									Register now
								</a>
								<a class="link link-hover" href="/reset-password">Forgot password?</a>
							</div>
							<button class="btn btn-neutral mt-4" type="submit">Login</button>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>
