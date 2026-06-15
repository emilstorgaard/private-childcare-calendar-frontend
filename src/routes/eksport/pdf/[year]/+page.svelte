<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import daygridPlugin from '@fullcalendar/daygrid';
  import daLocale from '@fullcalendar/core/locales/da';
  import { API_BASE_URL } from '$lib/config';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const year = data.year;

  let calendarEls: HTMLDivElement[] = $state([]);
  let calendars: Calendar[] = [];

  let readyCount = $state(0);
  const allReady = $derived(readyCount >= 12);

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(year, i, 1).toLocaleDateString('da-DK', { month: 'long' })
  );

  function pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  onMount(() => {
    const readyMonths = new Set<number>();

    for (let month = 1; month <= 12; month++) {
      const el = calendarEls[month - 1];
      if (!el) continue;

      const startText = `${year}-${pad(month)}-01`;
      let nextYear = year;
      let nextMonth = month + 1;
      if (nextMonth === 13) { nextMonth = 1; nextYear++; }
      const endText = `${nextYear}-${pad(nextMonth)}-01`;

      const calendar = new Calendar(el, {
        plugins: [daygridPlugin],
        initialView: 'dayGridMonth',
        initialDate: startText,
        locale: daLocale,
        firstDay: 1,
        weekNumbers: true,
        weekText: 'Uge',
        showNonCurrentDates: false,
        fixedWeekCount: false,
        height: 'auto',        // ✅ ret fra '100%' til 'auto'
        contentHeight: 'auto', // ✅ ret fra '100%' til 'auto'
        expandRows: false,     // ✅ ret til false — expandRows kræver fast højde
        dayMaxEventRows: 10,
        dayMaxEvents: 10,
        eventOrder: 'sortOrder,title',
        eventOrderStrict: true,
        headerToolbar: false,
        events: `${API_BASE_URL}/api/calendar/events?start=${startText}&end=${endText}`,
        eventsSet: () => {
          if (!readyMonths.has(month)) {
            readyMonths.add(month);
            setTimeout(() => { readyCount = readyMonths.size; }, 150);
          }
        },
        eventContent: (arg) => ({
          html: '<span class="fc-custom-event-title">' + arg.event.title + '</span>'
        })
      });

      calendar.render();
      calendars.push(calendar);
    }
  });

  onDestroy(() => {
    calendars.forEach((c) => c.destroy());
  });

  function print() {
    window.print();
  }
</script>

<svelte:head>
  <title>PDF årsoversigt {year}</title>
</svelte:head>

<!-- Intro-sektion (skjules ved print) -->
<div class="no-print bg-white rounded-2xl border border-warm-200 shadow-sm p-6 mb-8">
  <h1 class="text-2xl font-bold text-warm-900 mb-1">PDF årsoversigt {year}</h1>
  <p class="text-warm-500 mb-5">
    Klik på knappen og vælg <strong>Gem som PDF</strong> i udskriftsdialogen.
    Brug liggende papirformat (A4 landscape) for bedst resultat.
  </p>
  <div class="flex flex-wrap gap-3">
    <button
      type="button"
      onclick={print}
      disabled={!allReady}
      class="inline-flex items-center gap-2 font-semibold rounded-xl px-4 py-2.5 text-sm bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {#if allReady}
        🖨️ Udskriv / gem som PDF
      {:else}
        <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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

<!-- Månedssider -->
{#each monthNames as monthName, i}
  <div class="print-month-page">
    <h2 class="print-month-title">{monthName} {year}</h2>
    <div class="print-month-calendar" bind:this={calendarEls[i]}></div>
  </div>
{/each}

<style>
  /* ── Skærm-layout ───────────────────────────────────── */
  .print-month-calendar {
    min-height: 400px; /* ✅ giv FullCalendar plads at rendere i */
  }

  .print-month-page {
    margin-bottom: 3rem;
    background: white;
    border-radius: 1rem;
    border: 1px solid #e8e4dd;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }

  .print-month-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #2a241f;
    text-transform: capitalize;
    margin-bottom: 1rem;
  }

  /* ── Print ──────────────────────────────────────────── */
  @media print {
    /* Skjul intro */
    :global(.no-print) {
      display: none !important;
    }

    /* Én måned pr. side */
    .print-month-page {
      page-break-after: always;
      break-after: page;
      margin: 0;
      padding: 0.5cm;
      border: none;
      box-shadow: none;
      border-radius: 0;
    }

    /* Sidste måned skal ikke have tom side efter */
    .print-month-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }

    .print-month-title {
      font-size: 1.1rem;
      margin-bottom: 0.4rem;
    }

    /* Skjul FullCalendar-navigationsknapper */
    :global(.fc-toolbar) {
      display: none !important;
    }

    /* Mindre skrift i events */
    :global(.fc-event) {
      font-size: 8px !important;
    }

    :global(.fc .fc-daygrid-day-frame) {
      min-height: 60px !important;
    }

    /* Sørg for at farver printes */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
</style>