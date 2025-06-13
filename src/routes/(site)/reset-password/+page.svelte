<script lang="ts">
	import { CircleX, KeyRound, Mail } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props(); // Handle request reset form
	const {
		form: requestForm,
		errors: requestErrors,
		enhance: requestEnhance,
		message: requestMessage
	} = superForm(data.requestForm, {
		onResult({ result }) {
			if (result.type === 'success') {
				toast.success($requestMessage?.text || 'Reset link sent successfully!');
			}
		}
	});
</script>

<section class="flex h-screen flex-col items-center justify-center">
	<div class="hero bg-base-200 min-h-screen">
		<div class="hero-content flex-col lg:flex-row-reverse">
			<div class="self-start text-center lg:text-left">
				<h1 class="inline text-5xl font-bold text-nowrap">Forgot Password?</h1>
				<p class="py-6">Enter your email address and we'll send you a reset link.</p>
			</div>
			<div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
				<div class="card-body">
					<!-- Password Reset Request Form -->
					<form action="?/requestReset" method="post" use:requestEnhance>
						<fieldset class="fieldset flex flex-col space-y-2">
							<legend class="fieldset-legend">Email Address</legend>
							<input
								class="input input-primary input-lg validator"
								type="email"
								name="email"
								placeholder="Enter your email address"
								bind:value={$requestForm.email}
								required
							/>
							{#if $requestErrors.email}
								{#each $requestErrors.email as error}
									<p class="label text-error text-wrap">
										{error}
									</p>
								{/each}
							{/if}

							{#if $requestErrors?._errors}
								{#each $requestErrors?._errors as error}
									<div role="alert" class="alert alert-error">
										<CircleX />
										<span>{error}</span>
									</div>
								{/each}
							{/if}

							{#if $requestMessage?.text}
								<div role="alert" class="alert alert-success">
									<Mail />
									<span>{$requestMessage.text}</span>
								</div>
							{/if}

							<div class="flex flex-row justify-between">
								<a href="/login" class="link link-hover"> Back to Login </a>
								<a href="/register" class="link link-hover"> Create Account </a>
							</div>
							<button class="btn btn-primary mt-4" type="submit">
								<Mail class="h-4 w-4" />
								Send Reset Link
							</button>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>
