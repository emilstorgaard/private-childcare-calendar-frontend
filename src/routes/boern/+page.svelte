<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { childrenApi } from '$lib/api/children';
    import { formatDate } from '$lib/utils/dates';
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeChildren = $derived(
        data.children.filter(
            (c) => new Date(c.startDate) <= today && (!c.endDate || new Date(c.endDate) >= today)
        )
    );

    const upcomingChildren = $derived(
        data.children.filter((c) => new Date(c.startDate) > today)
    );

    const formerChildren = $derived(
        data.children.filter((c) => c.endDate && new Date(c.endDate) < today)
    );

    async function handleDelete(id: number) {
        await childrenApi.remove(id);
        await invalidateAll();
    }
</script>

<svelte:head><title>Børn - Privat Pasning</title></svelte:head>

<PageHeader title="Børn" subtitle="Oversigt over børn i pasningsordningen" variant="section">
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
    {#if activeChildren.length > 0}
        <PageHeader title="Aktive børn" subtitle="Børn i pasning nu" variant="section" />
        <Table headers={['Navn', 'Fødselsdato', 'Pasningsstart', 'Slutdato', 'Bemærkning', '']}>
            {#each activeChildren as child}
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
    {:else}
        <EmptyState message="Ingen aktive børn i pasning." icon="👶" />
    {/if}

    {#if upcomingChildren.length > 0}
        <PageHeader title="Kommende børn" subtitle="Starter i pasning fremover" variant="section" />
        <Table headers={['Navn', 'Fødselsdato', 'Pasningsstart', 'Slutdato', 'Bemærkning', '']}>
            {#each upcomingChildren as child}
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

    {#if formerChildren.length > 0}
        <PageHeader title="Tidligere børn" subtitle="Ikke længere i pasning" variant="section" />
        <Table headers={['Navn', 'Fødselsdato', 'Pasningsstart', 'Slutdato', 'Bemærkning', '']}>
            {#each formerChildren as child}
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
{/if}