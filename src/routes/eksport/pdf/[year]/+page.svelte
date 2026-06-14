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

  // Danske månedsnavne
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
      if (nextMonth === 13) {
        nextMonth = 1;
        nextYear++;
      }
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
        height: '100%',
        contentHeight: '100%',
        expandRows: true,
        dayMaxEventRows: 10,
        dayMaxEvents: 10,
        eventOrder: 'sortOrder,title',
        eventOrderStrict: true,
        headerToolbar: false,
        events: `${API_BASE_URL}/api/calendar/events?start=${startText}&end=${endText}`,
        eventsSet: () => {
          if (!readyMonths.has(month)) {
            readyMonths.add(month);
            setTimeout(() => {
              readyCount = readyMonths.size;
            }, 150);
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

<div class="page-header no-print">
  <h1>PDF årsoversigt {year}</h1>
</div>

<div class="print-intro no-print">
  <p>Klik på knappen og vælg <strong>Gem som PDF</strong> i udskriftsdialogen.</p>
  <div class="form-actions">
    <button class="btn" type="button" onclick={print} disabled={!allReady}>
      {allReady ? 'Udskriv / gem som PDF' : 'Klargør PDF…'}
    </button>
    <a class="btn secondary" href="/">Tilbage til kalender</a>
  </div>
</div>

{#each monthNames as monthName, i}
  <div class="print-month-page">
    <h1 class="print-month-title">{monthName} {year}</h1>
    <div class="print-month-calendar" bind:this={calendarEls[i]}></div>
  </div>
{/each}