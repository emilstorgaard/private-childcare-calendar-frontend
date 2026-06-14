<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { childrenApi } from '$lib/api/children';
  import { formatDate } from '$lib/utils/dates';
  import { PageHeader, Button, Table, TableRow, EmptyState } from '$lib/components/ui';
  import ConfirmButton from '$lib/components/ConfirmButton.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  async function handleDelete(id: number) {
    await childrenApi.remove(id);
    await invalidateAll();
  }
</script>

<svelte:head><title>Børn - Privat Pasning</title></svelte:head>

<PageHeader title="Børn" subtitle="Børn i pasning">
  {#snippet actions()}
    <Button href="/boern/opret">+ Opret barn</Button>
  {/snippet}
</PageHeader>

{#if data.children.length === 0}
  <EmptyState message="Der er ingen registrerede børn endnu." icon="👶">
    {#snippet action()}
      <Button href="/boern/opret">Opret det første</Button>
    {/snippet}
  </EmptyState>
{:else}
  <Table headers={['Navn', 'Fødselsdato', 'Pasningsstart', 'Slutdato', 'Bemærkning', '']}>
    {#each data.children as child}
      <TableRow
        cells={[
          { label: 'Navn', value: child.name },
          { label: 'Fødselsdato', value: formatDate(child.birthDate) },
          { label: 'Pasningsstart', value: formatDate(child.startDate) },
          { label: 'Slutdato', value: formatDate(child.endDate) },
          { label: 'Bemærkning', value: child.note ?? '' }
        ]}
      >
        {#snippet actions()}
          <Button variant="secondary" size="sm" href="/boern/{child.id}">Ret</Button>
          <ConfirmButton message="Slet barnet?" onConfirm={() => handleDelete(child.id)} />
        {/snippet}
      </TableRow>
    {/each}
  </Table>
{/if}