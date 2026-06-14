<script lang="ts">
  import { page } from '$app/stores';
  import { PageHeader, Card } from '$lib/components/ui';
  import DayStatusForm from '$lib/components/forms/DayStatusForm.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let defaultDate = $derived($page.url.searchParams.get('date') ?? undefined);
</script>

<svelte:head><title>Opret sygdom/fridag - Privat Pasning</title></svelte:head>

<PageHeader title="Opret sygdom/fridag" />
<div class="max-w-2xl">
  <Card><DayStatusForm children={data.children} {defaultDate} /></Card>
</div>