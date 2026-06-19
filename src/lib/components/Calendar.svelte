<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_BASE_URL } from '$lib/config';
	import { formatDate } from '$lib/utils/dates';
	import { Modal, Button } from '$lib/components/ui';
	import { calendarApi } from '$lib/api/calendar';
	import {
		type CalendarEvent,
		groupEventsByDate,
		getEventClass,
		toDateStr,
		getWeekNumber
	} from '$lib/utils/calendar';
	import MonthView from '$lib/components/calendar/MonthView.svelte';
	import YearView from '$lib/components/calendar/YearView.svelte';
	import ListView from '$lib/components/calendar/ListView.svelte';
	import WeekView from '$lib/components/calendar/WeekView.svelte';

	interface Props {
		onDateClick: (dateStr: string) => void;
		onViewChange?: (view: string) => void;
		onLargeChange?: (large: boolean) => void;
	}

	let { onDateClick, onViewChange, onLargeChange }: Props = $props();

	let view = $state<'dayGridMonth' | 'weekGrid' | 'multiMonthYear' | 'listMonth'>('dayGridMonth');
	let cursorDate = $state(new Date());
	let largeWeek = $state(false);
	let showWeekends = $state(false);

	let events = $state<CalendarEvent[]>([]);
	let loading = $state(false);

	let eventsByDate = $derived(groupEventsByDate(events));

	const REFRESH_MINUTES = 5;

	function getStoredAutoRefresh(): boolean {
		if (typeof window === 'undefined') return false;
		try {
			const saved = localStorage.getItem('cal-auto-refresh');
			if (saved) {
				const cfg = JSON.parse(saved);
				return cfg.enabled === true;
			}
		} catch {}
		return false;
	}

	let autoRefresh = $state(getStoredAutoRefresh());
	let refreshTimer: ReturnType<typeof setInterval> | null = null;
	let lastRefresh = $state<Date | null>(null);

	function startAutoRefresh() {
		stopAutoRefresh();
		refreshTimer = setInterval(
			() => {
				loadEvents();
				lastRefresh = new Date();
			},
			REFRESH_MINUTES * 60 * 1000
		);
	}

	function stopAutoRefresh() {
		if (refreshTimer) {
			clearInterval(refreshTimer);
			refreshTimer = null;
		}
	}

	function toggleAutoRefresh() {
		autoRefresh = !autoRefresh;
		if (autoRefresh) {
			startAutoRefresh();
			lastRefresh = new Date();
		} else {
			stopAutoRefresh();
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		localStorage.setItem('cal-auto-refresh', JSON.stringify({ enabled: autoRefresh }));
	});

	let eventModalOpen = $state(false);
	let confirmModalOpen = $state(false);
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

	export function setView(v: string) {
		view = v as typeof view;
		largeWeek = false;
		onViewChange?.(view);
		onLargeChange?.(false);
		loadEvents();
	}

	function changeView(v: typeof view) {
		view = v;
		largeWeek = false;
		onViewChange?.(view);
		onLargeChange?.(false);
		loadEvents();
	}

	function getVisibleRange(): { start: string; end: string } {
		const d = cursorDate;
		if (view === 'multiMonthYear') {
			return {
				start: `${d.getFullYear()}-01-01`,
				end: `${d.getFullYear() + 1}-01-01`
			};
		}
		if (view === 'weekGrid') {
			const offset = (d.getDay() + 6) % 7;
			const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - offset);
			const start = new Date(monday);
			start.setDate(start.getDate() - 1);
			const end = new Date(monday);
			end.setDate(end.getDate() + 8);
			return { start: toDateStr(start), end: toDateStr(end) };
		}
		const start = new Date(d.getFullYear(), d.getMonth() - 1, 1);
		const end = new Date(d.getFullYear(), d.getMonth() + 2, 1);
		return { start: toDateStr(start), end: toDateStr(end) };
	}

	async function loadEvents() {
		loading = true;
		try {
			const { start, end } = getVisibleRange();
			const raw = await calendarApi.getEvents(start, end);
			events = (raw ?? []).map((ev: any) => ({
				...ev,
				id: ev.id ?? ev.extendedProps?.id,
				note: ev.note ?? ev.extendedProps?.note ?? ''
			}));
		} catch (e) {
			console.error(e);
			events = [];
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined' && window.innerWidth < 700) {
			view = 'listMonth';
			onViewChange?.(view);
		}

		if (autoRefresh) {
			startAutoRefresh();
			lastRefresh = new Date();
		}

		loadEvents();
	});

	onDestroy(() => {
		stopAutoRefresh();
	});

	function prev() {
		const d = new Date(cursorDate);
		if (view === 'multiMonthYear') d.setFullYear(d.getFullYear() - 1);
		else if (view === 'weekGrid') d.setDate(d.getDate() - 7);
		else d.setMonth(d.getMonth() - 1);
		cursorDate = d;
		loadEvents();
	}
	function next() {
		const d = new Date(cursorDate);
		if (view === 'multiMonthYear') d.setFullYear(d.getFullYear() + 1);
		else if (view === 'weekGrid') d.setDate(d.getDate() + 7);
		else d.setMonth(d.getMonth() + 1);
		cursorDate = d;
		loadEvents();
	}
	function today() {
		cursorDate = new Date();
		loadEvents();
	}

	function toggleLargeWeek() {
		largeWeek = !largeWeek;
		onLargeChange?.(largeWeek);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (largeWeek && e.key === 'Escape') {
			largeWeek = false;
			onLargeChange?.(largeWeek);
		}
	}

	function resolveUrls(extendedProps: Record<string, unknown>, className: string) {
		const id = extendedProps?.id as number | undefined;
		const childWarning =
			'Er du sikker på at du vil slette dette barn? Dette sletter også alle tilknyttede syge- og fridage!';

		const map: Record<string, { edit: string; delete: string | null; warning: string } | null> = {
			'event-child': id
				? { edit: `/boern/${id}`, delete: `/api/children/${id}`, warning: childWarning }
				: null,
			'event-start': id
				? { edit: `/boern/${id}`, delete: `/api/children/${id}`, warning: childWarning }
				: null,
			'event-free': id
				? { edit: `/boern/${id}`, delete: `/api/children/${id}`, warning: childWarning }
				: null,
			'event-birthday': id
				? { edit: `/boern/${id}`, delete: `/api/children/${id}`, warning: childWarning }
				: null,
			'event-holiday': null,
			'event-sick': id
				? {
						edit: `/sygdom-fridage/${id}`,
						delete: `/api/daystatus/${id}`,
						warning: 'Er du sikker på at du vil slette denne sygedag/fridag?'
					}
				: null,
			'event-dayoff': id
				? {
						edit: `/sygdom-fridage/${id}`,
						delete: `/api/daystatus/${id}`,
						warning: 'Er du sikker på at du vil slette denne sygedag/fridag?'
					}
				: null,
			'event-note': id
				? {
						edit: `/kalenderinfo/${id}`,
						delete: `/api/notes/${id}`,
						warning: 'Er du sikker på at du vil slette denne kalenderinfo?'
					}
				: null,
			'event-waiting': id
				? {
						edit: `/venteliste/${id}`,
						delete: `/api/waitinglist/${id}`,
						warning: 'Er du sikker på at du vil slette denne ventelistepost?'
					}
				: null,
			'event-closure': id
				? {
						edit: `/ferie-lukkedage/${id}`,
						delete: `/api/closureperiods/${id}`,
						warning: 'Er du sikker på at du vil slette denne ferie/lukkedag?'
					}
				: null,
			'event-closure-vacation': id
				? {
						edit: `/ferie-lukkedage/${id}`,
						delete: `/api/closureperiods/${id}`,
						warning: 'Er du sikker på at du vil slette denne ferie/lukkedag?'
					}
				: null
		};

		const entry = map[className] ?? null;
		return {
			editUrl: entry?.edit ?? null,
			deleteUrl: entry?.delete ?? null,
			deleteWarning: entry?.warning ?? 'Er du sikker?'
		};
	}

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
		'event-closure-vacation': 'Ferie'
	};

	function handleEventClick(ev: CalendarEvent) {
		const className = getEventClass(ev);
		const extendedProps = (ev.extendedProps ?? { id: ev.id, note: ev.note }) as Record<
			string,
			unknown
		>;
		const { editUrl, deleteUrl, deleteWarning } = resolveUrls(extendedProps, className);

		selectedEvent = {
			title: ev.title,
			date: ev.start ? formatDate(ev.start) : '',
			note: (extendedProps.note as string) ?? ev.note ?? '',
			typeText: typeLabels[className] ?? 'Begivenhed',
			colorClass: className,
			isBirthday: className === 'event-birthday',
			editUrl,
			deleteUrl,
			deleteWarning
		};
		eventModalOpen = true;
	}

	function handleDayClick(d: Date) {
		onDateClick(toDateStr(d));
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
	async function confirmDelete() {
		if (!selectedEvent?.deleteUrl) return;
		deleting = true;
		confirmModalOpen = false;
		try {
			const res = await fetch(`${API_BASE_URL}${selectedEvent.deleteUrl}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Sletning fejlede.');
			eventModalOpen = false;
			await loadEvents();
		} catch {
			eventModalOpen = true;
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="custom-calendar" class:large-mode={largeWeek}>
	{#if !largeWeek}
		<div class="cal-toolbar">
			<div class="cal-nav">
				<button type="button" class="cal-btn" onclick={prev} aria-label="Forrige">‹</button>
				<button type="button" class="cal-btn" onclick={next} aria-label="Næste">›</button>
				<button type="button" class="cal-btn cal-btn-today" onclick={today}>I dag</button>

				<button
					type="button"
					class="cal-btn cal-refresh-btn"
					class:active={autoRefresh}
					onclick={toggleAutoRefresh}
					title={autoRefresh
						? `Auto-opdatering hver ${REFRESH_MINUTES} min — klik for at slå fra`
						: `Slå auto-opdatering til (hver ${REFRESH_MINUTES} min)`}
					aria-pressed={autoRefresh}
				>
					<span class="cal-refresh-icon" class:spinning={autoRefresh}>↻</span>
					Auto
				</button>
			</div>

			<h2 class="cal-title">
				{#if view === 'multiMonthYear'}
					{cursorDate.getFullYear()}
				{:else if view === 'weekGrid'}
					Uge {getWeekNumber(cursorDate)} · {cursorDate.getFullYear()}
				{:else}
					{new Intl.DateTimeFormat('da-DK', { month: 'long', year: 'numeric' }).format(cursorDate)}
				{/if}
			</h2>

			<div class="cal-views" role="group" aria-label="Skift visning">
				<button
					type="button"
					class="cal-view-btn"
					class:active={view === 'weekGrid'}
					onclick={() => changeView('weekGrid')}>Uge</button
				>
				<button
					type="button"
					class="cal-view-btn"
					class:active={view === 'dayGridMonth'}
					onclick={() => changeView('dayGridMonth')}>Måned</button
				>
				<button
					type="button"
					class="cal-view-btn"
					class:active={view === 'multiMonthYear'}
					onclick={() => changeView('multiMonthYear')}>År</button
				>
				<button
					type="button"
					class="cal-view-btn"
					class:active={view === 'listMonth'}
					onclick={() => changeView('listMonth')}>Liste</button
				>
			</div>
		</div>

		{#if loading}
			<div class="cal-loading">Indlæser…</div>
		{/if}

		{#if view === 'dayGridMonth'}
			<MonthView
				{cursorDate}
				{eventsByDate}
				onDayClick={handleDayClick}
				onEventClick={handleEventClick}
			/>
		{:else if view === 'weekGrid'}
			<div class="week-wrapper">
				<div class="week-bar">
					<button type="button" class="cal-btn cal-btn-large" onclick={toggleLargeWeek}>
						⛶ Vis stor
					</button>

					<button
						type="button"
						class="cal-btn cal-btn-weekend"
						class:active={!showWeekends}
						onclick={() => (showWeekends = !showWeekends)}
						title={showWeekends ? 'Skjul lørdag og søndag' : 'Vis lørdag og søndag'}
						aria-pressed={!showWeekends}
					>
						{showWeekends ? '📅 Skjul weekend' : '📅 Vis weekend'}
					</button>
				</div>
				<WeekView
					{cursorDate}
					{eventsByDate}
					onDayClick={handleDayClick}
					onEventClick={handleEventClick}
					{showWeekends}
				/>
			</div>
		{:else if view === 'multiMonthYear'}
			<YearView
				year={cursorDate.getFullYear()}
				{eventsByDate}
				onDayClick={handleDayClick}
				onEventClick={handleEventClick}
			/>
		{:else}
			<ListView {cursorDate} {eventsByDate} onEventClick={handleEventClick} />
		{/if}
	{:else}
		<div class="large-toolbar">
			<button type="button" class="cal-btn" onclick={prev} aria-label="Forrige uge"
				>‹ Forrige</button
			>
			<h2 class="large-title">Uge {getWeekNumber(cursorDate)} · {cursorDate.getFullYear()}</h2>
			<div class="large-actions">
				{#if autoRefresh}
					<span class="large-refresh-badge" title="Auto-opdatering aktiv">
						<span class="cal-refresh-icon spinning">↻</span>
						{REFRESH_MINUTES}m
					</span>
				{/if}
				<button type="button" class="cal-btn cal-btn-today" onclick={today}>I dag</button>
				<button type="button" class="cal-btn" onclick={next} aria-label="Næste uge">Næste ›</button>
				<button
					type="button"
					class="cal-btn cal-btn-close"
					onclick={toggleLargeWeek}
					aria-label="Luk">✕</button
				>
			</div>
		</div>
		<WeekView
			{cursorDate}
			{eventsByDate}
			onDayClick={handleDayClick}
			onEventClick={handleEventClick}
			large
		/>
	{/if}
</div>

<Modal
	open={eventModalOpen}
	title={selectedEvent?.title ?? ''}
	subtitle={selectedEvent?.date ?? ''}
	onClose={() => (eventModalOpen = false)}
>
	{#if selectedEvent?.typeText}
		<div class="mb-4">
			<span
				class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold
                {selectedEvent.isBirthday
					? 'bg-event-birthday-bg text-event-birthday border border-event-birthday'
					: selectedEvent.colorClass + ' text-white'}"
			>
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
	onClose={() => {
		confirmModalOpen = false;
		eventModalOpen = true;
	}}
>
	<p class="text-warm-700 mb-6">{selectedEvent?.deleteWarning ?? 'Er du sikker?'}</p>
	<div class="flex flex-wrap gap-2">
		<Button variant="danger" onclick={confirmDelete} disabled={deleting}>
			{deleting ? 'Sletter…' : '🗑️ Ja, slet'}
		</Button>
		<Button
			variant="secondary"
			onclick={() => {
				confirmModalOpen = false;
				eventModalOpen = true;
			}}
		>
			Annuller
		</Button>
	</div>
</Modal>

<style>
	.custom-calendar {
		--cal-border: #e0d8cc;
		--cal-today-bg: #f0fdf4;
		--cal-accent: var(--color-brand-500);
		--cal-muted: #9a8f80;
		--cal-text: #3a342c;
	}

	.cal-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.cal-nav {
		display: flex;
		align-items: center;
		gap: 5px;
		flex: 0 0 auto;
		flex-wrap: wrap;
	}

	.cal-title {
		flex: 1 1 auto;
		text-align: center;
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--cal-text);
		text-transform: capitalize;
		letter-spacing: -0.01em;
		margin: 0;
		white-space: nowrap;
	}

	.cal-views {
		display: flex;
		flex: 0 0 auto;
		gap: 0;
		background: #f3eee6;
		border: 1px solid var(--cal-border);
		border-radius: 9px;
		padding: 3px;
	}

	.cal-btn {
		border: 1px solid var(--cal-border);
		background: white;
		border-radius: 8px;
		padding: 0.4rem 0.7rem;
		font-size: 1rem;
		line-height: 1;
		color: var(--cal-text);
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s;
	}
	.cal-btn:hover {
		background: #f5f0ea;
		border-color: #d3c8b8;
	}
	.cal-btn-today {
		font-size: 0.85rem;
		font-weight: 600;
	}

	.cal-view-btn {
		border: none;
		background: transparent;
		border-radius: 6px;
		padding: 0.38rem 0.85rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--cal-muted);
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s,
			box-shadow 0.15s;
		white-space: nowrap;
	}
	.cal-view-btn:hover {
		color: var(--cal-text);
	}
	.cal-view-btn.active {
		background: white;
		color: var(--cal-accent);
		box-shadow: 0 1px 2px rgba(60, 50, 40, 0.12);
	}

	.cal-loading {
		text-align: center;
		padding: 0.5rem;
		color: var(--cal-muted);
		font-size: 0.9rem;
	}

	/* ---- Auto-refresh ---- */
	.cal-refresh-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.85rem;
		font-weight: 600;
		margin-left: 4px;
	}
	.cal-refresh-btn.active {
		background: var(--color-brand-50, #f0fdf4);
		border-color: var(--color-brand-500, #22c55e);
		color: var(--color-brand-700, #15803d);
	}

	.cal-refresh-icon {
		display: inline-block;
		font-size: 1rem;
		line-height: 1;
	}
	.cal-refresh-icon.spinning {
		animation: cal-spin 3s linear infinite;
	}
	@keyframes cal-spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ---------- Stor / fokus-tilstand ---------- */
	.custom-calendar.large-mode {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: #faf9f7;
		padding: 1rem 1.25rem 1.5rem;
		overflow: auto;
	}

	.week-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.week-bar {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}
	.cal-btn-large,
	.cal-btn-weekend {
		font-size: 0.85rem;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.cal-btn-weekend.active {
		background: var(--color-brand-50, #f0fdf4);
		border-color: var(--color-brand-500, #22c55e);
		color: var(--color-brand-700, #15803d);
	}

	.large-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}
	.large-title {
		font-size: 1.8rem;
		font-weight: 800;
		color: var(--cal-text);
		margin: 0;
		flex: 1 1 auto;
		text-align: center;
	}
	.large-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.cal-btn-close {
		font-size: 1.1rem;
		font-weight: 700;
	}
	.large-refresh-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.4rem 0.7rem;
		background: var(--color-brand-50, #f0fdf4);
		color: var(--color-brand-700, #15803d);
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 600;
	}

	/* ---------- Responsiv ---------- */
	@media (max-width: 768px) {
		.cal-toolbar {
			justify-content: center;
		}
		.cal-title {
			order: -1;
			flex: 1 1 100%;
			font-size: 1.1rem;
		}
		.cal-nav {
			flex: 0 0 auto;
		}
		.cal-views {
			flex: 0 0 auto;
		}
		.large-title {
			font-size: 1.3rem;
			order: -1;
			flex: 1 1 100%;
		}
	}

	@media (max-width: 480px) {
		.cal-view-btn {
			padding: 0.35rem 0.6rem;
			font-size: 0.78rem;
		}
		.cal-btn {
			padding: 0.35rem 0.55rem;
			font-size: 0.9rem;
		}
		.cal-btn-today {
			font-size: 0.78rem;
		}
		.cal-refresh-btn {
			font-size: 0.78rem;
		}
	}
</style>
