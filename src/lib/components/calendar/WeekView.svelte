<script lang="ts">
	import {
		type CalendarEvent,
		getWeekNumber,
		getEventClass,
		toDateStr,
		isToday,
		WEEKDAYS_SHORT,
		MONTHS
	} from '$lib/utils/calendar';

	interface Props {
		cursorDate: Date;
		eventsByDate: Map<string, CalendarEvent[]>;
		onDayClick: (d: Date) => void;
		onEventClick: (ev: CalendarEvent) => void;
		large?: boolean;
		showWeekends?: boolean;
	}

	let {
		cursorDate,
		eventsByDate,
		onDayClick,
		onEventClick,
		large = false,
		showWeekends = true
	}: Props = $props();

	let weekDays = $derived.by(() => {
		const d = new Date(cursorDate);
		const offset = (d.getDay() + 6) % 7;
		const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - offset);
		const length = showWeekends ? 7 : 5;
		return Array.from({ length }, (_, i) => {
			const day = new Date(monday);
			day.setDate(monday.getDate() + i);
			return day;
		});
	});

	function eventsFor(d: Date): CalendarEvent[] {
		return eventsByDate.get(toDateStr(d)) ?? [];
	}

	function weekdayName(d: Date): string {
		const idx = (d.getDay() + 6) % 7;
		return WEEKDAYS_SHORT[idx];
	}
</script>

<div
	class="week-grid"
	class:large
	style="grid-template-columns: repeat({weekDays.length}, minmax(0, 1fr));"
>
	{#each weekDays as day}
		{@const dayEvents = eventsFor(day)}
		{@const todayFlag = isToday(day)}
		<div
			class="week-day"
			class:today={todayFlag}
			class:clickable={!large}
			onclick={() => !large && onDayClick(day)}
			role={large ? undefined : 'button'}
			tabindex={large ? -1 : 0}
			onkeydown={(e) => !large && e.key === 'Enter' && onDayClick(day)}
		>
			<div class="week-day-header">
				<span class="week-day-name">{weekdayName(day)}</span>
				<span class="week-day-date" class:today-date={todayFlag}>
					{day.getDate()}. {MONTHS[day.getMonth()].slice(0, 3).toLowerCase()}
				</span>
			</div>

			<div class="week-day-events">
				{#if dayEvents.length === 0}
					<div class="week-day-empty">—</div>
				{:else}
					{#each dayEvents as ev}
						{#if large}
							<div class="week-event {getEventClass(ev)}" title={ev.title}>
								<span class="week-event-title">{ev.title}</span>
							</div>
						{:else}
							<button
								type="button"
								class="week-event {getEventClass(ev)}"
								onclick={(e) => {
									e.stopPropagation();
									onEventClick(ev);
								}}
								title={ev.title}
							>
								<span class="week-event-title">{ev.title}</span>
							</button>
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.week-grid {
		--grid-line: #ece6dd;
		--grid-line-strong: #e0d8cc;
		--header-bg: #faf8f4;
		--today-bg: #f0fdf4;
		--today-accent: #22c55e;
		--text-strong: #3a342c;
		--text-muted: #9a8f80;
		--hover-bg: #fcfaf6;

		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		background: white;
		border: 1px solid var(--grid-line-strong);
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 1px 2px rgba(60, 50, 40, 0.04);
		font-feature-settings: 'tnum';
		min-height: 420px;
	}

	.week-day {
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--grid-line);
		transition: background 0.15s ease;
	}
	.week-day:last-child {
		border-right: none;
	}
	.week-day.clickable {
		cursor: pointer;
	}
	.week-day.clickable:hover {
		background: var(--hover-bg);
	}
	.week-day.clickable:focus-visible {
		outline: 2px solid var(--today-accent);
		outline-offset: -2px;
		z-index: 1;
	}
	.week-day.today {
		background: var(--today-bg);
	}

	.week-day-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		padding: 0.6rem 0.3rem;
		background: var(--header-bg);
		border-bottom: 1.5px solid var(--grid-line-strong);
	}
	.week-day.today .week-day-header {
		background: #e7fbed;
	}
	.week-day-name {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
	.week-day-date {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-strong);
		text-transform: capitalize;
	}
	.today-date {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--today-accent);
		color: white;
		border-radius: 999px;
		padding: 0.05rem 0.5rem;
		box-shadow: 0 2px 5px rgba(34, 197, 94, 0.35);
	}

	.week-day-events {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 0.4rem 0.35rem;
		flex: 1 1 auto;
	}
	.week-day-empty {
		text-align: center;
		color: var(--text-muted);
		font-size: 0.8rem;
		opacity: 0.5;
		padding-top: 0.5rem;
	}

	.week-event {
		display: block;
		width: 100%;
		text-align: left;
		border: none;
		border-radius: 6px;
		padding: 4px 8px;
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.35;
		color: white;
		cursor: pointer;
		white-space: normal;
		word-break: break-word;
		transition:
			transform 0.12s ease,
			filter 0.12s ease,
			box-shadow 0.12s ease;
	}
	button.week-event:hover {
		filter: brightness(1.06);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
	}
	button.week-event:active {
		transform: scale(0.98);
	}
	.week-event-title {
		display: block;
	}

	.week-event.event-birthday {
		background-color: var(--color-event-birthday-bg, #fff8f8);
		border: 1px solid var(--color-event-birthday, #d32f2f);
		color: #b71c1c;
		padding: 3px 7px;
	}
	button.week-event.event-birthday:hover {
		filter: none;
		background-color: var(--color-event-birthday, #d32f2f);
		color: white;
	}

	.week-grid.large {
		min-height: calc(100vh - 160px);
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(60, 50, 40, 0.1);
	}
	.large .week-day-header {
		padding: 1rem 0.5rem;
	}
	.large .week-day-name {
		font-size: 1rem;
		letter-spacing: 0.08em;
	}
	.large .week-day-date {
		font-size: 1.3rem;
		margin-top: 0.2rem;
	}
	.large .today-date {
		padding: 0.15rem 0.7rem;
		font-size: 1.3rem;
	}
	.large .week-day-events {
		gap: 8px;
		padding: 0.75rem 0.6rem;
	}
	.large .week-event {
		font-size: 1.05rem;
		padding: 8px 12px;
		border-radius: 8px;
		cursor: default;
	}
	.large .week-day-empty {
		font-size: 1rem;
	}

	@media (max-width: 900px) {
		.week-grid {
			grid-template-columns: 1fr;
			min-height: 0;
		}
		.week-day {
			border-right: none;
			border-bottom: 1px solid var(--grid-line);
		}
		.week-day:last-child {
			border-bottom: none;
		}
		.week-day-header {
			flex-direction: row;
			justify-content: space-between;
			padding: 0.55rem 0.85rem;
		}
		.week-grid.large {
			min-height: 0;
		}
	}
</style>
