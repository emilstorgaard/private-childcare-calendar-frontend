<script lang="ts">
    import {
        type CalendarEvent,
        getEventClass,
        getWeekNumber,
        toDateStr,
        isToday,
        WEEKDAYS_SHORT,
        MONTHS
    } from '$lib/utils/calendar';

    interface Props {
        cursorDate: Date;
        eventsByDate: Map<string, CalendarEvent[]>;
        onEventClick: (ev: CalendarEvent) => void;
    }

    let { cursorDate, eventsByDate, onEventClick }: Props = $props();

    let days = $derived.by(() => {
        const year = cursorDate.getFullYear();
        const month = cursorDate.getMonth();
        const result: { date: Date; events: CalendarEvent[] }[] = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const evs = eventsByDate.get(toDateStr(date));
            if (evs && evs.length) {
                result.push({ date, events: evs });
            }
        }
        return result;
    });

    function weekdayName(d: Date): string {
        const idx = (d.getDay() + 6) % 7;
        return WEEKDAYS_SHORT[idx];
    }
</script>

<div class="list-view">
    {#if days.length === 0}
        <div class="list-empty">Ingen begivenheder i {MONTHS[cursorDate.getMonth()]}.</div>
    {/if}

    {#each days as { date, events }}
        <div class="list-day" class:today={isToday(date)}>
            <div class="list-day-header">
                <span class="list-day-weekday">{weekdayName(date)}</span>
                <span class="list-day-date">{date.getDate()}. {MONTHS[date.getMonth()].toLowerCase()}</span>
                <span class="list-day-week">Uge {getWeekNumber(date)}</span>
            </div>
            <div class="list-events">
                {#each events as ev}
                    <button
                        type="button"
                        class="list-event"
                        onclick={() => onEventClick(ev)}
                    >
                        <span class="list-event-dot {getEventClass(ev)}"></span>
                        <span class="list-event-title">{ev.title}</span>
                    </button>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
    .list-view {
        --grid-line: #e0d8cc;
        --header-bg: #faf8f4;
        --today-bg: var(--color-brand-50);
        --text-strong: #3a342c;
        --text-muted: #9a8f80;
        --hover-bg: #fcfaf6;

        border: 1px solid var(--grid-line);
        border-radius: 14px;
        overflow: hidden;
        background: white;
        box-shadow: 0 1px 2px rgba(60, 50, 40, 0.04);
    }

    .list-empty {
        padding: 2.5rem 1rem;
        text-align: center;
        color: var(--text-muted);
        font-size: 0.95rem;
    }

    .list-day {
        border-bottom: 1px solid var(--grid-line);
    }
    .list-day:last-child {
        border-bottom: none;
    }

    .list-day-header {
        display: flex;
        align-items: baseline;
        gap: 0.55rem;
        padding: 0.55rem 0.95rem;
        background: var(--header-bg);
        font-size: 0.85rem;
    }
    .list-day.today .list-day-header {
        background: var(--today-bg);
    }
    .list-day-weekday {
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--text-muted);
    }
    .list-day-date {
        font-weight: 600;
        color: var(--text-strong);
        text-transform: capitalize;
    }
    .list-day-week {
        margin-left: auto;
        color: var(--text-muted);
        font-size: 0.78rem;
    }

    .list-events {
        display: flex;
        flex-direction: column;
    }

    .list-event {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.65rem 0.95rem;
        border: none;
        background: white;
        cursor: pointer;
        text-align: left;
        width: 100%;
        font-size: 0.9rem;
        transition: background 0.12s;
        border-top: 1px solid #f3eee8;
    }
    .list-events .list-event:first-child {
        border-top: none;
    }
    .list-event:hover {
        background: var(--hover-bg);
    }

    .list-event-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex: 0 0 auto;
    }

    .list-event-title {
        color: var(--text-strong);
        font-weight: 500;
    }
</style>