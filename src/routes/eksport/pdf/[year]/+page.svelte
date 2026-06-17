<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { calendarApi } from '$lib/api/calendar';
    import MonthView from '$lib/components/calendar/MonthView.svelte';
    import {
        type CalendarEvent,
        groupEventsByDate
    } from '$lib/utils/calendar';

    let { data }: { data: PageData } = $props();

    const year = data.year;

    let events = $state<CalendarEvent[]>([]);
    let ready = $state(false);

    let eventsByDate = $derived(groupEventsByDate(events));

    const monthNames = Array.from({ length: 12 }, (_, i) =>
        new Date(year, i, 1).toLocaleDateString('da-DK', { month: 'long' })
    );

    async function loadEvents() {
        const start = `${year}-01-01`;
        const end = `${year + 1}-01-01`;
        try {
            const raw = await calendarApi.getEvents(start, end);
            events = (raw ?? []).map((ev: any) => ({
                ...ev,
                id: ev.id ?? ev.extendedProps?.id,
                note: ev.note ?? ev.extendedProps?.note ?? ''
            }));
        } catch (e) {
            console.error(e);
            events = [];
        } finally {
            setTimeout(() => {
                ready = true;
            }, 150);
        }
    }

    onMount(() => {
        loadEvents();
    });

    function print() {
        window.print();
    }

    function noop() {}
</script>

<svelte:head>
    <title>PDF årsoversigt {year}</title>
</svelte:head>

<div class="no-print bg-white rounded-2xl border border-warm-200 shadow-sm p-6 mb-8">
    <h1 class="text-2xl font-bold text-warm-900 mb-1">PDF årsoversigt {year}</h1>
    <p class="text-warm-500 mb-5">
        Klik på knappen og vælg <strong>Gem som PDF</strong> i udskriftsdialogen. Brug liggende papirformat
        (A4 landscape) for bedst resultat.
    </p>
    <div class="flex flex-wrap gap-3">
        <button
            type="button"
            onclick={print}
            disabled={!ready}
            class="inline-flex items-center gap-2 font-semibold rounded-xl px-4 py-2.5 text-sm bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
            {#if ready}
                🖨️ Udskriv / gem som PDF
            {:else}
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></span>
                Klargør PDF…
            {/if}
        </button>
        <a
            href="/"
            class="inline-flex items-center gap-2 font-semibold rounded-xl px-4 py-2.5 text-sm bg-warm-200 text-warm-800 hover:bg-warm-300 transition-all"
        >
            ← Tilbage til kalender
        </a>
    </div>
</div>

{#each monthNames as monthName, i}
    <div class="print-month-page">
        <h2 class="print-month-title">{monthName} {year}</h2>
        <div class="print-month-calendar">
            <MonthView
                cursorDate={new Date(year, i, 1)}
                {eventsByDate}
                onDayClick={noop}
                onEventClick={noop}
                maxEvents={10}
            />
        </div>
    </div>
{/each}

<style>
    .print-month-page {
        margin-bottom: 3rem;
        background: white;
        border-radius: 1rem;
        border: 1px solid #e8e4dd;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    .print-month-title {
        font-size: 1.4rem;
        font-weight: 700;
        color: #2a241f;
        text-transform: capitalize;
        margin-bottom: 1rem;
    }

    .print-month-calendar :global(.day-cell),
    .print-month-calendar :global(.event-pill) {
        cursor: default !important;
    }
    .print-month-calendar :global(.day-cell:hover) {
        background: white;
    }
    .print-month-calendar :global(.today) {
        background: white;
    }

    @media print {
        :global(.no-print) {
            display: none !important;
        }

        .print-month-page {
            page-break-after: always;
            break-after: page;
            margin: 0;
            padding: 0.5cm;
            border: none;
            box-shadow: none;
            border-radius: 0;
            break-inside: avoid;
        }

        .print-month-page:last-child {
            page-break-after: avoid;
            break-after: avoid;
        }

        .print-month-title {
            font-size: 1.1rem;
            margin-bottom: 0.4rem;
        }

        .print-month-calendar :global(.day-cell) {
            min-height: 0 !important;
            height: auto !important;
        }

        .print-month-calendar :global(.month-grid) {
            grid-auto-rows: minmax(60px, auto) !important;
        }

        .print-month-calendar :global(.event-pill) {
            font-size: 8px !important;
            padding: 0 3px !important;
        }

        .print-month-calendar :global(.day-number) {
            font-size: 0.7rem !important;
        }

        .print-month-calendar :global(.weekday-header),
        .print-month-calendar :global(.week-col-header),
        .print-month-calendar :global(.week-number) {
            font-size: 0.65rem !important;
        }

        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
    }
</style>