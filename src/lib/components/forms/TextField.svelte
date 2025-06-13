<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	type Props = HTMLInputAttributes & {
		superform: SuperForm<T>;
		field: FormPathLeaves<T>;
	};

	let { superform, field, ...rest }: Props = $props();

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

// TODO: choose consistent styling
