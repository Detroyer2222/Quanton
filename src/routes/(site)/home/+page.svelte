<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section>
	<div class="hero bg-base-200 min-h-screen">
		<div class="hero-content flex-col lg:flex-row-reverse">
			<div class="skeleton h-200 w-150"></div>
			<div>
				<h1 class="text-5xl font-bold">Take command of your Star Citizen Org.</h1>
				<p class="py-6">
					Quanton gives you the tools to visualize resources, manage outposts, and streamline every
					operation—so your crew can stay focused on the stars.
				</p>
				<a class="btn btn-primary" href="/register">Get Started</a>
			</div>
		</div>
	</div>
</section>
