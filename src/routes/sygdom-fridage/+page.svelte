<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { dayStatusApi } from '$lib/api/daystatus';
  import { formatDate } from '$lib/utils/dates';
  import { ChildDayStatusType, childDayStatusLabels } from '$lib/types';
  import { PageHeader, Button, Table, TableRow, EmptyState, Badge } from '$lib/components/ui';
  import ConfirmButton from '$lib/components/ConfirmButton.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  async function handleDelete(id: number) {
    await dayStatusApi.remove(id);
    await invalidateAll();
  }
</script>

<svelte:head><title>Sygdom og fridage - Privat Pasning</title></svelte:head>

<PageHeader title="Sygdom og fridage" subtitle="Registrér syge- og fridage">
  {#snippet actions()}
    <Button href="/sygdom-fridage/opret">+ Opret sygdom/fridag</Button>
  {/snippet}
</PageHeader>

{#if data.statuses.length === 0}
  <EmptyState message="Der er ingen registrerede sygdoms- eller fridage endnu." icon="🏥">
    {#snippet action()}
      <Button href="/sygdom-fridage/opret">Opret den første</Button>
    {/snippet}
  </EmptyState>
{:else}
  <Table headers={['Fra dato', 'Til dato', 'Barn', 'Type', 'Bemærkning', '']}>
    {#each data.statuses as item}
      <TableRow
        cells={[
          { label: 'Fra dato', value: formatDate(item.date) },
          { label: 'Til dato', value: formatDate(item.endDate) },
          { label: 'Barn', value: item.childName ?? '' },
          { label: 'Type', value: childDayStatusLabels[item.statusType] },
          { label: 'Bemærkning', value: item.note ?? '' }
        ]}
      >
        {#snippet actions()}
          <Button variant="secondary" size="sm" href="/sygdom-fridage/{item.id}">Ret</Button>
          <ConfirmButton message="Slet linjen?" onConfirm={() => handleDelete(item.id)} />
        {/snippet}
      </TableRow>
    {/each}
  </Table>
{/if}