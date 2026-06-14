<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Calendar } from '@fullcalendar/core';
  import daygridPlugin from '@fullcalendar/daygrid';
  import listPlugin from '@fullcalendar/list';
  import multiMonthPlugin from '@fullcalendar/multimonth';
  import interactionPlugin from '@fullcalendar/interaction';
  import daLocale from '@fullcalendar/core/locales/da';
  import { API_BASE_URL } from '$lib/config';
  import { formatDate } from '$lib/utils/dates';

  interface Props {
    onDateClick: (dateStr: string) => void;
  }

  let { onDateClick }: Props = $props();

  let calendarEl: HTMLDivElement;
  let calendar: Calendar | undefined;

  function isMobile(): boolean {
    return window.innerWidth < 700;
  }

  function getHeaderToolbar() {
    if (isMobile()) {
      return { left: 'prev,next', center: 'title', right: 'today' };
    }
    return {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,multiMonthYear,listMonth'
    };
  }

  // Eksporteres så forælder-siden kan styre "Vis år"-knappen
  export function gotoYear(year: number) {
    if (!calendar) return;
    calendar.gotoDate(`${year}-01-01`);
    calendar.changeView('multiMonthYear');
  }

  onMount(() => {
    calendar = new Calendar(calendarEl, {
      plugins: [daygridPlugin, listPlugin, multiMonthPlugin, interactionPlugin],
      initialView: isMobile() ? 'listMonth' : 'dayGridMonth',
      locale: daLocale,
      firstDay: 1,
      weekNumbers: true,
      weekText: 'Uge',
      showNonCurrentDates: false,
      fixedWeekCount: false,
      height: 'auto',
      contentHeight: 'auto',
      expandRows: true,
      dayMaxEvents: 10,
      dayMaxEventRows: 10,
      eventOrder: 'sortOrder,title',
      eventOrderStrict: true,
      multiMonthMaxColumns: 3,
      multiMonthMinWidth: 420,
      headerToolbar: getHeaderToolbar(),
      buttonText: {
        today: 'I dag',
        month: 'Måned',
        year: 'År',
        list: 'Liste'
      },
      views: {
        multiMonthYear: {
          type: 'multiMonth',
          duration: { months: 12 },
          buttonText: 'År',
          dayMaxEvents: 10,
          dayMaxEventRows: 10
        }
      },
      // Events hentes fra API'et (absolut URL pga. separat backend)
      events: `${API_BASE_URL}/api/calendar/events`,
      dateClick: (info) => {
        onDateClick(info.dateStr);
      },
      eventContent: (arg) => {
        return { html: '<span class="fc-custom-event-title">' + arg.event.title + '</span>' };
      },
      eventClick: (info) => {
        const note = info.event.extendedProps.note
          ? '\n\n' + info.event.extendedProps.note
          : '';
        const dateStr = info.event.start
          ? formatDate(info.event.start.toISOString())
          : '';
        alert(info.event.title + '\n' + dateStr + note);
      },
      windowResize: () => {
        calendar?.setOption('headerToolbar', getHeaderToolbar());
      }
    });

    calendar.render();

    // Swipe på mobil (kun i månedsvisning)
    let touchStartX = 0;
    function handleTouchStart(e: TouchEvent) {
      touchStartX = e.changedTouches[0].screenX;
    }
    function handleTouchEnd(e: TouchEvent) {
      if (!calendar || calendar.view.type !== 'dayGridMonth') return;
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (diff > 50) calendar.next();
      if (diff < -50) calendar.prev();
    }

    calendarEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    calendarEl.addEventListener('touchend', handleTouchEnd, { passive: true });
  });

  onDestroy(() => {
    calendar?.destroy();
  });
</script>

<div id="calendar" bind:this={calendarEl}></div>