<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { dayStatusApi } from '$lib/api/daystatus';
    import { formatDate } from '$lib/utils/dates';
    import { childDayStatusLabels } from '$lib/types';
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

    const activeStatuses = $derived(
        data.statuses.filter((item) => {
            const startDate = new Date(item.date);
            const endDate = item.endDate ? new Date(item.endDate) : startDate;
            return startDate <= today && endDate >= today;
        })
    );

    const upcomingStatuses = $derived(
        data.statuses.filter((item) => {
            const startDate = new Date(item.date);
            return startDate > today;
        })
    );

    const pastStatuses = $derived(
        data.statuses.filter((item) => {
            const startDate = new Date(item.date);
            const endDate = item.endDate ? new Date(item.endDate) : startDate;
            return endDate < today;
        })
    );

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
    {#if activeStatuses.length > 0}
        <PageHeader title="Aktuelle" subtitle="Sygdom eller fridage lige nu" variant="section" />
        <Table headers={['Fra dato', 'Til dato', 'Barn', 'Type', 'Bemærkning', '']}>
            {#each activeStatuses as item}
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
    {:else}
        <EmptyState message="Ingen syge eller registrerede fridage i dag. Alle børn er friske! 🎉" icon="👶" />
    {/if}

    {#if upcomingStatuses.length > 0}
        <PageHeader title="Kommende" subtitle="Planlagt ferie og fridage" variant="section" />
        <Table headers={['Fra dato', 'Til dato', 'Barn', 'Type', 'Bemærkning', '']}>
            {#each upcomingStatuses as item}
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

    {#if pastStatuses.length > 0}
        <PageHeader title="Tidligere registreringer" subtitle="Historik over overståede syge- og fridage" variant="section" />
        <Table headers={['Fra dato', 'Til dato', 'Barn', 'Type', 'Bemærkning', '']}>
            {#each pastStatuses as item}
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
{/if}