<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section
	class="bg-color-white-500 dark:bg-dark-500 hover:bg-dark-500 flex h-screen flex-col items-center justify-center"
>
	<div class="flex flex-row">
		<form action="?/login" method="post" use:enhance>
			<h1>Welcome Back to Quanton</h1>
		</form>
	</div>
</section>
