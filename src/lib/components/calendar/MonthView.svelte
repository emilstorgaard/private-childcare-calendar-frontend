<script lang="ts">
    import {
        type CalendarEvent,
        buildMonthGrid,
        getWeekNumber,
        getEventClass,
        toDateStr,
        isToday,
        WEEKDAYS_SHORT
    } from '$lib/utils/calendar';

    interface Props {
        cursorDate: Date;
        eventsByDate: Map<string, CalendarEvent[]>;
        onDayClick: (d: Date) => void;
        onEventClick: (ev: CalendarEvent) => void;
        maxEvents?: number;
        compact?: boolean;
    }

    let {
        cursorDate,
        eventsByDate,
        onDayClick,
        onEventClick,
        maxEvents = 10,
        compact = false
    }: Props = $props();

    let weeks = $derived(buildMonthGrid(cursorDate.getFullYear(), cursorDate.getMonth()));
    let currentMonth = $derived(cursorDate.getMonth());

    function eventsFor(d: Date): CalendarEvent[] {
        return eventsByDate.get(toDateStr(d)) ?? [];
    }
</script>

<div class="month-grid" class:compact>
    <div class="week-col-header">Uge</div>
    {#each WEEKDAYS_SHORT as wd}
        <div class="weekday-header">{wd}</div>
    {/each}

    {#each weeks as week}
        <div class="week-number">{getWeekNumber(week[0])}</div>

        {#each week as day}
            {@const inMonth = day.getMonth() === currentMonth}
            {@const dayEvents = eventsFor(day)}
            {@const todayFlag = isToday(day)}
            <div
                class="day-cell"
                class:other-month={!inMonth}
                class:today={todayFlag}
                onclick={() => inMonth && onDayClick(day)}
                role="button"
                tabindex={inMonth ? 0 : -1}
                onkeydown={(e) => e.key === 'Enter' && inMonth && onDayClick(day)}
            >
                {#if inMonth}
                    <div class="day-head">
                        <span class="day-number" class:today-number={todayFlag}>
                            {day.getDate()}
                        </span>
                    </div>
                    <div class="day-events">
                        {#each dayEvents.slice(0, maxEvents) as ev}
                            <button
                                type="button"
                                class="event-pill {getEventClass(ev)}"
                                onclick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                                title={ev.title}
                            >
                                <span class="event-title">{ev.title}</span>
                            </button>
                        {/each}
                        {#if dayEvents.length > maxEvents}
                            <div class="more-events">+{dayEvents.length - maxEvents} mere</div>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    {/each}
</div>

<style>
    .month-grid {
        --grid-line: #ece6dd;
        --grid-line-strong: #e0d8cc;
        --header-bg: #faf8f4;
        --week-col-bg: #faf8f4;
        --other-bg: #faf9f6;
        --today-bg: #f0fdf4;
        --today-accent: #22c55e;
        --text-strong: #3a342c;
        --text-muted: #9a8f80;
        --hover-bg: #fcfaf6;

        display: grid;
        grid-template-columns: 40px repeat(7, minmax(0, 1fr));
        grid-template-rows: auto;
        grid-auto-rows: minmax(96px, 1fr);
        background: white;
        border: 1px solid var(--grid-line-strong);
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 1px 2px rgba(60, 50, 40, 0.04);
        font-feature-settings: 'tnum';
    }

    .week-col-header,
    .weekday-header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 0.25rem;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        color: var(--text-muted);
        text-transform: uppercase;
        background: var(--header-bg);
        border-bottom: 1.5px solid var(--grid-line-strong);
    }
    .weekday-header:not(:last-child) {
        border-right: 1px solid var(--grid-line);
    }
    .week-col-header {
        border-right: 1px solid var(--grid-line);
    }

    .week-number {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 0.55rem;
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--text-muted);
        background: var(--week-col-bg);
        border-right: 1px solid var(--grid-line);
        border-bottom: 1px solid var(--grid-line);
    }

    .day-cell {
        position: relative;
        padding: 0.3rem 0.35rem 0.4rem;
        border-right: 1px solid var(--grid-line);
        border-bottom: 1px solid var(--grid-line);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        overflow: hidden;
        transition: background 0.15s ease;
    }
    .day-cell:nth-child(8n + 1) {
        border-right: none;
    }
    .month-grid > .day-cell:nth-last-child(-n + 7),
    .month-grid > .week-number:last-of-type {
        border-bottom: none;
    }
    .day-cell:hover {
        background: var(--hover-bg);
    }
    .day-cell:focus-visible {
        outline: 2px solid var(--today-accent);
        outline-offset: -2px;
        z-index: 1;
    }

    .other-month {
        background: var(--other-bg);
        cursor: default;
        pointer-events: none;
    }

    .today {
        background: var(--today-bg);
    }

    .day-head {
        display: flex;
        justify-content: flex-end;
        min-height: 1.5rem;
    }
    .day-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 1.5rem;
        height: 1.5rem;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-strong);
        border-radius: 999px;
        padding: 0 0.3rem;
    }
    .today-number {
        background: var(--today-accent);
        color: white;
        box-shadow: 0 2px 5px rgb(from var(--color-brand-500) r g b / 0.35);
    }

    .day-events {
        display: flex;
        flex-direction: column;
        gap: 3px;
        overflow: hidden;
        flex: 1 1 auto;
        min-height: 0;
    }

    .event-pill {
        position: relative;
        display: block;
        width: 100%;
        text-align: left;
        border: none;
        border-radius: 5px;
        padding: 2px 7px;
        font-size: 0.72rem;
        font-weight: 600;
        line-height: 1.4;
        color: white;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 0 0 auto;
        transition: transform 0.12s ease, filter 0.12s ease, box-shadow 0.12s ease;
    }
    .event-pill:hover {
        filter: brightness(1.06);
        transform: translateX(1px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }
    .event-pill:active {
        transform: scale(0.98);
    }

    .event-title {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* Fødselsdag: lys baggrund + farvet kant/tekst (matcher app.css/modal) */
    .event-pill.event-birthday {
        background-color: #fff8f8;
        border: 1px solid var(--color-event-birthday, #d32f2f);
        color: #b71c1c;
        padding: 1px 6px;
    }
    .event-pill.event-birthday:hover {
        filter: none;
        background-color: var(--color-event-birthday, #d32f2f);
        color: white;
    }

    .more-events {
        font-size: 0.68rem;
        font-weight: 600;
        color: var(--text-muted);
        padding: 1px 4px;
        flex: 0 0 auto;
        cursor: default;
    }

    .month-grid.compact {
        grid-template-columns: 30px repeat(7, minmax(0, 1fr));
        grid-template-rows: auto;
        grid-auto-rows: minmax(58px, auto);
        border-radius: 10px;
    }
    .compact .week-col-header,
    .compact .weekday-header {
        padding: 0.35rem 0.15rem;
        font-size: 0.6rem;
        letter-spacing: 0.03em;
    }
    .compact .week-number {
        font-size: 0.6rem;
        padding-top: 0.35rem;
    }
    .compact .day-cell {
        padding: 0.2rem;
        gap: 0.15rem;
    }
    .compact .day-number {
        min-width: 1.2rem;
        height: 1.2rem;
        font-size: 0.7rem;
    }
    .compact .day-head {
        min-height: 1.2rem;
    }
    .compact .event-pill {
        font-size: 0.62rem;
        padding: 1px 4px;
        border-radius: 4px;
    }

    @media (max-width: 900px) {
        .month-grid {
            grid-template-columns: 32px repeat(7, minmax(0, 1fr));
            grid-template-rows: auto;
            grid-auto-rows: minmax(80px, 1fr);
            border-radius: 10px;
        }
        .week-col-header,
        .weekday-header {
            font-size: 0.62rem;
            padding: 0.4rem 0.1rem;
        }
        .event-pill {
            font-size: 0.66rem;
            padding: 1px 5px;
        }
        .day-number {
            font-size: 0.74rem;
            min-width: 1.3rem;
            height: 1.3rem;
        }
    }

    @media (max-width: 600px) {
        .month-grid {
            grid-template-columns: 26px repeat(7, minmax(0, 1fr));
            grid-template-rows: auto;
            grid-auto-rows: minmax(70px, 1fr);
        }
        .weekday-header {
            font-size: 0.55rem;
            letter-spacing: 0;
        }
        .week-col-header {
            font-size: 0.5rem;
        }
        .event-pill {
            font-size: 0.6rem;
            padding: 1px 3px;
            border-radius: 4px;
        }
        .day-cell {
            padding: 0.2rem 0.2rem 0.3rem;
        }
        .more-events {
            font-size: 0.58rem;
        }
    }
</style>