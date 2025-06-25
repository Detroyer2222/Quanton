<script lang="ts">
	import { OrganizationRoles } from '$lib/rbac/constants';
	import type { ManipulateMemberSchema } from '$lib/server/validation/organization.schema';
	import type { Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	let {
		data,
		action,
		buttonColor = 'btn-primary',
		tooltip = 'Update Member',
		organizationId,
		memberId,
		role = OrganizationRoles.Member,
		successMessage = 'Member updated successfully!',
		failureMessage = 'Failed to update member. Please try again.',
		children
	}: {
		data: SuperValidated<Infer<ManipulateMemberSchema>>;
		action: string;
		buttonColor?: string;
		tooltip?: string;
		organizationId: string;
		memberId: string;
		role: OrganizationRoles;
		successMessage?: string;
		failureMessage?: string;
		children: Snippet;
	} = $props();

	const { form, errors, enhance, delayed } = superForm(data, {
		onError({ result }) {
			toast.error(result.error.message || failureMessage);
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success(successMessage);
			}
		}
	});
</script>

<form action="?/{action}" method="post">
	<input type="hidden" name="organizationId" value={organizationId} />
	<input type="hidden" name="userId" value={memberId} />
	<div class="tooltip" data-tip={tooltip}>
		<button
			class="btn btn-square btn-soft {buttonColor}"
			disabled={role === OrganizationRoles.Member}
		>
			{@render children()}
		</button>
	</div>
</form>
