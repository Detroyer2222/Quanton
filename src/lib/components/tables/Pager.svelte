<script lang="ts">
	import ArrowBigLeft from '../movingIcons/ArrowBigLeft.svelte';
	import ArrowBigRight from '../movingIcons/ArrowBigRight.svelte';

	let { rows, trimmedRows = $bindable() } = $props();

	let totalRows = $derived(rows.length); // rows might change
	let perPage = $state('5'); // user will be able to change this
	let currentPage = $state(0); // 1st page
	let totalPages = $derived(Math.ceil(totalRows / Number(perPage)));
	let start = $derived(currentPage * Number(perPage));
	let end = $derived(currentPage === totalPages - 1 ? totalRows - 1 : start + Number(perPage) - 1);

	// change the trimmed rows when the rows, start, or end changeq
	$effect(() => {
		trimmedRows = rows.slice(start, end + 1);
	});
</script>

<div class="flex items-center justify-between">
	<div class="text-base-content text-sm">
		Showing {start + 1} to {end + 1} of {totalRows} entries
	</div>
	<div class="flex items-center space-x-2">
		<button
			class="btn btn-primary flex items-center justify-center"
			onclick={() => (currentPage -= 1)}
			disabled={currentPage <= 0}
		>
			<ArrowBigLeft />
		</button>
		<span class="text-base-content text-sm">Page {currentPage + 1} of {totalPages}</span>
		<button
			class="btn btn-primary flex items-center justify-center"
			onclick={() => (currentPage += 1)}
			disabled={currentPage >= totalPages - 1}
		>
			<ArrowBigRight />
		</button>
	</div>
	<select
		class="select w-30"
		bind:value={perPage}
		onchange={() => {
			currentPage = 0;
		}}
	>
		<option selected value="5">5 per Page</option>
		<option value="10">10 per Page</option>
		<option value="25">25 per Page</option>
	</select>
</div>
