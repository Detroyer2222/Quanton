<script lang="ts">
	import { Moon, Sun } from 'lucide-svelte';
	import { getSwapTheme, toggleTheme } from '$lib/stores/theme.svelte';
</script>

<label class="swap spaw-rotate">
	<input type="checkbox" class="theme-controller hidden" value={'silk'} onchange={toggleTheme} />

	<Sun class="swap-off h-10 w-10 fill-current" />
	<Moon class="swap-on h-10 w-10 fill-current" />
</label>
