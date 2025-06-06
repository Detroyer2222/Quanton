<script lang="ts">
	import { enhance } from '$app/forms';
	import { CircleX } from 'lucide-svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section class="flex h-screen flex-col items-center justify-center">
	<div class="hero bg-base-200 min-h-screen">
		<div class="hero-content flex-col lg:flex-row-reverse">
			<div class="self-start text-center lg:text-left">
				<h1 class="inline text-5xl font-bold text-nowrap">Welcome Back to Quanton</h1>
			</div>
			<div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
				<div class="card-body">
					<form action="?/login" method="post" use:enhance>
						<fieldset class="fieldset flex flex-col space-y-2">
							<legend class="fieldset-legend">Email</legend>
							<input
								class="input input-primary input-lg validator"
								type="email"
								name="email"
								placeholder="Enter your Email"
								value={(form?.data?.email as string) ?? ''}
								required
							/>

							{#if form?.errors?.email}
								{#each form?.errors?.email as error}
									<p class="label validator-hint">
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
								required
							/>

							{#if form?.errors?.password}
								{#each form?.errors?.password as error}
									<p class="label validator-hint">
										{error}
									</p>
								{/each}
							{/if}

							{#if form?.errors?.message}
								<div role="alert" class="alert alert-error">
									<CircleX />
									<span>Error! Task failed successfully.</span>
								</div>
							{/if}

							<div class="flex flex-row justify-between">
								<a href="/register" class="link link-hover"
									>Don't have an Account? <br /> Register now</a
								>
								<a class="link link-hover">Forgot password?</a>
							</div>
							<button class="btn btn-neutral mt-4" type="submit">Login</button>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>
