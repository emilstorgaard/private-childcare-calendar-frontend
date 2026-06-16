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
        typeText: string;
        colorClass: string;
        isBirthday: boolean;
        editUrl: string | null;
        deleteUrl: string | null;
        deleteWarning: string;
    } | null>(null);

    let confirmModalOpen = $state(false);

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
    ): { editUrl: string | null; deleteUrl: string | null; deleteWarning: string } {
        const id = extendedProps?.id as number | undefined;

        const map: Record<string, { edit: string; delete: string | null; warning: string } | null> = {
            'event-child':            id ? { edit: `/boern/${id}`, delete: `/api/children/${id}`, warning: 'Er du sikker på at du vil slette dette barn? Dette sletter også alle tilknyttede syge- og fridage!' } : null,
            'event-start':            id ? { edit: `/boern/${id}`, delete: `/api/children/${id}`, warning: 'Er du sikker på at du vil slette dette barn? Dette sletter også alle tilknyttede syge- og fridage!' } : null,
            'event-free':             id ? { edit: `/boern/${id}`, delete: `/api/children/${id}`, warning: 'Er du sikker på at du vil slette dette barn? Dette sletter også alle tilknyttede syge- og fridage!' } : null,
            'event-birthday':         id ? { edit: `/boern/${id}`, delete: `/api/children/${id}`, warning: 'Er du sikker på at du vil slette dette barn? Dette sletter også alle tilknyttede syge- og fridage!' } : null,
            'event-holiday':          null,
            'event-sick':             id ? { edit: `/sygdom-fridage/${id}`,  delete: `/api/daystatus/${id}`,      warning: 'Er du sikker på at du vil slette denne sygedag/fridag?' }      : null,
            'event-dayoff':           id ? { edit: `/sygdom-fridage/${id}`,  delete: `/api/daystatus/${id}`,      warning: 'Er du sikker på at du vil slette denne sygedag/fridag?' }      : null,
            'event-note':             id ? { edit: `/kalenderinfo/${id}`,    delete: `/api/notes/${id}`,          warning: 'Er du sikker på at du vil slette denne kalenderinfo?' }         : null,
            'event-waiting':          id ? { edit: `/venteliste/${id}`,      delete: `/api/waitinglist/${id}`,    warning: 'Er du sikker på at du vil slette denne ventelistepost?' }       : null,
            'event-closure':          id ? { edit: `/ferie-lukkedage/${id}`, delete: `/api/closureperiods/${id}`, warning: 'Er du sikker på at du vil slette denne ferie/lukkedag?' }       : null,
            'event-closure-vacation': id ? { edit: `/ferie-lukkedage/${id}`, delete: `/api/closureperiods/${id}`, warning: 'Er du sikker på at du vil slette denne ferie/lukkedag?' }       : null,
        };

        const entry = map[className] ?? null;
        return {
            editUrl:       entry?.edit    ?? null,
            deleteUrl:     entry?.delete  ?? null,
            deleteWarning: entry?.warning ?? 'Er du sikker?',
        };
    }

    async function confirmDelete() {
        if (!selectedEvent?.deleteUrl) return;

        deleting = true;
        confirmModalOpen = false;
        try {
            const res = await fetch(`${API_BASE_URL}${selectedEvent.deleteUrl}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Sletning fejlede.');
            eventModalOpen = false;
            calendar?.refetchEvents();
        } catch {
            // Vis fejl i event-modalen igen
            eventModalOpen = true;
        } finally {
            deleting = false;
        }
    }

    function handleEdit() {
        if (!selectedEvent?.editUrl) return;
        eventModalOpen = false;
        goto(selectedEvent.editUrl);
    }

    function handleDeleteClick() {
        eventModalOpen = false;
        confirmModalOpen = true;
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
            multiMonthMinWidth: 300,
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
                const { editUrl, deleteUrl, deleteWarning } = resolveUrls(extendedProps, className);

                const typeLabels: Record<string, string> = {
                    'event-child': 'Barn',
                    'event-start': 'Opstart',
                    'event-free': 'Fridag',
                    'event-birthday': 'Fødselsdag',
                    'event-holiday': 'Helligdag',
                    'event-sick': 'Sygedag',
                    'event-dayoff': 'Fridag',
                    'event-note': 'Kalenderinfo',
                    'event-waiting': 'Venteliste',
                    'event-closure': 'Lukkedag',
                    'event-closure-vacation': 'Ferie',
                };

                selectedEvent = {
                    title:         info.event.title,
                    date:          info.event.start ? formatDate(info.event.start.toISOString()) : '',
                    note:          (extendedProps.note as string) ?? '',
                    typeText:      typeLabels[className] ?? 'Begivenhed',
                    colorClass:    className,
                    isBirthday:    className === 'event-birthday',
                    editUrl,
                    deleteUrl,
                    deleteWarning,
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
    {#if selectedEvent?.typeText}
        <div class="mb-4">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold 
                {selectedEvent.isBirthday ? 'bg-event-birthday-bg text-event-birthday border border-event-birthday' : selectedEvent.colorClass + ' text-white'}">
                {selectedEvent.typeText}
            </span>
        </div>
    {/if}

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
                <Button variant="danger" onclick={handleDeleteClick} disabled={deleting}>
                    {deleting ? 'Sletter…' : '🗑️ Slet'}
                </Button>
            {/if}
        </div>
    {/if}
</Modal>

<Modal
    open={confirmModalOpen}
    title="Bekræft sletning"
    onClose={() => { confirmModalOpen = false; eventModalOpen = true; }}
>
    <p class="text-warm-700 mb-6">{selectedEvent?.deleteWarning ?? 'Er du sikker?'}</p>
    <div class="flex flex-wrap gap-2">
        <Button variant="danger" onclick={confirmDelete} disabled={deleting}>
            {deleting ? 'Sletter…' : '🗑️ Ja, slet'}
        </Button>
        <Button
            variant="secondary"
            onclick={() => { confirmModalOpen = false; eventModalOpen = true; }}
        >
            Annuller
        </Button>
    </div>
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

    /* ---- Cursor pointer på alle events ---- */
    :global(.fc-list),
    :global(.fc .fc-list-table),
    :global(.fc .fc-list-event),
    :global(.fc .fc-list-event td),
    :global(.fc .fc-list-event-hoverable),
    :global(.fc .fc-list-event *),
    :global(.fc .fc-event),
    :global(.fc .fc-daygrid-event),
    :global(.fc .fc-daygrid-dot-event),
    :global(.fc .fc-timegrid-event),
    :global(.fc .fc-event-main),
    :global(.fc-custom-event-title) {
        cursor: pointer !important;
    }

    :global(.fc .fc-list-event-title),
    :global(.fc .fc-list-event-graphic) {
        pointer-events: auto !important;
    }

    /* ---- LIST-view: sæt hover-variabel + override td direkte ---- */
    :global(.fc) {
        --fc-list-event-hover-bg-color: transparent !important;
    }

    :global(.fc .fc-list-event:hover),
    :global(.fc .fc-list-event:hover td),
    :global(.fc .fc-list-event-hoverable:hover),
    :global(.fc .fc-list-event-hoverable:hover td),
    :global(.fc .fc-list-table tr:hover),
    :global(.fc .fc-list-table tr:hover td),
    :global(.fc-theme-standard .fc-list-event:hover td) {
        background-color: transparent !important;
        background: none !important;
    }

    /* ---- DAYGRID / TIMEGRID / MULTIMONTH ---- */
    /* Brug currentColor/transparent IKKE inherit (inherit = hvid fra dagcelle) */
    :global(.fc .fc-daygrid-event:hover),
    :global(.fc .fc-daygrid-dot-event:hover),
    :global(.fc .fc-h-event:hover),
    :global(.fc .fc-v-event:hover),
    :global(.fc .fc-timegrid-event:hover) {
        filter: none !important;
        opacity: 1 !important;
        box-shadow: none !important;
    }

    /* Dot-events skal forblive uden baggrund */
    :global(.fc .fc-daygrid-dot-event:hover) {
        background: none !important;
        background-color: transparent !important;
    }

    :global(.fc) {
    --fc-list-event-hover-bg-color: transparent !important;
}

:global(.fc .fc-list-event:hover),
:global(.fc .fc-list-event:hover td),
:global(.fc .fc-list-event:hover > td),
:global(.fc .fc-list-event-hoverable:hover),
:global(.fc .fc-list-event-hoverable:hover td),
:global(.fc .fc-list-table tbody tr:hover),
:global(.fc .fc-list-table tbody tr:hover td),
:global(.fc-theme-standard .fc-list-event:hover td),
:global(.fc-theme-standard .fc-list-event:hover),
:global(.fc .fc-list-day-cushion:hover),
:global(.fc table.fc-list-table tr.fc-list-event:hover td) {
    background-color: transparent !important;
    background: none !important;
    background-image: none !important;
}

</style>