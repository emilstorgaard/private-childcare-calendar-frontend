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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeClosures = $derived(
        data.closures.filter((item) => {
            const startDate = new Date(item.startDate);
            const endDate = item.endDate ? new Date(item.endDate) : startDate;
            return startDate <= today && endDate >= today;
        })
    );

    const upcomingClosures = $derived(
        data.closures.filter((item) => {
            const startDate = new Date(item.startDate);
            return startDate > today;
        })
    );

    const pastClosures = $derived(
        data.closures.filter((item) => {
            const startDate = new Date(item.startDate);
            const endDate = item.endDate ? new Date(item.endDate) : startDate;
            return endDate < today;
        })
    );

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
    {#if activeClosures.length > 0}
        <PageHeader title="Aktuelle lukkedage" subtitle="Pasningsordningen holder lukket lige nu" variant="section" />
        <Table headers={['Fra dato', 'Til dato', 'Overskrift', 'Type', 'Bemærkning', '']}>
            {#each activeClosures as item}
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
    {:else}
        <EmptyState message="Pasningsordningen holder ikke ferie- eller lukkedage lige nu. Der er åbent! 👋" icon="🏡" />
    {/if}

    {#if upcomingClosures.length > 0}
        <PageHeader title="Kommende ferie/lukkedage" subtitle="Planlagte lukkeperioder fremover" variant="section" />
        <Table headers={['Fra dato', 'Til dato', 'Overskrift', 'Type', 'Bemærkning', '']}>
            {#each upcomingClosures as item}
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

    {#if pastClosures.length > 0}
        <PageHeader title="Tidligere ferie/lukkedage" subtitle="Historik over overståede lukkeperioder" variant="section" />
        <Table headers={['Fra dato', 'Til dato', 'Overskrift', 'Type', 'Bemærkning', '']}>
            {#each pastClosures as item}
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
{/if}