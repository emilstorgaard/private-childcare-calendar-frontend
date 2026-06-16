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
    import { goto } from '$app/navigation';
    import { Modal, Button } from '$lib/components/ui';

    interface Props {
        onDateClick: (dateStr: string) => void;
    }

    let { onDateClick }: Props = $props();

    let calendarEl: HTMLDivElement;
    let calendar: Calendar | undefined;
    let currentView = $state('dayGridMonth');

    let eventModalOpen = $state(false);
    let deleting = $state(false);
    let selectedEvent = $state<{
        title: string;
        date: string;
        note: string;
        editUrl: string | null;
        deleteUrl: string | null;
    } | null>(null);

    function isMobile(): boolean {
        return window.innerWidth < 700;
    }

    function getHeaderToolbar() {
        return {
            left: 'prev,next',
            center: 'title',
            right: 'today'
        };
    }

    export function setView(view: string) {
        calendar?.changeView(view);
        currentView = view;
    }

    function resolveUrls(
        extendedProps: Record<string, unknown>,
        className: string
    ): { editUrl: string | null; deleteUrl: string | null } {
        const id = extendedProps?.id as number | undefined;

        const map: Record<string, { edit: string; delete: string | null } | null> = {
            'event-child':            id ? { edit: `/boern/${id}`,           delete: null } : null,
            'event-start':            id ? { edit: `/boern/${id}`,           delete: null } : null,
            'event-free':             id ? { edit: `/boern/${id}`,           delete: null } : null,
            'event-birthday':         id ? { edit: `/boern/${id}`,           delete: null } : null,
            'event-holiday':          null,
            'event-sick':             id ? { edit: `/sygdom-fridage/${id}`,  delete: `/api/daystatus/${id}` }      : null,
            'event-dayoff':           id ? { edit: `/sygdom-fridage/${id}`,  delete: `/api/daystatus/${id}` }      : null,
            'event-note':             id ? { edit: `/kalenderinfo/${id}`,    delete: `/api/notes/${id}` }           : null,
            'event-waiting':          id ? { edit: `/venteliste/${id}`,      delete: `/api/waitinglist/${id}` }     : null,
            'event-closure':          id ? { edit: `/ferie-lukkedage/${id}`, delete: `/api/closureperiods/${id}` }  : null,
            'event-closure-vacation': id ? { edit: `/ferie-lukkedage/${id}`, delete: `/api/closureperiods/${id}` }  : null,
        };

        const entry = map[className] ?? null;
        return {
            editUrl:   entry?.edit   ?? null,
            deleteUrl: entry?.delete ?? null,
        };
    }

    async function handleDelete() {
        if (!selectedEvent?.deleteUrl) return;
        if (!confirm('Er du sikker på at du vil slette dette?')) return;

        deleting = true;
        try {
            const res = await fetch(`${API_BASE_URL}${selectedEvent.deleteUrl}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Sletning fejlede.');
            eventModalOpen = false;
            calendar?.refetchEvents();
        } catch {
            alert('Kunne ikke slette. Prøv igen.');
        } finally {
            deleting = false;
        }
    }

    function handleEdit() {
        if (!selectedEvent?.editUrl) return;
        eventModalOpen = false;
        goto(selectedEvent.editUrl);
    }

    onMount(() => {
        currentView = isMobile() ? 'listMonth' : 'dayGridMonth';

        calendar = new Calendar(calendarEl, {
            plugins: [daygridPlugin, listPlugin, multiMonthPlugin, interactionPlugin],
            initialView: currentView,
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
            multiMonthMaxColumns: 1,
            headerToolbar: getHeaderToolbar(),
            buttonText: {
                today: 'I dag'
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
                const className = info.event.classNames[0] ?? '';
                const extendedProps = info.event.extendedProps as Record<string, unknown>;
                const { editUrl, deleteUrl } = resolveUrls(extendedProps, className);

                selectedEvent = {
                    title:     info.event.title,
                    date:      info.event.start ? formatDate(info.event.start.toISOString()) : '',
                    note:      (extendedProps.note as string) ?? '',
                    editUrl,
                    deleteUrl,
                };
                eventModalOpen = true;
            },
            viewDidMount: (info) => {
                currentView = info.view.type;
            },
            windowResize: () => {
                calendar?.setOption('headerToolbar', getHeaderToolbar());
            }
        });

        calendar.render();
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
        <p class="text-warm-700 leading-relaxed mb-5">{selectedEvent.note}</p>
    {:else}
        <p class="text-warm-400 italic mb-5">Ingen bemærkning.</p>
    {/if}

    {#if selectedEvent?.editUrl || selectedEvent?.deleteUrl}
        <div class="flex flex-wrap gap-2 pt-4 border-t border-warm-100">
            {#if selectedEvent.editUrl}
                <Button variant="secondary" onclick={handleEdit}>✏️ Rediger</Button>
            {/if}
            {#if selectedEvent.deleteUrl}
                <Button variant="danger" onclick={handleDelete} disabled={deleting}>
                    {deleting ? 'Sletter…' : '🗑️ Slet'}
                </Button>
            {/if}
        </div>
    {/if}
</Modal>

<style>
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