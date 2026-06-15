<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { waitingListApi } from '$lib/api/waitinglist';
  import { formatDate } from '$lib/utils/dates';
  import { PageHeader, Button, Table, TableRow, EmptyState, ConfirmButton } from '$lib/components/ui';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  async function handleDelete(id: number) {
    await waitingListApi.remove(id);
    await invalidateAll();
  }
</script>

<svelte:head><title>Venteliste - Privat Pasning</title></svelte:head>

<PageHeader title="Venteliste" subtitle="Børn der venter på en plads">
  {#snippet actions()}
    <Button href="/venteliste/opret">+ Opret på venteliste</Button>
  {/snippet}
</PageHeader>

{#if data.entries.length === 0}
  <EmptyState message="Der er ingen på ventelisten endnu." icon="📋">
    {#snippet action()}
      <Button href="/venteliste/opret">Opret den første</Button>
    {/snippet}
  </EmptyState>
{:else}
  <Table headers={['Barnets navn', 'Kontakt', 'Telefon', 'Ønsket start', 'Bemærkning', '']}>
    {#each data.entries as entry}
      <TableRow
        cells={[
          { label: 'Barnets navn', value: entry.childName },
          { label: 'Kontakt', value: entry.contactName ?? '' },
          { label: 'Telefon', value: entry.phone ?? '' },
          { label: 'Ønsket start', value: entry.wantedStartDate ? formatDate(entry.wantedStartDate) : '' },
          { label: 'Bemærkning', value: entry.note ?? '' }
        ]}
      >
        {#snippet actions()}
          <Button variant="secondary" size="sm" href="/venteliste/{entry.id}">Ret</Button>
          <ConfirmButton message="Slet linjen?" onConfirm={() => handleDelete(entry.id)} />
        {/snippet}
      </TableRow>
    {/each}
  </Table>
{/if}