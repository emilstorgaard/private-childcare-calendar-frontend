<script lang="ts">
  import Calendar from '$lib/components/Calendar.svelte';
  import CalendarLegend from '$lib/components/CalendarLegend.svelte';
  import DateModal from '$lib/components/DateModal.svelte';
  import { PageHeader, Card, Button, Input } from '$lib/components/ui';
  import { API_BASE_URL } from '$lib/config';

  let calendarComponent: Calendar;
  let modalOpen = $state(false);
  let selectedDate = $state('');
  let exportYear = $state(new Date().getFullYear());

  function handleDateClick(dateStr: string) {
    selectedDate = dateStr;
    modalOpen = true;
  }

  function showYear() {
    calendarComponent?.gotoYear(exportYear);
  }

  function exportExcel() {
    window.location.href = `${API_BASE_URL}/api/export/year/${exportYear}/excel`;
  }

  function exportPdf() {
    window.open(`/eksport/pdf/${exportYear}`, '_blank');
  }
</script>

<svelte:head><title>Kalender - Privat Pasning</title></svelte:head>

<PageHeader title="Kalender" subtitle="Oversigt over pasning, ferie og info" />

<CalendarLegend />

<Card class="mb-5">
  <div class="flex flex-wrap items-center gap-3">
    <div class="flex items-center gap-2">
      <label for="exportYear" class="font-semibold text-warm-700">År:</label>
      <div class="w-24">
        <Input id="exportYear" type="number" bind:value={exportYear} min={2020} max={2100} />
      </div>
      <Button variant="secondary" size="sm" onclick={showYear}>Vis år</Button>
    </div>
    <div class="flex flex-wrap gap-2 sm:ml-auto">
      <Button variant="secondary" size="sm" onclick={exportExcel}>📊 Excel</Button>
      <Button variant="secondary" size="sm" onclick={exportPdf}>📄 PDF</Button>
    </div>
  </div>
</Card>

<Calendar bind:this={calendarComponent} onDateClick={handleDateClick} />

<DateModal open={modalOpen} dateStr={selectedDate} onClose={() => (modalOpen = false)} />