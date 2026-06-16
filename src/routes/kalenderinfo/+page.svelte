<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { notesApi } from '$lib/api/notes';
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

    const todayNotes = $derived(
        data.notes.filter((note) => {
            const noteDate = new Date(note.date);
            noteDate.setHours(0, 0, 0, 0);
            return noteDate.getTime() === today.getTime();
        })
    );

    const upcomingNotes = $derived(
        data.notes.filter((note) => {
            const noteDate = new Date(note.date);
            noteDate.setHours(0, 0, 0, 0);
            return noteDate > today;
        })
    );

    const pastNotes = $derived(
        data.notes.filter((note) => {
            const noteDate = new Date(note.date);
            noteDate.setHours(0, 0, 0, 0);
            return noteDate < today;
        })
    );

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
    {#if todayNotes.length > 0}
        <PageHeader title="I dag" subtitle="Informationer for dags dato" variant="section" />
        <Table headers={['Dato', 'Overskrift', 'Bemærkning', '']}>
            {#each todayNotes as note}
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
    {:else}
        <EmptyState message="Ingen specifikke noter for i dag." icon="✨" />
    {/if}

    {#if upcomingNotes.length > 0}
        <PageHeader title="Kommende info" subtitle="Noter og informationer for den kommende tid" variant="section" />
        <Table headers={['Dato', 'Overskrift', 'Bemærkning', '']}>
            {#each upcomingNotes as note}
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

    {#if pastNotes.length > 0}
        <PageHeader title="Tidligere info" subtitle="Historik over afholdte begivenheder og noter" variant="section" />
        <Table headers={['Dato', 'Overskrift', 'Bemærkning', '']}>
            {#each pastNotes as note}
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
{/if}