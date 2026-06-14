<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { notesApi } from '$lib/api/notes';
  import { formatDate } from '$lib/utils/dates';
  import {
    PageHeader,
    Button,
    Table,
    TableRow,
    EmptyState
  } from '$lib/components/ui';
  import ConfirmButton from '$lib/components/ConfirmButton.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  async function handleDelete(id: number) {
    await notesApi.remove(id);
    await invalidateAll();
  }
</script>

<svelte:head><title>Kalenderinfo - Privat Pasning</title></svelte:head>

<PageHeader title="Kalenderinfo" subtitle="Noter og info på datoer">
  {#snippet actions()}
    <Button href="/kalenderinfo/opret">+ Opret kalenderinfo</Button>
  {/snippet}
</PageHeader>

{#if data.notes.length === 0}
  <EmptyState message="Der er ingen registrerede kalenderinfo endnu." icon="📝">
    {#snippet action()}
      <Button href="/kalenderinfo/opret">Opret den første</Button>
    {/snippet}
  </EmptyState>
{:else}
  <Table headers={['Dato', 'Overskrift', 'Bemærkning', '']}>
    {#each data.notes as note}
      <TableRow
        cells={[
          { label: 'Dato', value: formatDate(note.date) },
          { label: 'Overskrift', value: note.title },
          { label: 'Bemærkning', value: note.note ?? '' }
        ]}
      >
        {#snippet actions()}
          <Button variant="secondary" size="sm" href="/kalenderinfo/{note.id}">Ret</Button>
          <ConfirmButton message="Slet linjen?" onConfirm={() => handleDelete(note.id)} />
        {/snippet}
      </TableRow>
    {/each}
  </Table>
{/if}