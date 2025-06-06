<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
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
				<div class="card-body">
					<fieldset class="fieldset flex flex-col space-y-2">
						<legend class="fieldset-legend">Email</legend>
						<input
							class="input input-primary input-lg validator"
							type="email"
							name="email"
							placeholder="Enter your Email"
							required
						/>

						<p class="label validator-hint hidden">
							You can edit page title later on from settings
						</p>
					</fieldset>
					<fieldset class="flex flex-col space-y-2">
						<legend class="fieldset-legend">Confirm Password</legend>
						<input
							class="input input-primary input-lg validator"
							type="password"
							name="confirmPassword"
							placeholder="Enter your Password"
							required
						/>

						<p class="label validator-hint hidden">
							You can edit page title later on from settings
						</p>
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

						<p class="label validator-hint hidden">
							You can edit page title later on from settings
						</p>

						<div class="flex flex-row justify-between">
							<a href="/login" class="link link-hover">Already have an Account? Login now</a>
							<a class="link link-hover">Forgot password?</a>
						</div>
						<button class="btn btn-neutral mt-4" type="submit">Login</button>
					</fieldset>
				</div>
			</div>
		</div>
	</div>
</section>
