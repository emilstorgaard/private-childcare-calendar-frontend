<script lang="ts">
  import { Card, PageHeader, Button } from '$lib/components/ui';
  import { formatDate } from '$lib/utils/dates';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const d = data.dashboard;

  const stats = [
    { label: 'Aktive nu', value: d.activeNow, icon: '👶', color: 'bg-blue-50 text-blue-600' },
    { label: 'Fremtidige børn', value: d.futureChildren, icon: '📅', color: 'bg-green-50 text-green-600' },
    { label: 'På venteliste', value: d.waitingCount, icon: '📋', color: 'bg-amber-50 text-amber-600' }
  ];
</script>

<svelte:head><title>Overblik - Privat Pasning</title></svelte:head>

<PageHeader title="Overblik" subtitle="Status for din pasning lige nu" />

<!-- Nøgletal -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  {#each stats as stat}
    <Card>
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl {stat.color}">
          {stat.icon}
        </div>
        <div>
          <div class="text-3xl font-bold text-warm-900">{stat.value}</div>
          <div class="text-warm-500 text-sm">{stat.label}</div>
        </div>
      </div>
    </Card>
  {/each}
</div>

<!-- Næste ledige plads -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
  <Card>
    <h2 class="text-lg font-bold text-warm-900 mb-3 flex items-center gap-2">
      <span>🔓</span> Næste ledige plads
    </h2>
    {#if d.nextFree}
      <div class="bg-brand-50 rounded-xl p-4">
        <div class="text-2xl font-bold text-brand-700">{formatDate(d.nextFree.endDate)}</div>
        <p class="text-warm-600 mt-1">{d.nextFree.name} stopper / pladsen bliver ledig.</p>
      </div>
    {:else}
      <p class="text-warm-500">Der er ingen kommende ledige pladser registreret.</p>
    {/if}
  </Card>

  <Card>
    <h2 class="text-lg font-bold text-warm-900 mb-3 flex items-center gap-2">
      <span>📐</span> Kapacitet
    </h2>
    <div class="flex items-end gap-2 mb-2">
      <span class="text-3xl font-bold text-warm-900">{d.activeNow}</span>
      <span class="text-warm-500 mb-1">/ {d.totalPlaces} pladser</span>
    </div>
    <div class="w-full bg-warm-200 rounded-full h-3 overflow-hidden">
      <div
        class="h-full bg-brand-500 rounded-full transition-all"
        style="width: {Math.min((d.activeNow / d.totalPlaces) * 100, 100)}%"
      ></div>
    </div>
  </Card>
</div>

<!-- Hurtig oprettelse -->
<Card>
  <h2 class="text-lg font-bold text-warm-900 mb-4 flex items-center gap-2">
    <span>⚡</span> Hurtig oprettelse
  </h2>
  <div class="flex flex-wrap gap-3">
    <Button href="/sygdom-fridage/opret">🏥 Sæt barn syg/fridag</Button>
    <Button variant="secondary" href="/ferie-lukkedage/opret">🏖️ Opret ferie/lukkedage</Button>
    <Button variant="secondary" href="/kalenderinfo/opret">📝 Opret kalenderinfo</Button>
    <Button variant="secondary" href="/">📅 Åbn kalender</Button>
  </div>
</Card>