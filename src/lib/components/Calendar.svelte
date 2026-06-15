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
    import { Modal } from '$lib/components/ui';

    interface Props {
        onDateClick: (dateStr: string) => void;
    }

    let { onDateClick }: Props = $props();

    let calendarEl: HTMLDivElement;
    let calendar: Calendar | undefined;

    let eventModalOpen = $state(false);
    let selectedEvent = $state<{ title: string; date: string; note: string } | null>(null);

    function isMobile(): boolean {
        return window.innerWidth < 700;
    }

    function getHeaderToolbar() {
        return {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,multiMonthYear,listMonth'
        };
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
                år: 'År',
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
            events: `${API_BASE_URL}/api/calendar/events`,
            dateClick: (info) => {
                onDateClick(info.dateStr);
            },
            eventContent: (arg) => {
                return { html: '<span class="fc-custom-event-title">' + arg.event.title + '</span>' };
            },
            eventClick: (info) => {
                selectedEvent = {
                    title: info.event.title,
                    date: info.event.start ? formatDate(info.event.start.toISOString()) : '',
                    note: info.event.extendedProps.note ?? ''
                };
                eventModalOpen = true;
            },
            windowResize: () => {
                calendar?.setOption('headerToolbar', getHeaderToolbar());
            }
        });

        calendar.render();

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

<Modal
    open={eventModalOpen}
    title={selectedEvent?.title ?? ''}
    subtitle={selectedEvent?.date ?? ''}
    onClose={() => (eventModalOpen = false)}
>
    {#if selectedEvent?.note}
        <p class="text-warm-700 leading-relaxed">{selectedEvent.note}</p>
    {:else}
        <p class="text-warm-400 italic">Ingen bemærkning.</p>
    {/if}
</Modal>

<style>
    /* --- NYT: Håndtering af linjeskift i FullCalendar Toolbar --- */
    :global(.fc .fc-toolbar) {
        flex-wrap: wrap;
        row-gap: 12px;
        justify-content: space-between;
    }

    /* Tvinger højre side (visningsknapperne) ned på en ny linje og centrerer dem */
    :global(.fc .fc-toolbar .fc-toolbar-chunk:last-child) {
        flex-basis: 100%;
        display: flex;
        justify-content: center;
        margin-top: 4px;
    }
    /* ----------------------------------------------------------- */

    :global(.fc .fc-button-group) {
        gap: 4px;
    }

    :global(.fc .fc-button) {
        margin: 0 2px;
    }

    @media (max-width: 700px) {
        :global(.fc .fc-toolbar-title) {
            font-size: 1rem;
        }

        :global(.fc .fc-button) {
            padding: 0.25rem 0.5rem;
            font-size: 0.8rem;
        }

        :global(.fc .fc-list-event-title) {
            font-size: 0.85rem;
        }

        :global(.fc .fc-list-day-text),
        :global(.fc .fc-list-day-side-text) {
            font-size: 0.85rem;
        }

        :global(.fc .fc-list-event-time) {
            display: none;
        }
    }
</style>