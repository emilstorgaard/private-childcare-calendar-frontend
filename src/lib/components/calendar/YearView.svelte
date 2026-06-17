<script lang="ts">
    import { type CalendarEvent } from '$lib/utils/calendar';
    import MonthView from './MonthView.svelte';

    interface Props {
        year: number;
        eventsByDate: Map<string, CalendarEvent[]>;
        onDayClick: (d: Date) => void;
        onEventClick: (ev: CalendarEvent) => void;
    }

    let { year, eventsByDate, onDayClick, onEventClick }: Props = $props();

    const months = Array.from({ length: 12 }, (_, i) => i);

    function monthName(m: number): string {
        return new Intl.DateTimeFormat('da-DK', { month: 'long' }).format(new Date(year, m, 1));
    }
</script>

<div class="year-grid">
    {#each months as m}
        <section class="year-month">
            <header class="year-month-header">
                <h3 class="year-month-title">{monthName(m)} {year}</h3>
            </header>
            <MonthView
                cursorDate={new Date(year, m, 1)}
                {eventsByDate}
                {onDayClick}
                {onEventClick}
                maxEvents={10}
            />
        </section>
    {/each}
</div>

<style>
    .year-grid {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .year-month {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .year-month-header {
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }

    .year-month-title {
        font-size: 1.15rem;
        font-weight: 700;
        text-transform: capitalize;
        color: #3a342c;
        margin: 0;
        letter-spacing: -0.01em;
    }

    .year-month-header::after {
        content: '';
        flex: 1 1 auto;
        height: 1px;
        background: linear-gradient(
            to right,
            #e0d8cc 0%,
            rgba(224, 216, 204, 0) 100%
        );
    }

    @media (max-width: 768px) {
        .year-grid {
            gap: 1.5rem;
        }
        .year-month-title {
            font-size: 1.05rem;
        }
    }

    @media (max-width: 480px) {
        .year-grid {
            gap: 1.25rem;
        }
        .year-month-title {
            font-size: 1rem;
        }
    }
</style>