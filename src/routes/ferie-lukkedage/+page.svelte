<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { closuresApi } from '$lib/api/closures';
	import { formatDate } from '$lib/utils/dates';
	import { closurePeriodLabels } from '$lib/types';
	import {
		PageHeader,
		Button,
		Table,
		TableRow,
		EmptyState,
		ConfirmButton
	} from '$lib/components/ui';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	async function handleDelete(id: number) {
		await closuresApi.remove(id);
		await invalidateAll();
	}
</script>

<svelte:head><title>Ferie/lukkedage - Privat Pasning</title></svelte:head>

<PageHeader title="Ferie/lukkedage" subtitle="Lukkeperioder og ferie">
	{#snippet actions()}
		<Button href="/ferie-lukkedage/opret">+ Opret ferie/lukkedage</Button>
	{/snippet}
</PageHeader>

{#if data.closures.length === 0}
	<EmptyState message="Der er ingen registrerede ferie- eller lukkedage endnu." icon="🏖️">
		{#snippet action()}
			<Button href="/ferie-lukkedage/opret">Opret den første</Button>
		{/snippet}
	</EmptyState>
{:else}
	<Table headers={['Fra dato', 'Til dato', 'Overskrift', 'Type', 'Bemærkning', '']}>
		{#each data.closures as item}
			<TableRow
				cells={[
					{ label: 'Fra dato', value: formatDate(item.startDate) },
					{ label: 'Til dato', value: formatDate(item.endDate) },
					{ label: 'Overskrift', value: item.title },
					{ label: 'Type', value: closurePeriodLabels[item.periodType] },
					{ label: 'Bemærkning', value: item.note ?? '' }
				]}
			>
				{#snippet actions()}
					<Button variant="secondary" size="sm" href="/ferie-lukkedage/{item.id}">Ret</Button>
					<ConfirmButton message="Slet perioden?" onConfirm={() => handleDelete(item.id)} />
				{/snippet}
			</TableRow>
		{/each}
	</Table>
{/if}
